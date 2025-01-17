---
title: Upgrade To Astro V5
pubDatetime: 2025-01-17
slug: upgrade-to-astro-v5
featured: false
draft: false
tags:
  - Astro
  - 指南
description: 2025 年的第一个计划完成！
---

2024 年 1 月，我用 [Astro](https://astro.build/) 重构了博客，当时 `v3` 已经很稳定，而 `v4` 还在 `beta` 中，

2025 年 1 月，`v5` 发布，经过四天的折腾，终于从 `v3` 跨版本升级到了 `v5`！

🎉🎉🎉

我经常会将 [lovchun.com-next](https://github.com/PassionZale/lovchun.com-next) 进行重构或者升级，对于框架升级、数据迁移都略有经验，

这篇文章将会以 [upgrade to astro v5](https://github.com/PassionZale/lovchun.com-next/pull/98) 为例，列举一些依赖库升级过程，我的一些习惯和经验。

## Node.js

任何框架进行 `major` 的升级，都会带来一些 **Breaking Changes**，

升级前首先要做的就是确定你的 `Node.js` 是否满足框架所要求的版本，

例如 [Astro@v5](https://astro.build/) 的要求：

> `v18.17.1` or `v20.3.0`, `v22.0.0` or higher. ( `v19` and `v21` are not supported.)

如果你的版本和官方要求的不一致，及时更新即可，更新版本的原则：**版本号选偶不选奇**。

## Updated docs

任何框架进行 `major` 的升级，基本会出两个文档：

- [《Major Upgrade guide》](https://docs.astro.build/en/guides/upgrade-to/v5/)

  指导你如何从 `pre major` 升级到 `latest major`。

- [《Breaking Changes》](https://docs.astro.build/en/guides/upgrade-to/v5/#breaking-changes)

  告诉你 `latest major` 对比 `pre major` 带来了哪些破坏性的更新。

官方甚至会发布升级工具，例如 `@astrojs/upgrade`，帮助你自动升级，

基本上所有的文档都是指导你如何从 `pre major` 升级到 `latest major`，

如果你想跨版本升级，要么一步步的升上来，要么浏览历史文档慢慢改造项目。

## Dependencies

`major` 所带来的新特性，除了 [Astro](https://astro.build/) 计划中的新功能以外，

还有些是可能是由它的依赖所带来的。

[Astro](https://astro.build/) 核心依赖有 [Vite](https://vite.dev/) 和 [ContentLayer](https://contentlayer.dev/)，稍加关注依赖的**重大更新**，才能更好的使用新版本。

`Content Collections API` 在从 Astro 2.x 引入后，一直持续到了 4.x 版本，

Astro 5.x 使用了全新的 `Content Collections`，参照 [官方指引](https://docs.astro.build/en/guides/upgrade-to/v5/#legacy-v20-content-collections-api) 对代码做了 [改造和重构](https://github.com/PassionZale/lovchun.com-next/commit/7053f35a8889aaa09ff51c96229051564b6e9bb5)：

- 改变内容存储目录 - `src/content/ => src/data`
- 重构配置文件 - `src/content/config.ts => src/content.config.ts`
- 重构时间轴、专栏 - `schema`

## Data Migration

[lovchun.com](https://www.lovchun.com) 从 16 年到现在，重构了 5 次：

从 `LNMP` 到 `SSR`，再到现在的 `SSG`，

从 `PHP` 到 `Python`，再到 `Nextjs`，最后到现在的 `Astro`。

> Today is Astro, tomorrow is anything!

只要我还愿意写代码，不管这次重构有多费劲，下个版本或者下下一个版本我总会想用新东西重新折腾，

除了数据，其他的都不重要，样式可以改、框架可以换，

我现在会更倾向于将内容以 `.md` 的形式存储，只让其支持自定义 `frontmatter`，

**注意是 `.md`，不是 `.mdx`，也不是其他的东西。**

我也不会在 `.md` 里面使用任何 `Astro Component`，只有纯粹的 **Markdown Syntax**，

所有静态资源：图片、视频、字体等都存储在 `/public` 中

**我相信任何 `Web Framework` 都会支持 `/public` 目录。**

数据迁移现在对我来说非常简单：

- 将 `**/*.md` 和 `/public/**/*` 复制到对应的位置
- 对接 `frontmatter` 渲染 SEO 所需要的 `metadata`

其他的小功能，例如归档、列表、标签等都是基于内容所实现的，

只需要保留 `html structure`，移植 `tailwind.config.cjs`，即可还原 UI，

剩下的就是根据 `frontmatter` 来填充内容，即可快速迁移这些功能。

## unified

程序员所写的 `.md`，一个刚需的特性就是 **语法高亮**，

整个前端有很多库可以让你的 `.md` 支持语法高亮，比较有代表性的是：

- [highlightjs](https://highlightjs.org/)
- [prismjs](https://prismjs.com/)
- [shiki](https://shiki.style/) - **🔥 最流行**

虽然 Astro 内置了 [`<Code />`](https://docs.astro.build/en/guides/syntax-highlighting/#code-) 和 [`<Prism />`](https://docs.astro.build/en/guides/syntax-highlighting/#prism-) 组件，语法高亮可以做到开箱即用。

但是我不建议使用任何组件来实现语法高亮，这不利于数据迁移。

所有基于 `*.md` 内容来渲染的站点，都会使用 [unified](https://unifiedjs.com/) 将其转换为 `AST`，

因此我建议**永远使用 [remark-plugin](https://unifiedjs.com/explore/keyword/remark-plugin/) 和 [rehype-plugin](https://unifiedjs.com/explore/keyword/rehype-plugin/) 来转换内容**：

- [awesome-remark](https://github.com/remarkjs/awesome-remark)
- [awesome-rehype](https://github.com/rehypejs/awesome-rehype)

这里列举了一些我常用的 `plugins`，你可以参考：

### Remark Plugins

- [remarkFrontmatter](https://github.com/remarkjs/remark-frontmatter) - 支持 frontmatter
- [remarkGfm](https://github.com/remarkjs/remark-gfm) - Github 风格的 Markdown
- [remarkToc](https://github.com/remarkjs/remark-toc) - 生成目录
- [remarkSmartypants](https://github.com/silvenon/remark-smartypants) - 将常见的英文引号、省略号、破折号等 ASCII 字符转换为对应的符号
- [remarkGemoji](https://github.com/remarkjs/remark-gemoji) - 将 [gemoji](https://github.com/github/gemoji) 的 [短代码](https://www.webfx.com/tools/emoji-cheat-sheet/) ( `:+1:` ) 转换为表情符号 ( `👍` )

### Rehype Plugins

- [rehypeUnwrapImages](https://github.com/rehypejs/rehype-unwrap-images) - 删除图片的父容器 `<p />`
- [rehypeFigure](https://github.com/Microflash/rehype-figure) - 使用 `<figure />` 包裹图片并增加 `<figcaption />`
- [rehypeSlug](https://github.com/rehypejs/rehype-slug) - 为标题增加 `id`，通常和 [rehypeAutolinkHeadings](https://github.com/rehypejs/rehype-autolink-headings) 同时使用
- [rehypeAutolinkHeadings](https://github.com/rehypejs/rehype-autolink-headings) - 为标题添加链接
- [rehypeCodeTitles](https://github.com/josestg/rehype-code-title) - 代码块标题
- [rehypePrismPlus](https://github.com/timlrx/rehype-prism-plus) - 代码块语法高亮
- [rehypePrettyCode](https://github.com/rehype-pretty/rehype-pretty-code) - 代码块语法高亮
- [rehypeAccessibleEmojis](https://github.com/GaiAma/Coding4GaiAma/tree/master/packages/rehype-accessible-emojis#readme) - Emoji 无障碍支持

## Route

**路由非常宝贵**，每次迁移需要保证新的站点地图和旧的站点地图完全一致。

如果你要舍弃一些旧文章，或者重构了整站的路由，你需要使用 `301` 将旧的路由重定向到新的路由：

```json title="vercel.json"
{
  "git": {
    "deploymentEnabled": {
      "dev": false
    }
  },
  "redirects": [
    {
      "source": "/posts/2018/2/13/(.*)",
      "destination": "/posts/product-sku-model-design",
      "statusCode": 301
    },
    {
      "source": "/posts/83089735-9b7e-4d49-bc98-43cd243e226e.html",
      "destination": "/posts/product-sku-model-design",
      "statusCode": 301
    },
    {
      "source": "/posts/july-interview-experience.html",
      "destination": "/posts/july-interview-experience",
      "statusCode": 301
    }
  ]
}
```