import twitter from "twitter-text";

type TrimTextParams = {
  text: string;
  maximumLength: number;
  ellipsisText?: string;
  targetLengthAfterTrimming?: number;
  getLength?: (text: string) => number;
  substring?: (text: string, length: number) => string;
};

export function trimText({
  text,
  maximumLength,
  ellipsisText = "…",
  targetLengthAfterTrimming = maximumLength,
  getLength = (text) => text.length,
  substring = (text, length) => text.substring(0, length),
}: TrimTextParams) {
  let trimmed = false;
  let result = text;
  if (
    getLength(text) > maximumLength ||
    getLength(text) > targetLengthAfterTrimming + getLength(ellipsisText)
  ) {
    result =
      substring(text, targetLengthAfterTrimming - getLength(ellipsisText)) +
      ellipsisText;
    trimmed = true;
  }
  return { trimmed, text: result };
}

export function substringForTwitter(text: string, targetLength: number) {
  // I know binary search is much better than this, but I don't care.
  // But I fear that someone might come and yell at me about this code.
  // PR is welcome.
  for (let i = 1; i < text.length - 1; i++) {
    const substr = text.substring(0, i);
    const weightedLength = twitter.parseTweet(substr).weightedLength;
    if (weightedLength === targetLength) {
      return substr;
    } else if (weightedLength > targetLength) {
      return text.substring(0, i - 1);
    }
  }
  return text;
}

export function trimTextForTwitter({
  text,
  maximumLength,
  ellipsisText = "…",
  targetLengthAfterTrimming = maximumLength,
  getLength = (text) => twitter.parseTweet(text).weightedLength,
  substring = substringForTwitter,
}: TrimTextParams) {
  return trimText({
    text,
    maximumLength,
    ellipsisText,
    targetLengthAfterTrimming,
    getLength,
    substring,
  });
}
