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
    (Story, context) => {
      // Toggle .dark on <html>, as next-themes does in a consumer app, so the
      // whole canvas (body bg from theme.css) switches, not just a wrapper.
      document.documentElement.classList.toggle(
        "dark",
        context.globals.theme === "dark",
      );
      return (
        <div className="p-6">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
