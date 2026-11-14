import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

// Stories import "ds-pk" like a consumer app does, but Vite resolves it to the
// library source so edits reload instantly and docgen reads the TS props.
const librarySrc = fileURLToPath(new URL("../../../src/", import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    config.resolve ??= {};
    config.resolve.alias = [
      { find: /^ds-pk$/, replacement: `${librarySrc}index.ts` },
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
    ];
    return config;
  },
};

export default config;
