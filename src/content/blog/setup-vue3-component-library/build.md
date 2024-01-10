---
title: 构建 Vue3 组件库 - 打包
description: 如何打包并发布组件库。
pubDatetime: 2023-11-28T04:06:31Z
postSlug: setup-vue3-component-library/build
featured: false
draft: false
tags:
  - 指南
  - Vue.js
---

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

## package.json

```json title="pacakge.json"
{
  "scripts": {
    "start": "vite -c ./start/vite.config.ts",
    "dev": "npm run docs:dev",
    "build": "vue-tsc --noEmit && vite build && vite build -c vite.config.css.ts",
    "release": "npm publish --registry https://registry.npmjs.org --access public",
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs",
    "plop": "plop"
  }
}
```

## 组件库打包

使用 vite 顺序打包 `vite.config.ts` 和 `vite.config.css.ts`：

```shell
npm run build
```

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      exclude: ["**/__test__/*.{test,spec}.{ts,tsx}"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "GeistDesign",
      fileName: format => `geist-design.${format}.js`,
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
});
```

```ts title="vite.config.css.ts"
import { defineConfig } from "vite";
import postcssPresetEnv from "postcss-preset-env";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";

export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssPresetEnv(), autoprefixer()],
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/_styles/index.scss"),
      output: {
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
```

在 `package.json` 中，我们需要针对 `./dist/` 中的产物来声明库的一些入口、导出等 `key/value`：

```json title="package.json"
{
  "type": "module",
  "files": ["dist"],
  "main": "./dist/geist-design.umd.js",
  "module": "./dist/geist-design.es.js",
  "exports": {
    ".": {
      "types": "./dist/src/index.d.ts",
      "import": "./dist/geist-design.es.js",
      "require": "./dist/geist-design.umd.js"
    }
  }
}
```

#### sideEffects

组件库会产出样式文件，为了更好的支持 Webpack Tree shaking，

可以通过声明 `sideEffects` 来标记组件库的副作用：

```diff title="pacakge.json"
{
+  "sideEffects": ["dist/index.css"]
}
```

#### style

声明 `style` 属性，来标记组件库的样式存放地，例如：

```ts title="main.ts"
import "@whouu/geist-design/dist/index.css";
```

当我们导入 `packageName/{cssFilePath}` 时，会重定向到 `package.json` 的 style 属性：

```diff title="package.json"
{
+ "style": "dist/index.css"
}
```

## 文档打包

```shell
npm run docs:build
```

如果使用 `vercel`，可以参考这个配置进行部署：

![vercel](/images/setup-vue3-component-library/vercel.jpg)
