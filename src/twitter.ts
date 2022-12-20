import { TwitterApi } from "twitter-api-v2";
import { PostFunction, TwitterConfig } from "./types";

export const postToTwitter: PostFunction<TwitterConfig> = async ({
  issue,
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

  const result = await twitterClient.tweet(issue.body!);
  console.log("💡 result", JSON.stringify(result, null, 2));

  return { success: true };
};
