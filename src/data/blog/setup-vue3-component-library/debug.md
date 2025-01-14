---
title: 构建 Vue3 组件库 - 调试
description: 本地如何实时的调试组件库。
pubDatetime: 2023-11-25
slug: setup-vue3-component-library/debug
column: setup-vue3-component-library
featured: false
draft: false
tags:
  - 指南
  - Vue.js
---

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

## 调试组件

开发组件库最重要的是如何**实时调试组件**，最早我尝试使用 `pnpm workspace` 来搭建 [papa-interview](https://github.com/passionzale/papa-interview) 时，

由于我将组件库 [packages/ui/package.json](https://github.com/PassionZale/papa-interview/tree/main/packages/ui/package.json) 配置完毕，在 [@app/ddl](https://github.com/PassionZale/papa-interview/tree/main/@app/ddl) 中我只能引入构建后的产物。

为了能实时调试组件，我使用了 `vite build --watch`，特别费劲。

在这一次的实践中，我直接引入组件库的入口文件，配合 `vite.config.ts` 来进行调试，

现在项目目录结构大概是这样：

<Tree data={Data} />

```ansi
geist-design
 ┣ src
 ┃ ┣ _styles
 ┃ ┃ ┣ index.scss
 ┃ ┃ ┗ _avatar.scss
 ┃ ┗ index.ts
 ┣ start
 ┃ ┣ public
 ┃ ┣ src
 ┃ ┃ ┣ App.vue
 ┃ ┃ ┗ main.ts
 ┃ ┣ index.html
 ┃ ┣ tsconfig.json
 ┃ ┣ tsconfig.node.json
 ┃ ┗ vite.config.ts
 ┣ package.json
 ┣ vite.config.css.ts
 ┗ vite.config.ts
```

在 [**《构建 Vue3 组件库 - 如何开始》**](/posts/setup-vue3-component-library/how-to-start) 中，调试目录其实是一个通过 Vite 初始化的 `SPA` 项目。

调试组件库，需要启动项目，在 `package.json` 中增加启动命令：

```diff title="package.json"
{
  "scripts": {
+    "start": "vite -c ./start/vite.config.ts"
  }
}
```

分别将 **样式入口文件** 和 **组件入口文件** 引入到 start 中：

```diff title="start/vite.config.ts"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
+  root: './start',
  plugins: [vue()],
  resolve: {
    alias: {
+      'geist-design': resolve(__dirname, '../src/index.ts'),
+      'geist-design-styles': resolve(__dirname, '../src/_styles/index.scss')
    }
  }
})
```

在 `main.ts` 中通过 `app.use` 来安装组件：

```diff title="start/src/main.ts"
import { createApp } from 'vue'
import App from './App.vue'

+ import GeistDesign from 'geist-design'
+ import 'geist-design-styles'

createApp(App)
+  .use(GeistDesign)
  .mount('#app')
```

现在组件已经全部注册，样式也引入完毕，

在根目录执行 `npm run start`，运行项目后，便可以在 `App.vue` 中实时调试：

```astro title="src/App.vue"
<template>
  <g-avatar text="Geist Design" size="small" />
  <g-avatar text="Geist Design" />
  <g-avatar text="Geist Design" size="big" />
  <g-avatar text="Geist Design" size="huge" />
</template>
```
