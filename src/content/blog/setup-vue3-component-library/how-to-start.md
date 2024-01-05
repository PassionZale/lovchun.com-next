---
title: 构建 Vue3 组件库 - 如何开始
description: 我对 monolith、multirepo、monorepo 选择的一些看法。
pubDatetime: 2022-11-20T04:06:31Z
postSlug: setup-vue3-component-library/how-to-start
featured: false
draft: false
tags:
  - 指南
  - Vue.js
---

> 构建 Vue3 组件库系列，只是单纯记录与分享我开发组件库过程中有意思的思路、设计等，
>
> 它没有办法**手把手教你搭建**，因为这需要你自己来实践，
>
> 同样，我的实践，不一定是最适合你的，你需要通过实践来拥有适合自己的**最佳实践**，
>
> 如果对你有任何帮助，我会很开心。 :tada:
>
> 通过下方的[**目录**](#目录)可以快速浏览整个专题，
>
> 通过下方的[**源码**](#源码)可以查看原始代码和文档实例。

## Table of contents

## 目录

- [**《构建 Vue3 组件库 - 如何开始》**](/posts/setup-vue3-component-library/how-to-start)
- [**《构建 Vue3 组件库 - 安装依赖》**](/posts/setup-vue3-component-library/install-deps)
- [**《构建 Vue3 组件库 - 图标》**](/posts/setup-vue3-component-library/svg-icon)
- [**《构建 Vue3 组件库 - 组件》**](/posts/setup-vue3-component-library/sfc)
- [**《构建 Vue3 组件库 - 样式》**](/posts/setup-vue3-component-library/css)
- [**《构建 Vue3 组件库 - 调试》**](/posts/setup-vue3-component-library/debug)
- [**《构建 Vue3 组件库 - 文档》**](/posts/setup-vue3-component-library/doc)
- [**《构建 Vue3 组件库 - 渲染器》**](/posts/setup-vue3-component-library/plopjs)
- [**《构建 Vue3 组件库 - 打包》**](/posts/setup-vue3-component-library/build)

## 源码

- [代码仓库](https://github.com/passionzale/geist-design)
- [在线预览](https://geist-design.lovchun.com)

  10.13 - 11.10，花费了尽一个月的时间，完成了 [`Geist Design`](https://geist-design.lovchun.com/) 整套组件库的搭建。

~~直到现在单元测试还没开始写。~~

在编码开始之前，我还花费了数个月的时间调研和尝试了几套构建库的模式，期间遇到了许多问题，诸如：

- 采用哪种模式搭建项目；
- `lint` 要怎么做；
- `ts+vue` 要怎么配置；
- 如何搭建和部署文档；
- 如何设计组件的目录结构；
- 开发时如何调试组件；
- 如何处理组件所需要的 icons；
- 如何处理组件的样式；
- 如何构建和发布组件库；
- ...

> **monolith** **multirepo** **monorepo** 到底该选哪一个？

网上铺天盖地的文章，不约而同的推荐你使用 `monorepo` + `pnpm workspace` 来构建一个组件库：

```ansi
monorepo
 ┣ docs
 ┣ packages
 ┣ start
 ┣ scripts
 ┣ .eslintrc
 ┣ .prettierrc
 ┣ package.json
 ┗ pnpm-workspace.yaml
```

对于 `pnpm` **零经验** 的小伙伴来讲，你可能需要从 [文档](https://pnpm.io/zh/installation) 开始学习一下 `pnpm`，

然后你又会遇到一系列的问题：

- `package.json` 的 `private` 设置为 `true / false`；
- `pnpm --filter`；
- `pnpm --recursive --parallel --stream run **`；
- `pnpm@7` `pnpm@8` 版本怎么控制；
- `shamefully-hoist` `auto-install-peers` `strict-peer-dependencies` 怎么设置；
- 为什么有的库需要装到根目录，有的需要安装到指定的 `workspace`；
- ...

<details open>
  <summary>**灵魂拷问**</summary>

- **你真的需要 monorepo 吗？**

- **你真的会持续的维护组件库吗？**

- **你真的会持续的构建组件库相关生态吗？**

- **你真的会持续的解决 issue 吗？**

- **真的会有人使用你的组件库吗？**

</details>

在调研期间，我购买了一本小册 [《基于 Vite 的组件库工程化实战》](https://s.juejin.cn/ds/iRCGnt8v/)，评论下面，学员各种环境问题颇多，这个跑不起来，那个不生效的比比皆是。

能跟着把小册啃完，而后折腾出成果的不多，在 [🚀 学员优秀实践汇总](https://github.com/smarty-team/smarty-admin/issues/17) 中，大部分学员们的成果，基本就是写了 `<Button />`，而后发布一次 `npm`，就结束了。

其中最健壮的 [`Fighting Design`](https://github.com/FightingDesign/fighting-design)，我从这个仓库借鉴了许多，如 `eslint` `utils` `props` 等，这是一个非常棒的仓库，如果你仍然想用 monorepo 试试，可以参考它，当然 [`Element Plus`](https://github.com/element-plus/element-plus) 也是个不错的选择。

![i-want-easy-to-play](/images/setup-vue3-component-library/i-want-easy-to-play.png)

正如 [**JsLin**](https://github.com/JslinSir) 所说，既然大部分人只是想尝试开发库的过程，那我们便直接按照 **monolith** 的形式来搭建项目。

完整的制作一个组件库，**至少需要三个**目录或者项目来支撑整个开发：

**`./docs/`：**

用来编写所有的文档和示例，并且需要单独部署。

**`./start/`：**

用来本地调试组件，不需要部署，只需要能实时的监听组件源码变化，而后渲染组件到页面，能看到效果即可。

~~也可以命名为 `./play/`~~

**`./src/`：**

组件的源码目录，里面囊括了所有跟组件相关的东西：`styles/SFC/hooks/utils/etc...`。

```ansi
monolith
 ┣ docs
 ┣ src
 ┃ ┣ avatar
 ┃ ┃ ┣ src
 ┃ ┃ ┃ ┣ avatar.vue
 ┃ ┃ ┃ ┣ interface.ts
 ┃ ┃ ┃ ┗ props.ts
 ┃ ┃ ┗ index.ts
 ┃ ┣ _hooks
 ┃ ┣ _styles
 ┃ ┣ _utils
 ┃ ┗ index.ts
 ┣ start
 ┣ package.json
 ┣ vite.config.css.ts
 ┗ vite.config.ts
```

**`vite + vitepress` 只需要这两个库，便可以支撑这三个目录的运作：**

- `./docs/` 是 `vitepress` 默认的项目根目录；
- `./start` 是一个 `vite` 项目，引入 `./src/index.tsx` 即可实时的调试组件；
- `./src/` 使用 `vite` 库模式打包，通过 `vite -c` 指定不同的配置文件来分别构建 `js` 和 `css`；

接下来，在后面的文章中，将从安装依赖开始，逐步完善整个组件库的构建。
