import type { Preview } from "@storybook/react-vite";

import "./preview.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => (
      <div
        className={
          context.globals.theme === "dark"
            ? "dark bg-background p-6 text-foreground"
            : "bg-background p-6 text-foreground"
        }
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
