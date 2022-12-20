import { Config } from "./src/types";

const config: Config = {
  labels: {
    publish: [{ type: "twitter" }, { type: "mastodon" }],
    // PUBLISH_KO: {
    //   twitter: {
    //     env_var_prefix: "KO_",
    //   },
    //   mastodon: {
    //     env_var_prefix: "KO_",
    //   },
    // },
    // PUBLISH_EN: {
    //   twitter: {
    //     env_var_prefix: "EN_",
    //   },
    //   mastodon: {
    //     env_var_prefix: "EN_",
    //   },
    // },
  },
};

export default config;
