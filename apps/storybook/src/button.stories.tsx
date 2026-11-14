import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "ds-pk";
import type { ComponentProps } from "react";
import { fn } from "storybook/test";

type ButtonProps = ComponentProps<typeof Button>;

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const satisfies readonly NonNullable<ButtonProps["variant"]>[];

const textSizes = ["xs", "sm", "default", "lg"] as const satisfies readonly NonNullable<
  ButtonProps["size"]
>[];
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const satisfies readonly NonNullable<
  ButtonProps["size"]
>[];

/** Stand-in icon so stories don't depend on an icon library. */
function PlusIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    // react-docgen can't resolve cva's VariantProps, so the type summaries are spelled out.
    variant: {
      control: "select",
      options: variants,
      description: "Visual style.",
      table: {
        type: { summary: variants.map((v) => `"${v}"`).join(" | ") },
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: [...textSizes, ...iconSizes],
      description: "Height and padding. `icon*` sizes are square, for icon-only buttons.",
      table: {
        type: { summary: [...textSizes, ...iconSizes].map((s) => `"${s}"`).join(" | ") },
        defaultValue: { summary: "default" },
      },
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
    className: {
      control: "text",
      description: "Merged last through `cn()`, so it overrides variant classes.",
      table: { type: { summary: "string" } },
    },
    render: {
      control: false,
      description:
        "Base UI render prop: renders another element with Button's styles. Pass `nativeButton={false}` when it isn't a `<button>`.",
      table: { type: { summary: "ReactElement | (props, state) => ReactElement" } },
    },
    nativeButton: {
      control: "boolean",
      description: "Set to `false` when `render` returns a non-`<button>` element.",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "true" } },
    },
    onClick: { table: { category: "Events" } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Change every prop from the Controls panel. */
export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {textSizes.map((size) => (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {iconSizes.map((size) => (
          <Button key={size} {...args} size={size} aria-label={`Add (${size})`}>
            <PlusIcon />
          </Button>
        ))}
      </div>
    </div>
  ),
};

/** `data-icon="inline-start"` / `"inline-end"` on the icon tightens the padding on that side. */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>
        <PlusIcon data-icon="inline-start" />
        Add item
      </Button>
      <Button {...args} variant="outline">
        Next
        <PlusIcon data-icon="inline-end" />
      </Button>
    </div>
  ),
};

/** Disabled across every variant: 50% opacity, no pointer events. */
export const Disabled: Story = {
  args: { disabled: true },
  render: Variants.render,
};

/** `aria-invalid` adds the destructive border and ring, e.g. for a form's submit button. */
export const Invalid: Story = {
  args: { "aria-invalid": true },
  render: Variants.render,
};

/** `aria-expanded` keeps the hover background, as when the button opens a menu. */
export const Expanded: Story = {
  args: { "aria-expanded": true, variant: "outline" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {(["outline", "secondary", "ghost"] as const).map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** Base UI's `render` prop renders a link with Button's styles. */
export const AsLink: Story = {
  args: {
    nativeButton: false,
    render: <a href="#as-link" />,
    children: "Link styled as a button",
  },
};
