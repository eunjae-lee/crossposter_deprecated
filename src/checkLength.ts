import twitter from "twitter-text";
import { MASTODON_MAX_LENGTH, TWITTER_MAX_LENGTH } from "./const";
import { core, github } from "./github";
import { hasImage } from "./utils";

// https://github.com/actions/toolkit/tree/main/packages/github
async function main() {
  const issue = github.context.payload.issue!;
  const normalLength = issue.body!.length;
  const twitterLength = twitter.parseTweet(issue.body!).weightedLength;
  if (!process.env["GITHUB_TOKEN"]) {
    core.setFailed(
      "`GITHUB_TOKEN` is missing. You need to pass it to `.github/workflows/check-length.yml`."
    );
    return;
  }

  const octokit = github.getOctokit(process.env["GITHUB_TOKEN"]!);
  await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: issue.number,
    body: hasImage(issue.body!)
      ? [
          `🔗 The link to this issue will be prepended because the note includes image(s).`,
        ].join("\n\n")
      : [
          (twitterLength <= TWITTER_MAX_LENGTH
            ? "* [Twitter] It fits in a tweet!"
            : "* [Twitter] It will be posted with the link.") +
            ` (${twitterLength}/${TWITTER_MAX_LENGTH})`,
          (normalLength <= MASTODON_MAX_LENGTH
            ? `* [Mastodon] It fits in a toot!`
            : `* [Mastodon] It will be posted with the link.`) +
            ` (${normalLength}/${MASTODON_MAX_LENGTH})`,
        ].join("\n\n"),
  });
}

main();
