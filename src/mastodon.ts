import { PostFunction, MastodonConfig } from "./types";
import { login } from "masto";
import {
  normalGetLength,
  normalSubstring,
  trimAndAttachURL,
  trimText,
} from "./utils";
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

  const body = trimAndAttachURL({
    body: issue.body!,
    issueURL,
    getLength: normalGetLength,
    maximumLength: MASTODON_MAX_LENGTH,
    substring: normalSubstring,
    trimmer: trimText,
  });

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
