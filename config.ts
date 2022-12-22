import { Config } from "./src/types";

const config: Config = {
  labels: {
    publish: [{ type: "twitter" }, { type: "mastodon" }],
    // publish_ko: [
    //   { type: "twitter", env_var_prefix: "KO_" },
    //   { type: "mastodon", env_var_prefix: "KO_" },
    // ],
  },
};

export default config;
