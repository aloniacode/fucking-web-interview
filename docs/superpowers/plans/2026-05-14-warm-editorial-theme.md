# Warm Editorial Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Catppuccin theme with Claude Code-style Warm Editorial theme for VitePress docs site.

**Architecture:** Custom CSS variables override VitePress defaults, warm.theme.ts replaces catppuccin.theme.ts as the theme entry. Homepage gets Bento Grid layout via home.css. TypeIt animation and View Transitions preserved.

**Tech Stack:** VitePress 1.6.3, Vue 3.5, TypeIt 8.8

---

### Task 1: Create warm.css — CSS variable overrides

**Files:**
- Create: `docs/.vitepress/theme/styles/warm.css`

- [ ] **Step 1: Create styles directory and write warm.css**

```bash
mkdir -p docs/.vitepress/theme/styles
```

```css
/* Warm Editorial color tokens for VitePress */

:root {
  /* Background */
  --vp-c-bg: #f4f3ee;
  --vp-c-bg-soft: #f9f8f5;
  --vp-c-bg-elv: #ffffff;
  --vp-c-bg-alt: #f9f8f5;

  /* Text */
  --vp-c-text-1: #191817;
  --vp-c-text-2: #6b625a;
  --vp-c-text-3: #8b7f74;

  /* Brand */
  --vp-c-brand-1: #c96442;
  --vp-c-brand-2: #d47858;
  --vp-c-brand-3: #b85030;
  --vp-c-brand-soft: rgba(201, 100, 66, 0.08);

  /* Border / Divider */
  --vp-c-border: #e8e3d9;
  --vp-c-divider: #f0ede7;
  --vp-c-gutter: #e8e3d9;

  /* Code */
  --vp-c-code-bg: #f0ede7;
  --vp-c-block-bg: #faf9f6;

  /* Custom elements */
  --vp-c-gray-1: #e8e3d9;
  --vp-c-gray-2: #d4ccc0;
  --vp-c-gray-3: #a3968b;
  --vp-c-gray-soft: rgba(142, 135, 125, 0.08);

  /* Nav */
  --vp-nav-bg-color: rgba(244, 243, 238, 0.85);
  --vp-nav-height: 56px;

  /* Sidebar */
  --vp-sidebar-bg-color: rgba(249, 248, 245, 0.5);

  /* Font */
  --vp-font-family-base: -apple-system, 'Noto Sans SC', 'PingFang SC', sans-serif;
  --vp-font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Radius */
  --vp-radius: 8px;

  /* Shadows */
  --vp-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.04);
  --vp-shadow-2: 0 3px 12px rgba(0, 0, 0, 0.06);
  --vp-shadow-3: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.dark {
  --vp-c-bg: #1a1817;
  --vp-c-bg-soft: #242120;
  --vp-c-bg-elv: #2a2725;
  --vp-c-bg-alt: #242120;

  --vp-c-text-1: #f4f3ee;
  --vp-c-text-2: #a3968b;
  --vp-c-text-3: #7a6e64;

  --vp-c-brand-1: #c96442;
  --vp-c-brand-2: #d47858;
  --vp-c-brand-3: #e08a6a;
  --vp-c-brand-soft: rgba(201, 100, 66, 0.12);

  --vp-c-border: #2d2a28;
  --vp-c-divider: #2d2a28;
  --vp-c-gutter: #2d2a28;

  --vp-c-code-bg: #2a2725;
  --vp-c-block-bg: #242120;

  --vp-c-gray-1: #2d2a28;
  --vp-c-gray-2: #3d3936;
  --vp-c-gray-3: #5c5652;
  --vp-c-gray-soft: rgba(142, 135, 125, 0.08);

  --vp-nav-bg-color: rgba(26, 24, 23, 0.85);
  --vp-sidebar-bg-color: rgba(36, 33, 32, 0.5);

  --vp-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.12);
  --vp-shadow-2: 0 3px 12px rgba(0, 0, 0, 0.18);
  --vp-shadow-3: 0 8px 24px rgba(0, 0, 0, 0.24);
}

/* Glass navbar */
.VPNav {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Sidebar active link */
.VPSidebarItem .is-active > .item .link {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 6px;
}

/* Inline code */
:root :not(pre) > code {
  background: var(--vp-c-code-bg);
  color: var(--vp-c-brand-1);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.875em;
}

/* Blockquote */
.vp-doc blockquote {
  border-left: 3px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 0 8px 8px 0;
}

/* Code blocks - light */
:root .vp-doc div[class*='language-'] {
  background: var(--vp-c-block-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
}

/* Links */
.vp-doc a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--vp-c-brand-soft);
}
.vp-doc a:hover {
  color: var(--vp-c-brand-2);
  text-decoration-color: var(--vp-c-brand-1);
}

/* Buttons */
.VPButton.brand {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
  border-radius: 100px;
  padding: 10px 32px;
}
.VPButton.brand:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

/* Nav items */
.VPNavBarMenuLink:hover,
.VPNavBarMenuGroup .button:hover {
  color: var(--vp-c-brand-1);
}

.VPNavBarMenuLink.active {
  color: var(--vp-c-brand-1);
}

/* Custom h1/h2 styling with serif */
.vp-doc h1,
.vp-doc h2 {
  font-family: Georgia, 'Noto Serif SC', serif;
}
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/styles/warm.css
git commit -m "feat: add warm CSS variable overrides

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Create warm.theme.ts — theme entry point

**Files:**
- Create: `docs/.vitepress/theme/warm.theme.ts`

- [ ] **Step 1: Write warm.theme.ts**

```typescript
import DefaultTheme from 'vitepress/theme'
import './styles/warm.css'

