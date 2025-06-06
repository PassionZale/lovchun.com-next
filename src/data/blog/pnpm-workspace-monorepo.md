---
title: monorepo
description: 使用 pnpm workspace 构建 monorepo。
pubDatetime: 2023-05-01
slug: pnpm-workspace-monorepo
featured: false
draft: false
tags:
  - 指南
  - 面试
---

## 前言

> 源码：[https://github.com/PassionZale/papa-interview.git](https://github.com/PassionZale/papa-interview.git)
>
> 预览：[https://papa-interview.vercel.app](https://papa-interview.vercel.app)

收到了趴趴英语的一份面试 `ddl`，题目大概如下：

- 写三个页面
  - 页面 A：
    - button: next
    - 一个输入框 textarea 字段 1
  - 页面 B：
    - button: next, brefore
    - 展示页面 A 输入的内容
    - 一个输入框 textarea 字段 2
  - 页面 C：
    - button: before, submit
    - 需要判断是否登录，有登录信息展示页面 否则整体遮罩
    - 展示并模拟提交前两个页面填写的信息 页面展示提交结果
- next: 跳转下一个页面
- before: 跳转前一个页面
- submit: 提交接口
- 要求
  - 使用 Vue 等相关技术
- **测试主要考察项目经验和代码规范**

**一个输入框:** 可能在考察只有一个输入框时，form 表单自动提交的约束？

> W3C 标准中[规定](https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2)
>
> When there is only one single-line text input field in a form, the user agent should accept Enter in that field as a request to submit the form.

**三个页面，前进后退:** 路由的跳转；

**后面的页面能展示前面的输入内容:** 数据的全局共享；

## 技术选型

首先，使用 `vite+vue3` 来初始化仓库，然后添加 `vue-router` 和 `pinia`，接着就可以开始实现这个 `ddl` 了。

等等... **测试主要考察项目经验和代码规范** ，如果这么实现了，好像没有体现任何的项目经验和代码规范，对吗？

看了下岗位的 JD，有提到 `tailwindcss`，正好 `ddl` 里面缺少一套 UI 组件，也不好直接讲一份完整的组件库塞到这个小项目中，那就选 `tailwindcss` 手搓几个组件吧。

再查了一下趴趴英语的官网 [papaen.com](https://papaen.com)，按理来说前端稍聚规模的公司，组件库、私服等常见的生态肯定会有的，

参考官网的域名，我自行脑补了一下 npm 私服的 `scoped`，也许是这个：`@papane`。

**既然都到了 `scoped` 的份上，那再往前延伸一下，直接快进到 `pnpm workspace`，来构建一个 `monorepo` 会不会更有意思呢？**

- 根目录控制代码规范：`eslint` & `prettier`；
- `@papaen/tailwind-config`：`tailwindcss` 配置项，提供给所有的包使用；
- `@papane/ui`：UI 组件包，提供给各个应用使用；
- `@papaen/ddl`：ddl 应用；

## 目录结构

```ansi
papa-interview
 ┣ @app
 ┃ ┗ ddl
 ┃ ┃ ┣ public
 ┃ ┃ ┣ src
 ┃ ┃ ┣ index.html
 ┃ ┃ ┣ package.json
 ┃ ┃ ┣ postcss.config.cjs
 ┃ ┃ ┣ tailwind.config.cjs
 ┃ ┃ ┗ vite.config.js
 ┣ packages
 ┃ ┣ tailwind-config
 ┃ ┃ ┣ package.json
 ┃ ┃ ┣ postcss.config.cjs
 ┃ ┃ ┗ tailwind.config.cjs
 ┃ ┗ ui
 ┃ ┃ ┣ public
 ┃ ┃ ┣ src
 ┃ ┃ ┃ ┣ Button
 ┃ ┃ ┃ ┣ main.js
 ┃ ┃ ┃ ┗ style.css
 ┃ ┃ ┣ index.html
 ┃ ┃ ┣ package.json
 ┃ ┃ ┣ postcss.config.cjs
 ┃ ┃ ┣ tailwind.config.cjs
 ┃ ┃ ┗ vite.config.js
 ┣ .eslintrc
 ┣ pnpm-workspace.yaml
 ┗ prettier.config.js
```

```yaml title="pnpm-workspace.yaml"
packages:
  - "./@app/**"
  - "./packages/**"
```

### `eslint` & `prettier`

根目录中，有两个库对于我们的代码规范十分有用：`eslint-plugin-vue` `prettier-plugin-tailwindcss`，主要是通过继承 `plugin:vue/vue3-recommended` 来完成代码相关的格式化及书写约束，

在具体的实践和踩坑中，还需要额外安装 `@babel/eslint-parser`，并调整部分 `rules`：

```json title=".eslinrc"
{
  "parser": "@babel/eslint-parser",
  "rules": {
    "import/no-named-as-default": 0,
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-unresolved": [2, { "ignore": ["^@/"] }]
  }
}
```

### tailwind-config

此 `packages` 简简单单，只需要包含 tailwind 的相关配置即可：

```shell
cd papaen-interview/packages/tailwind-config

pnpm add autoprefixer postcss tailwindcss
```

参考 `tailwind` 官网建立对应的 `postcss.config.cjs` 和 `tailwind.config.cjs` 即可，

注意此处的`.cjs`, 其他的 `package` 或 `app` 需要**运行时加载** `tailwind` 配置项。

### ui

```shell
cd papaen-interview/packages/ui

pnpm create vite .

pnpm add -D @papaen/tailwind-config
```

使用 `vite` 创建好项目后，需要将 `@papaen/tailwind-config` 安装至 `devDependencies` 中，

这样就可以沿用 `tailwind` 配置项：

```js title="postcss.config.cjs"
module.exports = require("@papaen/tailwind-config/postcss.config.cjs");
```

```js title="tailwind.config.cjs"
module.exports = require("@papaen/tailwind-config/tailwind.config.cjs");
```

启用 `tailwindcss`：

```css title="style.css"
@tailwind base;
@tailwind components;
@tailwind utilities;
```

由于，`@papaen/ui` 是一个 UI 组件库，因此，在打包方式上，需要将 `vite.config.js` 的构建调整为**库模式**:

```js title="vite.config.js"
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// eslint-disable-next-line import/namespace
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "PapaUI",
      fileName: "papa-ui",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },

  plugins: [vue()],
});
```

写好组件后，还需要导出各个组件的模块：

```js title="main.js"
import "./style.css";

// 导出组件
export { default as PapaButton } from "./Button/index.vue";
```

参考官方说明 [构建库模式](https://cn.vitejs.dev/guide/build.html#library-mode)，继续调整 `package.json`，

为了在开发过程中组件的每次修改，都能再次被构建，所以此处使用 `dev: vite build --watch`：

```json title="package.json" /vite build --watch/
{
  "name": "@papaen/ui",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/papa-ui.umd.cjs",
  "module": "./dist/papa-ui.js",
  "exports": {
    ".": {
      "import": "./dist/papa-ui.js",
      "require": "./dist/papa-ui.umd.cjs"
    }
  },
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.2.47"
  },
  "devDependencies": {
    "@papaen/tailwind-config": "workspace:^",
    "@vitejs/plugin-vue": "^4.1.0",
    "vite": "^4.3.2"
  }
}
```

### app

应用如果特别多，可以使用目录为 `@app` 的形式来组织目录结构，例如：`@app/ddl`：

```shell
cd papa-interview/@app/ddl
pnpm create vite .
pnpm add @papaen/ui
pnpm add -D @papaen/tailwind-config
```

## 开发及构建

```json title="package.json"
{
  "app:ddl": "pnpm --filter=@papaen/ddl",
  "ui": "pnpm --filter=@papaen/ui",
  "dev": "pnpm --recursive --parallel --stream run dev",
  "build": "pnpm run ui build && pnpm run app:ddl build"
}
```
