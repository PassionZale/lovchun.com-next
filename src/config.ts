import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://www.lovchun.com",
  author: "Lei Zhang",
  desc: "Articles & happiness I want to share.",
  title: "Lei Zhang",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 8,
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