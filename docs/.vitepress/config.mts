import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Fuck Interview",
  description: "前端面试八股文笔记",
  head: [["link", { rel: "icon", type: "image/x-icon", href: "/favicon.png" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.png",
    nav: [
      { text: "", link: "/" },
      { text: "HTML", link: "/HTML" },
      { text: "CSS", link: "/CSS" },
      { text: "JavaScript", link: "/Javascript" },
      { text: "TypeScript", link: "/Typescript" },
      { text: "React", link: "/React" },
      { text: "Vue", link: "/Vue" },
      { text: "工程化", link: "/工程化" },
      { text: "计算机网络", link: "/计算机网络" },
      { text: "浏览器", link: "/浏览器相关" },
      { text: "面经", link: "/real-interview-questions" },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/chenbinli-dev/fuck-interview",
      },
    ],
    footer: {
      copyright: "Copyright © 2024 Chenbin Li",
    },
  },
  lastUpdated: true,
  vite: {
    server: {
      open: true,
    },
  },
});
