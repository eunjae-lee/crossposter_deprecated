import { TwitterApi } from "twitter-api-v2";
import { TWITTER_MAX_LENGTH } from "./const";
import { PostFunction, TwitterConfig } from "./types";
import {
  getLengthForTwitter,
  substringForTwitter,
  trimAndAttachURL,
  trimTextForTwitter,
} from "./utils";

// TODO: https://github.com/twitter/twitter-text

export const postToTwitter: PostFunction<TwitterConfig> = async ({
  issue,
  issueURL,
  config,
}) => {
  const prefix = config.env_var_prefix ?? "";

  [
    `${prefix}TWITTER_CONSUMER_KEY`,
    `${prefix}TWITTER_CONSUMER_SECRET`,
    `${prefix}TWITTER_ACCESS_TOKEN_KEY`,
    `${prefix}TWITTER_ACCESS_TOKEN_SECRET`,
  ].forEach((key) => {
    if (!process.env[key]) {
      throw new Error(
        `\`${key}\` is missing. Go to Settings > Secrets > Actions to add the token. You can get the token at https://developer.twitter.com`
      );
    }
  });

  // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/examples.md
  const twitterClient = new TwitterApi({
    appKey: String(process.env[`${prefix}TWITTER_CONSUMER_KEY`]),
    appSecret: String(process.env[`${prefix}TWITTER_CONSUMER_SECRET`]),
    accessToken: String(process.env[`${prefix}TWITTER_ACCESS_TOKEN_KEY`]),
    accessSecret: String(process.env[`${prefix}TWITTER_ACCESS_TOKEN_SECRET`]),
  }).readWrite.v2;

  const body = trimAndAttachURL({
    body: issue.body!,
    issueURL,
    getLength: getLengthForTwitter,
    maximumLength: TWITTER_MAX_LENGTH,
    substring: substringForTwitter,
    trimmer: trimTextForTwitter,
  });

  const result = await twitterClient.tweet(body);
  if (result?.data?.id) {
    return { success: true };
  } else {
    return { error: JSON.stringify(result) };
  }
};
