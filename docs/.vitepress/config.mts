import { defineConfig } from "vitepress";
import { La51Plugin } from "vitepress-plugin-51la";
import llmstxt from "vitepress-plugin-llms";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Fucking Web Interview",
  description: "一个开源文档网站，包含前端面试题，面试经验和开源推荐",
  head: [
    ["link", { rel: "icon", href: "/favicon.png" }],
    ["meta", { name: "author", content: "Time1sMoney" }],
    // SEO
    [
      "meta",
      {
        name: "description",
        content: "一个开源文档网站，包含前端面试题，面试经验和开源推荐。",
      },
    ],
    [
      "meta",
      {
        name: "keywords",
        content:
          "前端面试, 面试八股文, 前端面试笔记, 前端面试经验,Fucking Web Interview,React,Vue,TypeScript,NodeJS,Git,计算机网络,浏览器,数据结构和算法,设计模式,场景技巧,JS代码手写,最佳实践,面经,开源仓库",
      },
    ],
    // Open Graph
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      {
        property: "og:title",
        content:
          "Fucking Web Interview - 一个开源文档网站，包含前端面试题，面试经验和开源推荐",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: "一个开源文档网站，包含前端面试题，面试经验和开源推荐",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content:
          "https://github.com/Time1sMoney/fucking-web-interview/blob/master/images/homepage.png",
      },
    ],
    ["meta", { property: "og:url", content: "https://fkdoc.top/ " }],
    // Twitter Card
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    [
      "meta",
      { name: "twitter:title", content: "Fuck Interview - 前端面试八股文笔记" },
    ],
    [
      "meta",
      {
        name: "twitter:description",
        content: "一个包含前端面试题集合，面试经验和开源推荐的个人笔记",
      },
    ],
    [
      "meta",
      {
        name: "twitter:image",
        content:
          "https://github.com/Time1sMoney/fuck-interview/blob/master/images/homepage.png",
      },
    ],
  ],
  lang: "zh-CN",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
        text: "JS代码手写",
        link: "/notes/JS代码手写",
      },
      {
        text: "最佳实践",
        items: [
          {
            text: "React最佳实践",
            link: "/notes/React最佳实践",
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
        link: "https://github.com/aloniacode/fucking-web-interview",
      },
    ],
    footer: {
      copyright: "Made with ❤️ by Alonia",
    },
    search: {
      provider: "local",
    },
    returnToTopLabel: "返回顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
  srcDir: "src",
  lastUpdated: true,
  vite: {
    plugins: [
      llmstxt(),
      La51Plugin({
        id: "3MDxgRUArdusBKBq",
        ck: "3MDxgRUArdusBKBq",
      }),
    ],
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
    theme: {
      light: "catppuccin-latte",
      dark: "catppuccin-mocha",
    },
  },
});
