import { ActionsCore, ActionsGitHub, MediaType, PostFunction } from "./types";
// `@actions/*` must be `require`d. it didn't work with `import`.
// There must be some issue with bundling.
const core: ActionsCore = require("@actions/core");
const github: ActionsGitHub = require("@actions/github");

import config from "../config";
import { postToTwitter } from "./twitter";
import { postToMastodon } from "./mastodon";

export {};

const FUNCTION_MAP: Record<MediaType, PostFunction<any>> = {
  twitter: postToTwitter,
  mastodon: postToMastodon,
};

async function main() {
  const issue = github.context.payload.issue!;

  if (issue.labels.find((label: any) => label.name === "PUBLISHED")) {
    core.setFailed("This issue is already published.");
    return;
  }

  const labelName = github.context.payload.label.name;
  if (!config.labels[labelName]) {
    core.info(
      `The label(${labelName}) is not configured to publish the issue.`
    );
    return;
  }

  const results = await Promise.all(
    config.labels[labelName].map((media) => {
      if (!FUNCTION_MAP[media.type]) {
        core.setFailed(`Unknown type(${media.type}) found in the config.`);
        return Promise.resolve();
      }

      return FUNCTION_MAP[media.type]({ issue, config: media });
    })
  );

  core.info(JSON.stringify(results, null, 2));
}

main();
