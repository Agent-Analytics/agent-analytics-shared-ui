# @agent-analytics/shared-ui

Shared UI primitives, design tokens, and site chrome for Agent Analytics properties.

Consumers install published package versions only. Do not rely on sibling-repo `dist/` fallbacks in app builds or CI.

## Exports

- `@agent-analytics/shared-ui/tokens.json`
- `@agent-analytics/shared-ui/variables.css`
- `@agent-analytics/shared-ui/tailwind.css`
- `@agent-analytics/shared-ui/recipes.css`
- `@agent-analytics/shared-ui/header`
- `@agent-analytics/shared-ui/footer`
- `@agent-analytics/shared-ui/eleventy/header.njk`
- `@agent-analytics/shared-ui/astro/Footer.astro`
- `@agent-analytics/shared-ui/eleventy/footer.njk`

## Build

```bash
npm run build
```

## Publish

```bash
npm publish --access public
```

After publishing a new version, update each consumer repo to that exact version and refresh its lockfile before pushing.

## Consumer usage

```bash
npm install @agent-analytics/shared-ui@0.2.0
```
