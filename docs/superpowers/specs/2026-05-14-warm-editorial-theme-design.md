# Warm Editorial VitePress Theme

## 概述

将 VitePress 主题从 Catppuccin Mocha/Mauve 替换为 Claude Code 官网的 Warm Editorial 风格。首页重新设计，文档内页替换配色，保留 TypeIt 打字动画和 View Transition 主题切换动画。

## 色彩系统

### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--vp-c-bg` | `#f4f3ee` | 页面背景 |
| `--vp-c-bg-soft` | `#f9f8f5` | 次级背景 |
| `--vp-c-bg-elv` | `#ffffff` | 卡片/浮层背景 |
| `--vp-c-text-1` | `#191817` | 主文字 |
| `--vp-c-text-2` | `#6b625a` | 副文字 |
| `--vp-c-text-3` | `#8b7f74` | 次要文字 |
| `--vp-c-brand-1` | `#c96442` | 品牌主色 |
| `--vp-c-brand-2` | `#d47858` | 品牌浅色 |
| `--vp-c-brand-3` | `#b85030` | 品牌深色 |
| `--vp-c-border` | `#e8e3d9` | 边框 |
| `--vp-c-divider` | `#f0ede7` | 分割线 |
| `--vp-c-code-bg` | `#f0ede7` | 内联代码背景 |
| `--vp-c-block-bg` | `#faf9f6` | 代码块背景 |

### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--vp-c-bg` | `#1a1817` | 页面背景 |
| `--vp-c-bg-soft` | `#242120` | 次级背景 |
| `--vp-c-bg-elv` | `#2a2725` | 卡片/浮层背景 |
| `--vp-c-text-1` | `#f4f3ee` | 主文字 |
| `--vp-c-text-2` | `#a3968b` | 副文字 |
| `--vp-c-text-3` | `#7a6e64` | 次要文字 |
| `--vp-c-brand-1` | `#c96442` | 品牌主色 |
| `--vp-c-brand-2` | `#d47858` | 品牌浅色 |
| `--vp-c-brand-3` | `#e08a6a` | 品牌深色 |
| `--vp-c-border` | `#2d2a28` | 边框 |
| `--vp-c-divider` | `#2d2a28` | 分割线 |
| `--vp-c-code-bg` | `#2a2725` | 内联代码背景 |
| `--vp-c-block-bg` | `#242120` | 代码块背景 |

## 字体

- **标题**: Georgia, "Noto Serif SC", serif
- **正文/UI**: -apple-system, "Noto Sans SC", "PingFang SC", sans-serif
- **代码**: "JetBrains Mono", "Fira Code", monospace

## 文件变更

### 新建文件

1. **`docs/.vitepress/theme/warm.theme.ts`** — Warm 主题入口，替代 catppuccin.theme.ts
   - 导入 VitePress 默认主题
   - 导入自定义 CSS 变量文件
   - 导出默认主题

2. **`docs/.vitepress/theme/styles/warm.css`** — Warm 色彩 CSS 变量
   - 定义 `:root` 下的 light 变量
   - 定义 `.dark` 下的 dark 变量
   - 覆盖 VitePress 默认 CSS 变量

3. **`docs/.vitepress/theme/styles/home.css`** — 首页 Bento Grid 样式
   - Hero 区域样式（噪点纹理、渐变背景、TypeIt 字体）
   - Bento Grid 非对称布局
   - 卡片悬停效果

### 修改文件

4. **`docs/.vitepress/theme/index.ts`** — 将 catppuccinTheme 引用改为 warmTheme

5. **`docs/.vitepress/theme/Layout.vue`** — 无需修改，已包含 View Transition 动画

6. **`docs/.vitepress/theme/HomeHeroInfo.vue`** — 更新样式
   - 标题字体改为 serif
   - 配色改为 warm token
   - 保留 TypeIt 动画逻辑

7. **`docs/src/index.md`** — 更新 frontmatter
   - features 改为更丰富的描述
   - 适配 Bento Grid 展示

8. **`docs/.vitepress/config.mts`** — 移除 markdown.theme 中的 catppuccin 引用
   - 删除 `markdown.theme.light: "catppuccin-latte"`
   - 删除 `markdown.theme.dark: "catppuccin-mocha"`

9. **`docs/src/components/Tag.vue`** — 更新配色为 warm token

### 删除文件

10. **`docs/.vitepress/theme/catppuccin.theme.ts`** — 不再使用

### 依赖变更

- 移除 `@catppuccin/vitepress` 依赖（不再需要）

## 首页设计

### Hero 区域
- 大字体 TypeIt 打字标题，serif 字体，52px，深棕 `#191817`
- 陶土色光标闪烁 `#c96442`
- 副标题 20px，暖灰 `#6b625a`
- 胶囊形 CTA 按钮，陶土色背景，白色文字
- 背景：奶油底色 + 噪点纹理叠加 + 暖色径向渐变

### Bento Grid 特性区域
- 非对称网格布局（1大卡片 + 2小卡片 + 1宽卡片）
- 圆角 16px，白色卡片，暖色边框
- 深色强调卡（`#191817` 背景）放置面经入口
- 卡片内图标 + 标题 + 描述

## 文档内页

- 导航栏：毛玻璃效果 + 暖色底部边框
- 侧边栏：当前页面高亮用陶土色背景
- 代码块：暖色背景 + 三色圆点装饰 + 自定义语法高亮
  - 标签：`#c96442` 陶土色
  - 属性：`#d4a24e` 金色
  - 字符串：`#5c8a5c` 绿色
  - 注释：`#8b7f74` 灰色
- 引用块：陶土色左边框
- 内联代码：暖色背景 `#f0ede7` + 陶土色文字

## 暗色模式

- View Transition 圆形扩散动画保留
- 暗色代码块：`#242120` 背景 + 暖色 token 调亮
- 所有 color token 同步切换到 dark 变量
