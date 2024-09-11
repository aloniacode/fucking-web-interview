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
      { text: "笔记", link: "/notes/" },
      { text: "面经", link: "/interviews/" },
      { text: "前端混沌图", link: "/web-chaos-graph/" },
      {
        text: "Code",
        link: "https://github.com/chenbinli-dev/fuck-interview/code",
      },
    ],
    sidebar: {
      "/notes/": [
        {
          text: "Basic",
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
          text: "Advanced",
          items: [
            { text: "数据结构和算法", link: "/notes/数据结构和算法" },
            { text: "设计模式", link: "/notes/设计模式" },
            {
              text: "场景技巧",
              link: "/notes/场景技巧",
            },
          ],
        },
      ],
      "/interviews/": [
        {
          text: "2024",
          items: [
            { text: "2024.3.22", link: "/interviews/2024.3.22" },
            { text: "2024.3.29", link: "/interviews/2024.3.29" },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/chenbinli-dev/fuck-interview",
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
