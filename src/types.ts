import type socialIcons from "@assets/socialIcons";

export type Site = {
	website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives?: boolean;
  editPost?: {
    url?: URL["href"];
    text?: string;
    appendFilePath?: boolean;
  };
};

export type SocialObjects = {
  name: keyof typeof socialIcons;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

export type Repository = {
  name: string;
  html_url: string;
  description: string;
  language?: string;
  stargazers_count?: number;
  forks?: number;
};

export type Talk = {
  date: string;
  title: string;
  place: string;
  preview: string;
  download?: string;
};
