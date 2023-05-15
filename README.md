# Lei Zhang's Personal Website

This repo is built with

- [Next.js](https://nextjs.org/)
- [MDX](https://mdxjs.com/)
- [Prism themes](https://github.com/PrismJS/prism-themes)
- [Contentlayer](https://www.contentlayer.dev)
- [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- [flaticon](https://www.flaticon.com/)

## MDX Frontmatter Example

Frontmatter follows [Hugo's standards](https://gohugo.io/content-management/front-matter/).

Currently 9 fields are supported.

```
title (required)
createdAt (required)
publishedAt (optional)
updatedAt (optional, last modify date)
toc (optional)
draft (optional)
summary (optional)
tags (required, can be empty array)
components (optional)
```

Here's an example of a mdx's frontmatter:

```
---
title: 'Introducing MDX File Example'
createdAt: '2022-03-01'
publishedAt: '2022-03-07'
updatedAt: '2022-03-10'
toc: true
draft: false
summary: 'mdx file summary.'
tags: ['next-js', 'tailwind', 'guide']
components: []
---
```

## PrismPlus

### codeblock

```shell
MDX ----> remark AST ------> rehype AST --------> HTML
    parse            convert            stringify
```

### rehypeCodeTitles

```js:pages/posts/[...slug.js]
export async function getStaticPaths() {
  return {
    // dynamic paths
    paths: allPosts.map((post) => ({ params: { slug: post.slug.split('/') } })),
    // fallback set false
    fallback: false,
  }
}
```

### highlight line

```js:pages/posts/[...slug.js] {1,3-4}
export async function getStaticPaths() {
  return {
    // dynamic paths
    paths: allPosts.map((post) => ({ params: { slug: post.slug.split('/') } })),
    // fallback set false
    fallback: false,
  }
}
```

### showLineNumbers

```js:pages/posts/[...slug.js] {1,3-4} showLineNumbers
export async function getStaticPaths() {
  return {
    // dynamic paths
    paths: allPosts.map((post) => ({ params: { slug: post.slug.split('/') } })),
    // fallback set false
    fallback: false,
  }
}
```

### diff

```diff:contentlayer.config.js
+ import remarkGfm from 'remark-gfm'
+ import rehypeSlug from 'rehype-slug'
+ import rehypeAutolinkHeadings from 'rehype-autolink-headings'
+ import rehypeCodeTitles from 'rehype-code-titles'
+ import rehypePrism from 'rehype-prism-plus'
+ import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'

// ...

export default makeSource({
  mdx: {
-    remarkPlugins: [],
+    remarkPlugins: [remarkGfm],
-    rehypePlugins: [],
+    rehypePlugins: [
+      rehypeSlug,
+      rehypeCodeTitles,
+      rehypePrism,
+      rehypeAutolinkHeadings,
+      rehypeAccessibleEmojis,
    ],
  },
})
```


## Emoji Support

- [Emojipedia](https://emojipedia.org/)
- [markdown-it emoji](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json)

## Node 16+

**fix react-ioncs error**

[Deprecation - Invalid Main Field](https://github.com/react-icons/react-icons/issues/509)

```diff:node_modules/react-icons/package.json
"license": "MIT",
-"main": "lib",
+"main": "./lib/cjs/index.js",
"types": "./lib/esm/index.d.ts",
```