export default DefaultTheme
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/warm.theme.ts
git commit -m "feat: add warm theme entry point

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Switch index.ts to use warm theme

**Files:**
- Modify: `docs/.vitepress/theme/index.ts`

- [ ] **Step 1: Update the import to reference warm theme instead of catppuccin**

```typescript
import type { Theme } from "vitepress";
import warmTheme from "./warm.theme";
import Layout from "./Layout.vue";
export default {
  extends: warmTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component("Tag");
  },
  Layout: Layout,
} as Theme;
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/index.ts
git commit -m "feat: switch theme entry to warm theme

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Create home.css — Bento Grid homepage styles

**Files:**
- Create: `docs/.vitepress/theme/styles/home.css`

- [ ] **Step 1: Write home.css**

```css
/* Warm Editorial Homepage */

/* Hero section */
.VPHero {
  padding: 80px 32px 64px !important;
}

.VPHero .container {
  max-width: 768px;
  margin: 0 auto;
  text-align: center;
}

.VPHero .name {
  display: none; /* Hidden, HomeHeroInfo handles title */
}

.VPHero .text {
  font-size: 20px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 12px;
}

.VPHero .tagline {
  font-size: 16px;
  color: var(--vp-c-text-3);
  margin-bottom: 36px;
}

.VPHero .image {
  display: none;
}

.VPHero .actions {
  justify-content: center;
}

/* Bento Grid features section */
.VPFeatures {
  padding: 0 32px 80px !important;
  background: var(--vp-c-bg);
}

.VPFeatures .container {
  max-width: 960px;
  margin: 0 auto;
}

.VPFeatures .items {
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr !important;
  grid-template-rows: auto auto;
  gap: 16px !important;
}

