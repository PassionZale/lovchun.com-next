---
layout: ../../layouts/AboutLayout.astro
title: "关于"
---

## lovchun.com

- `love` 缺省字母 `e` ；

## 站点由哪些所构建

- [Vercel](https://vercel.com)
- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Markdown](https://www.markdownguide.org/)

## 我曾使用过的技术栈

### 客户端

- `Gulp`
- `Webpack`
- `Nodejs`
- `Vuejs`
- `Reactjs`
- `Nextjs`
- `Typescript`
- `Miniprogram`

### 服务端

- `PHP` : Codeigniter、Laravel、ThinkPHP、Phalcon
- `Python` : Flask、Django
- `Nestjs`
- `Docker`
- `Nginx`
- `Mysql`
- `Memcache`
- `Supervisor`

## 我这几年的工作

涉及过金融、邮箱、网站、新零售等业务。

早先 `PHP` + `Require.js` + `jQuery` + `Bootstrap` 全栈工作了三年，后面 `Angular` 横空出世，再到 `Reactjs` 和 `Vuejs`，前后端分离趋势流行后，便一直在前端领域摸爬滚打，精通基于 `Json Web Token` 的前后端分离。

最近两年主要工作从 B 端 转换到了 C 端， 擅长`微信/企业微信小程序`的相关开发和一些营促销 `H5` 的开发。

## 新特性

### Vercel

现在网站部署于[Vercel](https://vercel.com)，只需要每年续费域名（¥68），即可拥有一个**独立域名的静态网站**，此外还能免费构建，免费的 PV/UV 统计等等。

不用再续费阿里云 ECS，一年省下 ¥700+ 倒是可以加几箱油 🎉

### Tailwind CSS

最近几年，原子样式的趋势越来越好，这次整站`CSS`都是基于 `Tailwind CSS`。

### Markdown

这次站点的重构，基于 `markdown`，手动把 `Mysql` 中富文本录入的旧文章转换为 `md` 是个很费劲的工作，再加上以前的文章质量没那么高，所以几乎删除了大部分旧数据。

### FrontMatter

| 属性               | 描述                                                         | 备注                                                    |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------- |
| **_title_**        | 文章标题 (h1)                                                | required<sup>\*</sup>                                   |
| **_description_**  | 文章描述，用于文章摘录和网站描述                             | required<sup>\*</sup>                                   |
| **_pubDatetime_**  | 以 ISO 8601 格式发布的日期时间                               | required<sup>\*</sup>                                   |
| **_modDatetime_**  | 采用 ISO 8601 格式的修改日期时间（仅在修改文章时添加此属性） | optional                                                |
| **_author_**       | 文章作者                                                     | optional, default = SITE.author                         |
| **_slug_**         | 文章路径，可选但是不能为空                                   | optional, default = slugified file name                 |
| **_featured_**     | 文章是否在首页精选版本展示                                   | optional, default = false                               |
| **_draft_**        | 文章是否为草稿                                               | optional, default = false                               |
| **_tags_**         | 文章的标签（数组 yaml 格式）                                 | optional, default = others                              |
| **_ogImage_**      | 文章的 OG 图片，用于 SEO                                     | optional, default = SITE.ogImage or generated OG image  |
| **_canonicalURL_** | 规范 URL（绝对路径）                                         | optional, default = `Astro.site` + `Astro.url.pathname` |

```md title="示例"
---
title:
description:
pubDatetime:
modDatetime:
postSlug:
featured: false
draft: false
tags:
  - Vue.js
---
```

### SyntaxHighlight

使用了 [`shiki`](https://github.com/shikijs/shiki) + [`Moonlight II`](https://github.com/atomiks/moonlight-vscode-theme) 来实现代码块的语法高亮。

#### 代码高亮

```tsx
import { useFloating, offset } from "@floating-ui/react";

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
}

export function App({ open, onOpenChange }: Props) {
  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange,
    placement: "left",
    middleware: [offset(10)],
  });

  return (
    <Container>
      <div ref={refs.setReference} />
      {open && <div ref={refs.setFloating} style={floatingStyles} />}
    </Container>
  );
}
```

#### 行号和行高亮

```js {4} showLineNumbers
import { useFloating } from "@floating-ui/react";

function MyComponent() {
  const { refs, floatingStyles } = useFloating();

  return (
    <>
      <div ref={refs.setReference} />
      <div ref={refs.setFloating} style={floatingStyles} />
    </>
  );
}
```

#### 字符高亮

```js /floatingStyles/
import { useFloating } from "@floating-ui/react";

function MyComponent() {
  const { refs, floatingStyles } = useFloating();

  return (
    <>
      <div ref={refs.setReference} />
      <div ref={refs.setFloating} style={floatingStyles} />
    </>
  );
}
```

#### 内联代码高亮

执行 `[1, 2, 3].join('-'){:js}` 会得到 `'1-2-3'{:js}`。

```ts
function getStringLength(str: string): number {
  return str.length;
}
```

当需要引用 `getStringLength{:.entity.name.function}` 函数时，可以为这段代码块着色，和 `function{:.keyword}` 类似, 也可以使用不同的颜色
`str{:.variable.parameter}`，`str{:.variable.other.object}`，等等...

#### 群组高亮

````md
```js /age/#v /name/#v /setAge/#s /setName/#s /50/#i /'Taylor'/#i
const [age, setAge] = useState(50);
const [name, setName] = useState("Taylor");
```
````

```js /age/#v /name/#v /setAge/#s /setName/#s /50/#i /'Taylor'/#i
const [age, setAge] = useState(50);
const [name, setName] = useState("Taylor");
```


#### ANSI 高亮

```ansi
[0;36m  vite v5.0.0[0;32m dev server running at:[0m

  > Local: [0;36mhttp://localhost:[0;36;1m3000[0;36m/[0m
  > Network: [0;2muse `--host` to expose[0m

  [0;36mready in 125ms.[0m

[0;2m8:38:02 PM[0m [0;36;1m[vite][0m [0;32mhmr update [0;2m/src/App.tsx
```

内联的 ANSI: `> Local: [0;36mhttp://localhost:[0;36;1m3000[0;36m/[0m{:ansi}`

**感谢访问我的站点!**
