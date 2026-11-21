# Button

A clickable button built on Base UI's `Button` primitive and styled with Tailwind tokens from `ds-pk/theme.css`. It renders a `<button>` with `data-slot="button"` and accepts every prop of Base UI's `Button`, plus `variant` and `size`.

```tsx
import { Button } from "ds-pk"

<Button>Save</Button>
```

## Props

| Prop        | Type                                                                          | Default     | Description                                      |
| ----------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------------------ |
| `variant`   | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link"` | `"default"` | Visual style.                                    |
| `size`      | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` | Height, padding and icon size.             |
| `className` | `string`                                                                      | -           | Merged last through `cn()`, so it overrides variant classes. |
| `render`    | `ReactElement \| function`                                                    | -           | Render a different element (see below).          |
| `disabled`  | `boolean`                                                                     | `false`     | Disables the button and dims it to 50% opacity.  |

All other props (`onClick`, `type`, `ref`, `aria-*`, ...) are passed to the underlying element. `ref` is a normal prop (React 19).

## Variants

| Variant       | Use for                                    |
| ------------- | ------------------------------------------ |
| `default`     | Primary action (`bg-primary`).             |
| `secondary`   | Lower-emphasis action.                     |
| `outline`     | Bordered action on any background.         |
| `ghost`       | Toolbar or inline actions with no chrome.  |
| `destructive` | Delete or other dangerous actions (tinted, not solid). |
| `link`        | Looks like a text link.                    |

## Sizes

| Size      | Height | Notes                                  |
| --------- | ------ | -------------------------------------- |
| `xs`      | 24px   | Smaller text and 12px icons.           |
| `sm`      | 32px   |                                        |
| `default` | 36px   |                                        |
| `lg`      | 40px   |                                        |
| `icon-xs` | 24px   | Square, for icon-only buttons.         |
| `icon-sm` | 32px   | Square.                                |
| `icon`    | 36px   | Square.                                |
| `icon-lg` | 40px   | Square.                                |

## Examples

### Icons

SVG children are sized to 16px automatically (12px for `xs`) and ignore pointer events. Add `data-icon="inline-start"` or `data-icon="inline-end"` to an icon so the button trims the padding on that side.

```tsx
<Button>
  <PlusIcon data-icon="inline-start" />
  Add item
</Button>

<Button size="icon" aria-label="Settings">
  <SettingsIcon />
</Button>
```

Icon-only buttons need an `aria-label`.

### Render as a link

There is no `asChild`. Use Base UI's `render` prop and set `nativeButton={false}` when the rendered element is not a `<button>`.

```tsx
<Button nativeButton={false} render={<a href="/docs" />}>
  Docs
</Button>
```

### Invalid and expanded states

Styling follows ARIA attributes, so no extra props are needed:

- `aria-invalid` gives a destructive border and ring.
- `aria-expanded` highlights the `outline`, `secondary` and `ghost` variants (useful for menu triggers).

### Style another element like a button

`buttonVariants` is exported for elements that cannot be a `Button`.

```tsx
import { buttonVariants } from "ds-pk"

<a className={buttonVariants({ variant: "outline", size: "sm" })} href="/">
  Home
</a>
```

## Styling and tokens

- Colors, radius and focus ring come from tokens in `theme.css` (`primary`, `secondary`, `destructive`, `muted`, `border`, `input`, `ring`, `radius-md`). Override the tokens to re-theme every button.
- Target the root from CSS with `[data-slot="button"]`.
- When inside an element with `data-slot="button-group"`, buttons use `rounded-md` regardless of size.
- The component has no `"use client"` directive, so it can be used in Server Components.

## Source

[button.tsx](./button.tsx), tests in [button.test.tsx](./button.test.tsx).
