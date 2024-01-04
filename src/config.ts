import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://www.lovchun.com",
  author: "Lei Zhang",
  desc: "Articles & life for my live.",
  title: "Lei Zhang",
  // ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 8,
};

export const LOCALE = {
  lang: "zh-cn", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
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
];
