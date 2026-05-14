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
