import type { Site, SocialObjects, Talk } from "./types";

export const SITE: Site = {
  website: "https://www.lovchun.com",
  author: "Lei Zhang",
  profile: "https://www.lovchun.com",
  desc: "Articles & happiness I want to share.",
  title: "Lei Zhang",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  editPost: {
    url: "https://github.com/PassionZale/lovchun.com-next/edit/main/src/data/blog",
    text: "修改",
    appendFilePath: true,
  },
};

export const LOCALE = {
  lang: "zh-CN",
  langTag: ["zh-CN"],
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/passionzale/lovchun.com-next",
    linkTitle: ` ${SITE.author} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:whouu@qq.com",
    linkTitle: `Send an email to ${SITE.author}`,
    active: true,
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/Hctmmmp3",
    linkTitle: `Join ${SITE.author} in Discord`,
    active: true,
  },
  {
    name: "Rss",
    href: "/rss.xml",
    linkTitle: `RSS Feed`,
    active: true,
  },
];

export const REPOS: `${string}/${string}`[] = [
  "PassionZale/lovchun.com-next",
  "PassionZale/talks",
  "PassionZale/geist-design",
  "PassionZale/geist-design-icons",
  "PassionZale/create-app",
  "PassionZale/type-challenges",
  "PassionZale/iMall",
  "PassionZale/JWT-RESTfull-IN-CI-Tutorial",
];

export const TALKS: Talk[] = [
  {
    date: "2023-12-08",
    title: "Setup Miniprogram",
    place: "武汉",
    preview: "https://talks.lovchun.com/2023/setup-miniprogram",
    download: "https://talks.lovchun.com/2023/setup-miniprogram/pdf",
  },
  {
    date: "2024-03-10",
    title: "Happy Coding For 10 Years",
    place: "武汉",
    preview: "https://talks.lovchun.com/2024/happy-coding-for-10-years",
    download: "https://talks.lovchun.com/2024/happy-coding-for-10-years/pdf",
  },
];
