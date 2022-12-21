import { PostFunction, MastodonConfig } from "./types";

export const postToMastodon: PostFunction<MastodonConfig> = async (
  {
    // issue,
    // config,
  }
) => {
  return { success: true };
};
