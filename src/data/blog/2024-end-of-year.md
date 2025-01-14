---
title: 2024 End Of Year
pubDatetime: 2024-12-22
modDatetime: 2024-12-23
slug: 2024-end-of-year
featured: false
draft: false
tags:
  - 生活
description: 3 个仓库，6 篇博客，893 次提交。
---

> 2024，**3 个**仓库，**6 篇**博客，**893 次**提交。
>
> 红红火火恍恍惚惚，2024，又是一年结束了。

## 健康

元旦发烧，春节住院，清明发烧，五一发烧...

![icu](/images/2024-end-of-year/icu.jpg)

上半年就是在反复发烧中度过，临近节假日我就会开始生病，

这就是传说中的牛马体质，不上班不舒服斯基吗？

下半年开始安稳，只有 12 月份感冒了一次，

希望 2025 元旦到春节顺顺利利，身体健康！

## 工作

去年 7 月份入职现在这家公司之后，还算比较稳定，

公司的项目也逐渐统一成 `React` 了，这让我比较开心。

`Vue` 写多了不习惯 `React`，`React` 写多了又不习惯 `Vue`，

可能这就是“鱼和熊掌不可兼得”吧。

需求和交互都在我胜任的范围之内，此外还能留有余地的鼓捣一下其他部门的东西，

这一年多的时间在完成本职的需求迭代开发之外，我还搭建了一套前端生态圈：

- `@wukong/docs` - 文档中心
- `@wukong/ui` - 组件库
- `@wukong/cli` - 脚手架
- `@wukong/templates` - 模板库
- `@wukong/talks` - 用于技术分享的幻灯片
- `@wukong/elements` - 基于 `open-wc` 开发一套 `WebComponents`
- `@ph-one/react` - 基于 `antd-design` 二次封装的组件库

对比之前搭建过的，不论从技术栈还是实现思路，对我来说都发生了很多变化，

emm...简单说就是更合理，更好掌控，更利于本地开发。

这一切得益于以下五个库，它们让我在整个 2024 年的开发体验 **焕然一新**：

- `Vite`
- `Slidev`
- `Astro`
- `tsup`
- `lit`

## 技术

上面这五个库中，有你从来没听说过的吗？

没关系，接下来我会介绍它们的开发体验“测评”！

### Vite

**快** 就是我对它的评价！

- 毫秒级的编译
- 毫秒级的热更新
- 神奇的 `import.meta`
- 简单的 `lib` 模式

