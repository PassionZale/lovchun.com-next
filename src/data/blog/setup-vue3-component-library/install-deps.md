---
title: 构建 Vue3 组件库 - 安装依赖
description: vue3+ts 需要哪些依赖，如何配置。
pubDatetime: 2023-11-21
slug: setup-vue3-component-library/install-deps
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

## typescript

`ts` 项目首先需要安装 `typescript`，提供 `tsc` 来编译 `.ts` 文件。

```shell
npm i -D typescript
```

## @types/node

开发组件库不可避免的会编码一些脚本文件，会用到 `nodejs` 中的包，如：`node:path`，

安装 `@types/node` 来提供这些包的类型声明文件。

```shell
npm i -D @types/node
```

## vue

> vue ≥ 3.3

每一个 `Vue Component` 都会有 `name` 属性，平时封装业务组件的时候，并不是特别在意这个属性，

**开发组件库 `name` 会变的尤其重要。**

注意这里 `vue` 的版本，需要 ≥3.3，因为 3.3 版本之后提供了更多的宏，例如 `defineOptions`，

这个宏可以很方便的在 `<setup>` 中定义组件的 `name`，更多特性可以参考：[《Vue 3.3 主要新特性详解》](https://gist.github.com/sxzz/3995fc7251567c7c95de35f45539b9c2)。

3.3 之前的版本，需要使用 `unplugin-vue-define-options`，才能在 `<setup>` 中开启 `defineOptions`，

具体可以参考：[defineOptions](https://vue-macros.sxzz.moe/macros/define-options.html)。

```shell
npm i -D vue
```

- vue3 需要 nodejs ≥ 16；
- vue 需要 ≥ 3.3；

因此需要配置 `package.json`：

```json title="package.json"
{
  "peerDependencies": {
    "vue": "^3.3.x"
  },
  "engines": {
    "node": ">= 16"
  }
}
```

## vue-tsc

`vue-tsc` 是对 `typeScript` 自身命令行界面 `tsc` 的一个封装，除了 `.ts` 文件，它还能支持 Vue 的 SFC 文件。

```shell
npm i -D vue-tsc
```

## vite

[《上一篇》](/posts/setup-vue3-component-library/how-to-start) 介绍过会使用 `vite` 来打包及调试组件库。

```shell
npm i -D vite
```

## @vitejs/plugin-vue

在 vite 中提供单文件组件支持。

```shell
npm i -D @vitejs/plugin-vue
```

## vite-plugin-dts

从 .ts(x) 或 .vue 源文件生成类型文件（\*.d.ts）的 Vite 插件。

```shell
npm i -D vite-plugin-dts
```

## vitepress

[《上一篇》](/posts/setup-vue3-component-library/how-to-start) 介绍过会使用 `vitepress` 来构建文档站点。

vitepress 的文档，一定要参考它的 [**英文文档**](https://vitepress.dev/)，[中文文档](https://vitejs.cn/vitepress/) 的版本比较旧了。

```shell
npm i -D vitepress
```

## sass

在 vite 中支持 sass 预处理，

如果使用其他预处理器，可以参考 [CSS 预处理器](https://cn.vitejs.dev/guide/features.html#css-pre-processors)。

```shell
npm i -D sass
```

## prettier

结合 .prettierrc 统一所有目录的缩进、换行等。

```shell
npm i -D prettier
```

## eslint

结合 .eslintrc 统一所有目录语法等。

```shell
npm i -D .eslintrc
```

## @typescript-eslint

接下来需要安装，`@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin`，[这篇文章](https://zhuanlan.zhihu.com/p/295291463) 讲述的非常清楚，可以参考了解一下 eslint 与 typescript 之间的关系。

#### @typescript-eslint/parser

为了让 eslint 也能识别出 typescript 所转换出的 ast，需要将 **eslint.parserOptions.parser** 设置为 @typescript-eslint/parser。

```shell
npm i -D @typescript-eslint/parser
```

#### @typescript-eslint/eslint-plugin

提供 typescript 语法的检查规则。

```shell
npm i -D @typescript-eslint/eslint-plugin
```

## eslint-plugin-vue

eslint 默认的 parser 只会转换 js 文件， 为了支持 Vue SFC 的语法检查，需要安装 eslint-plugin-vue，详细可参考 [官方文档](https://eslint.vuejs.org/user-guide/)

```shell
npm i -D eslint-plugin-vue
```

最基础的用法，如：

```diff title=".eslintrc"
module.exports = {
  extends: [
+    'plugin:vue/vue3-recommended',
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
```

## .eslinrc

```json title=".eslintrc"
{
  "extends": [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    // override rules...
  },
  "parser": "vue-eslint-parser",
  "plugins": ["@typescript-eslint"],
  "root": true,
  "parserOptions": {
    "parser": "@typescript-eslint/parser"
  },
  "overrides": [
    {
      "files": "*"
    }
  ]
}
```
