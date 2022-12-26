import { ActionsCore, ActionsGitHub } from "./types";
// `@actions/*` must be `require`d. it didn't work with `import`.
// There must be some issue with bundling.
export const core: ActionsCore = require("@actions/core");
export const github: ActionsGitHub = require("@actions/github");
