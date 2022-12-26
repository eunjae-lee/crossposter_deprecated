import { PostFunction, MastodonConfig } from "./types";
import { login } from "masto";
import { cleanUpImageMarkdown } from "./twitter";
import { trimText } from "./utils";
import { MASTODON_MAX_LENGTH } from "./const";

export const postToMastodon: PostFunction<MastodonConfig> = async ({
  issue,
  issueURL,
  config,
}) => {
  const prefix = config.env_var_prefix ?? "";
  [`${prefix}MASTODON_URL`, `${prefix}MASTODON_ACCESS_TOKEN`].forEach((key) => {
    if (!process.env[key]) {
      throw new Error(
        `\`${key}\` is missing. Go to Settings > Secrets > Actions to add the token.\nMake sure you also have it in .github/workflows/publish.yml`
      );
    }
  });

  let body = cleanUpImageMarkdown(issue.body!);
  const postfixForTrimmedBody = `\n\n${issueURL}`;
  const trimResult = trimText({
    text: body,
    maximumLength: MASTODON_MAX_LENGTH,
    targetLengthAfterTrimming:
      MASTODON_MAX_LENGTH - postfixForTrimmedBody.length,
  });
  if (trimResult.trimmed) {
    body = trimResult.text + postfixForTrimmedBody;
  }

  const masto = await login({
    url: String(process.env[`${prefix}MASTODON_URL`]),
    accessToken: String(process.env[`${prefix}MASTODON_ACCESS_TOKEN`]),
  });

  try {
    const result = await masto.statuses.create({
      status: body,
      visibility: "direct",
    });
    if (result?.id) {
      return { success: true };
    } else {
      return { error: JSON.stringify(result) };
    }
  } catch (err) {
    return { error: JSON.stringify(err) };
  }
};
