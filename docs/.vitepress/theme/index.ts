import type { Theme } from "vitepress";
import catppuccinTheme from "./catppuccin.theme";
import Layout from "./Layout.vue";
export default {
  extends: catppuccinTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component("Tag");
  },
  Layout: Layout,
} as Theme;
