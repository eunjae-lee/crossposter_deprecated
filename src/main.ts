// import core from "@actions/core";
import github from "@actions/github";
export {};

function main() {
  // const client = github.getOctokit(process.env.GITHUB_TOKEN!);
  const issue = github.context.payload.issue;
  if (!issue) {
    throw new Error("This must be invoked in the `issue` events.");
  }
  const owner = issue.organization;
  const repo = issue.repository;
  console.log(
    "💡 test",
    JSON.stringify(
      {
        payload: github.context.payload,
        owner,
        repo,
      },
      null,
      2
    )
  );
}

main();
