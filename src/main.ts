import { MediaType, PostFunction } from "./types";
import { core, github } from "./github";
import config from "../config";
import { postToTwitter } from "./twitter";
import { postToMastodon } from "./mastodon";

const FUNCTION_MAP: Record<MediaType, PostFunction<any>> = {
  twitter: postToTwitter,
  mastodon: postToMastodon,
};

async function main() {
  const issue = github.context.payload.issue!;

  let issueURL = issue.html_url!;
  if (config.urlTemplate) {
    issueURL = config.urlTemplate(issue);
  }

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

  let failed = false;
  const results = await Promise.all(
    config.labels[labelName].map(async (media) => {
      if (!FUNCTION_MAP[media.type]) {
        core.setFailed(`Unknown type(${media.type}) found in the config.`);
        return Promise.resolve();
      }

      try {
        return await FUNCTION_MAP[media.type]({
          issue,
          issueURL,
          config: media,
        });
      } catch (err) {
        failed = true;
        core.setFailed((err as Error).message);
      }
    })
  );

  if (!failed) {
    core.info(JSON.stringify(results, null, 2));
  }
}

main();
