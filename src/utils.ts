import twitter from "twitter-text";
import { extname } from "path";
import { IMAGE_EXTENSIONS } from "./const";

type GetLength = (text: string) => number;
type Substring = (text: string, length: number) => string;

type TrimTextParams = {
  text: string;
  maximumLength: number;
  ellipsisText?: string;
  targetLengthAfterTrimming?: number;
  getLength?: GetLength;
  substring?: Substring;
};

type TextTrimmer = (params: TrimTextParams) => {
  trimmed: boolean;
  text: string;
};

export function trimText({
  text,
  maximumLength,
  ellipsisText = "…",
  targetLengthAfterTrimming = maximumLength,
  getLength = normalGetLength,
  substring = normalSubstring,
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

export const normalGetLength = (text: string) => text.length;

export const normalSubstring = (text: string, length: number) =>
  text.substring(0, length);

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

export const getLengthForTwitter = (text: string) =>
  twitter.parseTweet(text).weightedLength;

export function trimTextForTwitter({
  text,
  maximumLength,
  ellipsisText = "…",
  targetLengthAfterTrimming = maximumLength,
  getLength = getLengthForTwitter,
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

export function hasImage(body: string) {
  const imageMatch = body.match(/!\[.+?\]\((.+?)\)/);
  return Boolean(
    imageMatch?.[1] && IMAGE_EXTENSIONS.includes(extname(imageMatch?.[1]))
  );
}

export function cleanUpImageMarkdown(body: string) {
  return body.replaceAll(/\!\[.*?\]\((.*?)\)/g, "$1");
}

export function trimAndAttachURL({
  body,
  issueURL,
  maximumLength,
  getLength,
  trimmer,
  substring,
}: {
  body: string;
  issueURL: string;
  maximumLength: number;
  getLength: GetLength;
  trimmer: TextTrimmer;
  substring: Substring;
}) {
  let plainText = cleanUpImageMarkdown(body);
  const postfix = `\n\n${issueURL}`;
  const needPostfix = hasImage(body) || getLength(plainText) > maximumLength;
  const result = trimmer({
    text: plainText,
    maximumLength,
    targetLengthAfterTrimming:
      maximumLength - (needPostfix ? postfix.length : 0),
    getLength,
    substring,
  });
  return result.text + (needPostfix ? postfix : "");
}
