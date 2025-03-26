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
      {
        text: "基础",
        items: [
          { text: "HTML", link: "/notes/HTML" },
          { text: "CSS", link: "/notes/CSS" },
          { text: "JavaScript", link: "/notes/Javascript" },
          { text: "TypeScript", link: "/notes/Typescript" },
          { text: "NodeJS", link: "/notes/NodeJS" },
          { text: "React", link: "/notes/React" },
          { text: "Vue", link: "/notes/Vue" },
          { text: "工程化", link: "/notes/工程化" },
          { text: "计算机网络", link: "/notes/计算机网络" },
          { text: "浏览器", link: "/notes/浏览器相关" },
          { text: "Git", link: "/notes/Git" },
        ],
      },
      {
        text: "进阶",
        items: [
          { text: "数据结构和算法", link: "/notes/数据结构和算法" },
          { text: "设计模式", link: "/notes/设计模式" },
          {
            text: "场景技巧一",
            link: "/notes/场景技巧一",
          },
          {
            text: "场景技巧二",
            link: "/notes/场景技巧二",
          },
        ],
      },
      {
        text: "面经",
        items: [
          { text: "2024.3.22", link: "/interviews/2024.3.22" },
          { text: "2024.3.29", link: "/interviews/2024.3.29" },
        ],
      },
      { text: "开源仓库", link: "/opensource-repos/" },
      {
        text: "Code",
        link: "https://github.com/Time1sMoney/fuck-interview/tree/master/code",
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Time1sMoney/fuck-interview",
      },
      {
        icon: "bilibili",
        link: "https://space.bilibili.com/164577534",
      },
    ],
    footer: {
      copyright: "Copyright © 2024 Chenbin Li",
    },
    search: {
      provider: "local",
    },
  },
  srcDir: "src",
  lastUpdated: true,
  vite: {
    server: {
      open: false,
    },
  },
  sitemap: {
    hostname: "https://fuck-interview.vercel.app/",
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
});