/* Large card — spans 2 rows, first column */
.VPFeatures .items .item:first-child {
  grid-row: span 2;
  grid-column: 1;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

/* Cards 2 and 3 — second column */
.VPFeatures .items .item:nth-child(2) {
  grid-row: 1;
  grid-column: 2;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 24px;
}

.VPFeatures .items .item:nth-child(3) {
  grid-row: 2;
  grid-column: 2;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 24px;
}

/* Dark accent card — third column */
.VPFeatures .items .item:nth-child(4) {
  grid-column: 3;
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border-radius: 16px;
  padding: 28px 32px;
  border: none;
  display: flex;
  align-items: center;
  gap: 24px;
}

.VPFeatures .items .item:nth-child(4) .title {
  color: var(--vp-c-bg);
}

.VPFeatures .items .item:nth-child(4) .details {
  color: var(--vp-c-text-3);
}

/* Feature item common */
.VPFeatures .item .icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.VPFeatures .item .title {
  font-family: Georgia, 'Noto Serif SC', serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.VPFeatures .item .details {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

/* Card hover */
.VPFeatures .item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.VPFeatures .item:hover {
  transform: translateY(-2px);
  box-shadow: var(--vp-shadow-2);
}

/* Responsive: single column on mobile */
@media (max-width: 768px) {
  .VPFeatures .items {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto !important;
  }

  .VPFeatures .items .item:first-child,
  .VPFeatures .items .item:nth-child(2),
  .VPFeatures .items .item:nth-child(3),
  .VPFeatures .items .item:nth-child(4) {
    grid-row: auto;
    grid-column: auto;
  }
}
```

- [ ] **Step 2: Import home.css in warm.theme.ts**

Modify `docs/.vitepress/theme/warm.theme.ts`:

```typescript
import DefaultTheme from 'vitepress/theme'
import './styles/warm.css'
import './styles/home.css'

export default DefaultTheme
```

- [ ] **Step 3: Commit**

```bash
git add docs/.vitepress/theme/styles/home.css docs/.vitepress/theme/warm.theme.ts
git commit -m "feat: add Bento Grid homepage styles

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: Update HomeHeroInfo.vue — Warm typography styles

**Files:**
- Modify: `docs/.vitepress/theme/HomeHeroInfo.vue`

- [ ] **Step 1: Update the style block in HomeHeroInfo.vue**

Replace the `<style scoped>` block with:

```css
<style scoped>
.hero {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.hero-tagline {
    font-size: 1.1rem;
    font-family: var(--vp-font-family-base);
    color: var(--vp-c-text-3);
}

.hero-description {
    font-size: 1.25rem;
    font-family: var(--vp-font-family-base);
    font-weight: 500;
    color: var(--vp-c-text-2);
    line-height: 1.6;
}

.hero-title {
    line-height: 1.2;
    color: transparent;
    font-size: 3.5rem;
    font-family: Georgia, 'Noto Serif SC', serif;
    font-weight: 700;
    background: linear-gradient(135deg, var(--vp-c-text-1) 30%, var(--vp-c-brand-1));
    background-clip: text;
    -webkit-background-clip: text;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/theme/HomeHeroInfo.vue
git commit -m "style: update HomeHeroInfo to warm typography

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: Update index.md — Bento Grid features content

**Files:**
- Modify: `docs/src/index.md`

- [ ] **Step 1: Replace the frontmatter features section**

Change the `features:` section from:

```yaml
features:
  - icon: 📖
    title: 学习 Learning
  - icon: 🧠
    title: 思考 Thinking
  - icon: 🧑‍💻
    title: 实践 Practice
```

To:

```yaml
features:
  - icon: 📚
    title: 基础八股
    details: 覆盖 HTML、CSS、JavaScript、TypeScript、React、Vue、NodeJS、工程化、计算机网络、浏览器等核心领域，系统化整理高频面试题。
  - icon: 🧠
    title: 进阶技巧
    details: 数据结构与算法、设计模式、场景题，助你应对面试中的开放性问题和技术深挖。
  - icon: 💻
    title: 代码实践
    details: 手写代码合集与最佳实践，从 polyfill 到框架原理，用代码说话。
  - icon: 🎯
    title: 真实面经
    details: 汇集多位工程师的面试实录，了解面试流程和高频考题，知己知彼。
```

- [ ] **Step 2: Commit**

```bash
git add docs/src/index.md
git commit -m "docs: update homepage features for Bento Grid

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: Update config.mts — Remove Catppuccin markdown themes

**Files:**
- Modify: `docs/.vitepress/config.mts`

- [ ] **Step 1: Remove markdown.theme config**

Delete lines 172-180 (the `markdown: { ... }` block's `theme` property):

```typescript
// Before:
  markdown: {
    image: {
      lazyLoading: true,
    },
    theme: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
  },

// After:
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
```

- [ ] **Step 2: Commit**

```bash
git add docs/.vitepress/config.mts
git commit -m "chore: remove catppuccin markdown theme config

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: Update Tag.vue — Warm color palette

**Files:**
- Modify: `docs/src/components/Tag.vue`

- [ ] **Step 1: Update the default bgColor to warm brand color**

```vue
<script setup lang="ts">
interface Props {
    text: string;
    textColor: string;
    bgColor: string;
}
const { text, textColor = '#fff', bgColor = '#c96442' } = defineProps<Props>()
</script>

<template>
    <span class="container" :style="{color:textColor,backgroundColor:bgColor }">
        {{ text }}
    </span>
</template>

<style scoped>
.container {
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add docs/src/components/Tag.vue
git commit -m "style: update Tag component to warm palette

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 9: Remove catppuccin dependency and theme file

**Files:**
- Delete: `docs/.vitepress/theme/catppuccin.theme.ts`
- Modify: `package.json`

- [ ] **Step 1: Delete catppuccin theme file**

```bash
rm docs/.vitepress/theme/catppuccin.theme.ts
```

- [ ] **Step 2: Remove @catppuccin/vitepress from package.json**

Edit `package.json`, remove from dependencies:

```json
"@catppuccin/vitepress": "^0.1.2",
```

- [ ] **Step 3: Reinstall dependencies**

```bash
pnpm install
```

Expected: `@catppuccin/vitepress` is removed from `node_modules` and `pnpm-lock.yaml`.

- [ ] **Step 4: Commit**

```bash
git add docs/.vitepress/theme/catppuccin.theme.ts package.json pnpm-lock.yaml
git commit -m "chore: remove catppuccin dependency and theme file

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 10: Build and verify

**Files:** None (verification only)

- [ ] **Step 1: Build the docs**

```bash
pnpm run build:docs
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Check dist output exists**

```bash
ls docs/.vitepress/dist/index.html
```

Expected: File exists.

- [ ] **Step 3: Start dev server and visually verify**

```bash
pnpm run dev:docs
```

Open browser to the dev server URL. Verify:
- Homepage shows Bento Grid layout
- TypeIt animation works
- Light/dark mode switch works with View Transition animation
- Document pages show Warm color scheme
- Code blocks have warm syntax highlighting
- Navigation and sidebar use warm colors

- [ ] **Step 4: Commit any final tweaks if needed**