特别感谢作者 [Evan You](https://github.com/yyx990803) 建设了这么棒的工具！

### Slidev

**Coooooool** 就是我对它的评价！

程序员想做一次演讲，需要面对的拦路虎是什么？

**PPT！**

**讨厌的 PPT!!**

**写不出来的 PPT!!!**

程序员的 PPT，最难呈现的是什么？

**图标！**

**代码的高亮！**

**代码的执行！**

**代码的变化！**

**酷炫的动画！**

`Slidev` 将 `Vue` 与 `Markdown` 结合，每张幻灯片都是一份 `*.md`，

内置了 [iconify](https://icon-sets.iconify.design/) 可以轻松使用各类语言、工具的官方图标，

除了内置 `v-click/hide` 简单的动画，还有神奇的 `magic-move`，

如果编写代码执行器，你甚至可以执行代码块，例如 `typescript` 或者 `Python`！

它还可以将源码构建成 `SPA` `.pdf` `.png` `.pptx` 四种产物，

你想将幻灯片部署还是保存全部都能满足！

还没有结束，基于 `WebRTC`，它还有一个主播模式，

不仅可以控制分享出去幻灯片，还能进行屏幕和音频的录制。

~~请忽略我凌乱的桌面，听说大佬的桌面都是脏乱差。~~

![img](/images/2024-end-of-year/slides.jpg)

特别感谢作者 [Anthony Fu](https://github.com/antfu) 的奇思妙想，非常酷的应用！

### Astro

**FullStack Document App** 就是我对它的评价！

在当前这个时间点，你如果想找到一个**多平台集成**、**文件路由系统**、**内容管理**、**全栈**等，

并还有大量生态的工具，那么唯有 [Astro](https://astro.build/)！

对，[Nextjs](https://nextjs.org/) 也打不过它（~~在我这里~~）。

去年，我用它重构我的博客，今年我又用它搭建了许多文档应用，

除了编写 `.astro` 组件需要找回原生的 `Javascript` 知识之外，我觉得它没有任何缺点。

它的 `content collection` 设计的非常出色，

我第一次知道原来可以定义 `collection` 的 `schema` 可以结合 `zod` 进行校验，

我第一次体验到原来 `md` 可以编译的这么稳定、这么快！

### tsup

**Make it easy to use typescript** 就是我对它的评价！

想用 `Typescript` 写一个库，那就来试试 `tsup` 吧！

今年我使用 `tsup` 编写了两个工具库，一个是脚手架、另外一个是函数库，

无需繁琐的配置，就可以享受到文件的监听、快速的构建、多格式的输出等一条龙服务。

通过 `banner` 还可以自动为构建产物增加 `bin` 注释，例如：

```ts title="tsup.config.ts" {5}
import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    banner: { js: "#!/usr/bin/env node" },
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    format: ["esm"],
    minify: !options.watch,
    outDir: "dist",
    skipNodeModulesBundle: true,
    sourcemap: true,
    splitting: false,
    target: "esnext",
    treeshake: true,
    tsconfig: "tsconfig.json",
  };
});
```

### lit

`Web Component Starter` 就是我对它的评价！

起因是公司 UI 组的小伙伴们想统一全公司所有管理后台的 `Layout`，

但是各个系统技术栈尽不相同...

有什么方法可以写一套组件，能兼容所有平台的技术栈，又能方便的热拔插替换呢？

我最终想到了 `Web Component`，只要你是基于浏览器的应用，那么就可以兼容！

原生的 `Web Component` 开发体验一言难尽，[LIT](https://github.com/lit/lit) 结合 [Open WC](https://open-wc.org/) 能让开发体验直接拉满，

这也是上面 `@wukong/elements` 的目的和初衷。（~~目前还是 WIP，不知道明年能否开发完~~）

## 生活

生活很简单，老婆孩子热炕头。

老婆很喜欢养鱼，这是第一波入缸的小鱼。

后面的故事嘛... 

~~肯定是武汉不适合养鱼，不然鱼也不会来了一茬又走了一茬~~

![fish](/images/2024-end-of-year/fish.jpg)

老婆很喜欢相机，虽然我知道买了肯定吃灰，还是偷摸买了台 Lumix S5M2X 给她。

![photo](/images/2024-end-of-year/photo.jpg)

佑佑今年 2 岁了，今年他稳定的长大，稳定的调皮，稳定的尿床，

这是他第一次喉咙不舒服，主动要求去医院，验血没有哭，做检查没有闹，

完事后潇洒的自己走出门诊楼。

![youyou](/images/2024-end-of-year/youyou.jpg)

## 其他

现在有了孩子，手机上的照片就多了起来，这一张我觉得 2024 最棒的照片，**奶奶和佑佑**的合照。

![warmth](/images/2024-end-of-year/warmth.jpg)

## 开源项目

### TS Type Challenge

今年深入的使用了 `Typescript`，磕磕绊绊的刷了大部分[类型体操](https://github.com/type-challenges/type-challenges)的题目，

你可以在这里查阅我的挑战记录 [https://tsch.lovchun.com/](https://tsch.lovchun.com/)。

### TS FullStack App

我在很早的时候，使用 [Nextjs](https://nextjs.org/) 和 [Nestjs](https://nestjs.com/) 分别搭建了

- 客户端 [mp-operation-website](https://github.com/PassionZale/mp-operation-website)
- 服务端 [mp-operation-api](https://github.com/PassionZale/mp-operation-api)

用来改造公司小程序的项目，在 `build` 之后通过 `ssh` 上传到服务端，而后客户端展示发布记录，

开发、测试、产品可以方便的浏览各个环境的发布记录和更新说明。

今年，我重新开发了 [Release Viewer - micro platform to preview all release logs.](https://github.com/PassionZale/release-viewer)

它是一个基于 [Nextjs](https://nextjs.org/) 的全栈项目，服务端和客户端的技术栈大概如下：

#### Server

| repo                                             | remark                                  |
| ------------------------------------------------ | --------------------------------------- |
| [prisma](https://github.com/prisma/prisma)       | ORM                                    |
| [jose](https://github.com/panva/jose)            | JWT Sign, Verify, Parse                 |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password Hashed, Verify                 |
| [zod](https://github.com/colinhacks/zod)         | schema validation for API Request Input |

#### Client

| repo                                                          | remark                               |
| ------------------------------------------------------------- | ------------------------------------ |
| [shadcn-ui](https://github.com/shadcn-ui/ui)                  | UI Design                            |
| [next-themes](https://github.com/pacocoursey/next-themes)     | Theme                                |
| [zustand](https://github.com/pmndrs/zustand)                  | Gloabl State Manage                  |
| [qs](https://github.com/ljharb/qs)                            | format Get query params              |
| [@tabler/icons-react](https://github.com/tabler/tabler-icons) | Icons                                |
| [dayjs](https://github.com/iamkun/dayjs)                      | Datetime humanize                    |
| [zod](https://github.com/colinhacks/zod)                      | schema validation form Form onSubmit |

## 2025 计划

### Astro upgrade

如果明年 Astro 发布新版本，我就将博客 [lovchun.com-next](https://github.com/PassionZale/lovchun.com-next) 升级一下。

### 《佑佑》

专栏一直没有时间写，正常的进度应该有 2022、2023、2024 三篇了，

现在 2022 刚完成，2023 WIP，2024 进度零...

我想改变一下书写的方式，毕竟年底回忆一年的时间轴实在太难了，

我决定以后每年年底挑出 10 张和佑佑有关的照片，然后针对这些照片完成专栏。

### 《Setup Document App》

我已经用很多方式搭建过文档应用了，到现在为止，至少搭建过 5 个应用。

如何编写文档应用，这是我计划春节期间完成的专栏，希望我能将这些经验沉淀出来。

### 视屏

我最后还想制作视频，可能会发布到网上，也可能会一直封存在硬盘。

我有一个 [演讲](https://github.com/PassionZale/talks) 的仓库，是基于 `slidev` 的 `monorepo`，

十一期间尝试过“一镜到底”对着幻灯片录制演讲的视频，我对着镜头，属于半天吐不出个字的水平，

期望我能迈出第一步！