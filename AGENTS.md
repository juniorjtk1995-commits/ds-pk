# AGENTS.md

Guidance for coding agents (Claude Code, Codex, Cursor, etc.) working in this repository.

## What this is

`ds-pk` is a public React + TypeScript design system published to npm, built on shadcn/ui's `base-vega` style (**Base UI** primitives from `@base-ui/react`, not Radix, + Tailwind CSS v4 + `class-variance-authority`). Its components and tokens are copied from the Warranty Expiry Dashboard app (`Advance week/`), which owns the originals: port changes made there into this package. Consumers are **Next.js apps that already run Tailwind v4**; they `pnpm add ds-pk` and `import { Button } from "ds-pk"`.

npm names must be lowercase, so the published name is `ds-pk` (the project is called DS-PK).

## Stack

- pnpm (version pinned in `packageManager`), single package at the repo root. `pnpm-workspace.yaml` exists only for `allowBuilds`: pnpm blocks dependency install scripts unless they are approved with `pnpm approve-builds <pkg>`.
- ESM-only output (`"type": "module"`). `pnpm build` runs tsup to transpile JS, then `tsc -p tsconfig.build.json` to emit `.d.ts` beside it.
- Tailwind CSS v4, CSS-first config (`@theme` in CSS, no `tailwind.config.js`).
- Storybook (`.storybook/`, React + Vite) to preview and document components; Vitest + React Testing Library + jsdom for tests.
- TypeScript is pinned to v6 because typescript-eslint does not support TS 7 yet. Keep the pin until it does.

Use the scripts in `package.json` for build, lint, typecheck, test, and Storybook. To run one test file: `pnpm vitest run path/to/file.test.tsx`; to run one test by name, add `-t "<name>"`. `pnpm check:package` runs publint against the packed tarball.

Relative imports in `src/` use the `.js` extension (`import { cn } from "../../lib/utils.js"`). Output is unbundled ESM, so those paths ship as written, and Next.js resolves ESM packages fully specified. `"moduleResolution": "NodeNext"` makes `pnpm typecheck` fail on a missing extension.

## Architecture

- `src/components/<name>/`: one folder per component, holding the component and its `*.test.tsx` (stories go here too once Storybook work starts). Each component is re-exported from `src/index.ts`, which is the package's public API. Anything not exported there is private.
- `src/lib/utils.ts` re-exports `cn()` from the `cn` npm package (a drop-in replacement for clsx + tailwind-merge). Components import it from there, never from `"cn"` directly. Every component merges `className` through it, so consumer overrides win.
- `src/styles/theme.css`: the app's design tokens as CSS variables (`:root` and `.dark`) mapped into Tailwind with `@theme inline`, plus the `dark` custom variant and base border/background/font styles. Font variables (`--font-sans`, `--font-heading`) are left to the consumer, who sets them through `next/font`. The tsup `onSuccess` hook copies the file to `dist/theme.css`, published as `ds-pk/theme.css`.
- `.storybook/` is configured, but no stories exist yet. `preview.css` wires up Tailwind the way a consumer does, except that it scans `src/` instead of `dist/`. The toolbar's Theme switch toggles `.dark`.

### How styles reach consumers

The package ships **no compiled utility CSS**. The consumer's own Tailwind build generates the classes by scanning the package:

```css
/* consumer's app/globals.css */
@import "tailwindcss";
@import "ds-pk/theme.css";
@source "../node_modules/ds-pk/dist";
```

What follows from this:
- Write class names as complete literal strings (in `cva` variants or `cn()` calls) so the scanner can find them in `dist/`. Build variant classes from lookup maps, not string interpolation.
- Every color, radius, and font a component uses is a token in `theme.css`. Components reference token utilities (`bg-primary`, `rounded-md`), never raw hex values.
- Adding a token is a public API change: consumers may override it.
- The app also imports `tw-animate-css` and `shadcn/tailwind.css`, but `theme.css` does not, because no component here uses them. If a component needs one of their utilities, variants or keyframes (for example the `data-open` variant), move just that piece into `theme.css`.

### Next.js / RSC compatibility

- Base UI marks its own modules `"use client"`, so a wrapper that only passes props to a Base UI part (Button, TextField) has no directive and stays usable from Server Components. Add `"use client"` to a component file only when that file itself calls hooks or reads browser APIs.
- esbuild drops module-level directives when it bundles files together, which is why tsup runs with `bundle: false`: each source file becomes its own output file and keeps its directive. Keep that setting. After changing the build config, check that every `dist/` file whose source starts with `"use client"` still does.
- `react`, `react-dom` (^19), and `tailwindcss` (^4) are `peerDependencies`, and they are also listed in `devDependencies` for local work. `@base-ui/react`, `class-variance-authority`, and `cn` are regular `dependencies`. React 19 is required because components accept `ref` as a normal prop instead of using `forwardRef`.

## Component conventions (shadcn style)

- Write function components that take `React.ComponentProps<"element">` or the Base UI part's props (`ButtonPrimitive.Props`, `FieldPrimitive.Root.Props`), and spread the rest of the props onto the root. Read `node_modules/@base-ui/react` for the real props.
- To render a different element, use Base UI's `render` prop (`<Button nativeButton={false} render={<a href="/docs" />} />`). There is no `asChild`.
- Put a `data-slot="<part>"` attribute on each rendered part, as current shadcn/ui does, so consumers can target parts from CSS.
- Define variants with `cva` and export the variants function next to the component (`buttonVariants`, `textFieldInputVariants`) so consumers can style other elements the same way.
- When porting a component from the app, keep its props, classes and `data-slot`s identical, and change only imports: `cn` from `../../lib/utils.js`, never an app path such as `@/components` or a Next-only module such as `next/image`. Components that depend on something that stays in the app (Card, ProductCard, ThemeProvider) stay in the app.

## Publishing

- `package.json` `exports` publishes `.` (types + ESM import), `./theme.css`, and `./package.json`. List the CSS files in `sideEffects` so bundlers keep them.
- `files` covers only `dist/`. `prepublishOnly` runs lint, typecheck, test, build, and publint. To check the tarball contents, run `pnpm pack --dry-run`.
- Removing or renaming an export, a prop, a variant, or a token is a breaking change and needs a major version bump.
