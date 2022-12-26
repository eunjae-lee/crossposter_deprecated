import twitter from "twitter-text";
import { MASTODON_MAX_LENGTH, TWITTER_MAX_LENGTH } from "./const";
import { core, github } from "./github";

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
    body: [
      `${
        twitterLength <= TWITTER_MAX_LENGTH ? "✅" : "🚨"
      } Twitter (${twitterLength}/${TWITTER_MAX_LENGTH})`,
      `${
        normalLength <= MASTODON_MAX_LENGTH ? "✅" : "🚨"
      } Mastodon (${normalLength}/${MASTODON_MAX_LENGTH})`,
    ].join("\n\n"),
  });
}

main();
