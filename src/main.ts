// just for type definition
import { getOctokit, context } from "@actions/github";
type GitHub = {
  context: typeof context;
  getOctokit: typeof getOctokit;
};

const github: GitHub = require("@actions/github");

export {};
/*
github {
  context: Context {
    payload: {
      action: 'labeled',
      issue: [Object],
      label: [Object],
      repository: [Object],
      sender: [Object]
    },
    eventName: 'issues',
    sha: '53415434e0689a1d38bd59c0250da99d6a2ebf8f',
    ref: 'refs/heads/main',
    workflow: '.github/workflows/publish.yml',
    action: '__run',
    actor: 'eunjae-lee',
    job: 'run_if_label_matches',
    runNumber: 17,
    runId: 3741856962,
    apiUrl: 'https://api.github.com',
    serverUrl: 'https://github.com',
    graphqlUrl: 'https://api.github.com/graphql'
  },
  getOctokit: [Function: getOctokit]
}
*/

function main() {
  const issue = github.context.payload.issue!;
  // const { body } = issue;
  if (issue.labels.find((label: any) => label.name === "PUBLISHED")) {
    throw new Error("This is already published.");
  }

  const labelName = github.context.payload.label.name;
  if (labelName === "PUBLISHED") {
  }
}

main();
