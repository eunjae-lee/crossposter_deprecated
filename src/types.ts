type Label = string;

export type MediaType = "twitter" | "mastodon";

export type TwitterConfig = {
  type: "twitter";
  env_var_prefix?: string;
};

export type MastodonConfig = {
  type: "mastodon";
};

export type ConfigPerLabel = Array<TwitterConfig | MastodonConfig>;

export type Config = {
  labels: Record<Label, ConfigPerLabel>;
};

// these imports are just for type definition
// because these ESM modules didn't work with @vercel/ncc for unknown reason
import { getOctokit, context } from "@actions/github";
import { info, setFailed } from "@actions/core";
import type { WebhookPayload } from "@actions/github/lib/interfaces";

export type Issue = Exclude<WebhookPayload["issue"], undefined>;

export type ActionsGitHub = {
  context: typeof context;
  getOctokit: typeof getOctokit;
};

export type ActionsCore = {
  info: typeof info;
  setFailed: typeof setFailed;
};

export type PostFunction<TConfig> = (params: {
  issue: Issue;
  config: TConfig;
}) => Promise<{ success: true } | { error: string }>;
