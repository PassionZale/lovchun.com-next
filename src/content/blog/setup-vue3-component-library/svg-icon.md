---
title: 构建 Vue3 组件库 - 图标
description: 在我看来，组件库的编码不是从 <Button /> 开始，而是从 <Icon /> 开始。
pubDatetime: 2023-11-22T04:06:31Z
postSlug: setup-vue3-component-library/svg-icon
column: setup-vue3-component-library
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
- [geist-design-icons](https://github.com/passionzale/geist-design-icons)
- [geist-design-icons-docs](https://geist-design.lovchun.com/components/icons.html)

> 本文只讨论 svg icon 图标组件库的实现，
>
> 如果你更喜欢通过 [iconfont](https://www.iconfont.cn/) 等生成字体文件后使用样式来处理图标，
>
> 完全可以忽略本文。

组件库为什么要从图标开始？

在我看来，图标贯穿了整个组件库，对于组件库来讲，不仅需要提供一套图标，还要支持使用者自定义图标。

只有把图标落地，才能正式的开发组件库。

## Svg-icon Component

#### 同步组件

一个最基本的 Svg-icon，大概是这样，将 svg 文本直塞到 `<template>` 中即可：

```astro title="IconCopy.vue"
<script setup lang="ts">
  defineOptions({ name: "icon-copy" });
</script>

<template>
  <svg v-bind="$attrs" viewBox="0 0 22 12" fill="none">
    <path
      d="M1 1L11 11L21 1"
      stroke="#000"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"></path>
  </svg>
</template>
```

#### 异步组件

如果想使用 svg 文件又改怎么做呢？

~~这个需求必须上一点魔法才能实现~~

想要在 vite 中能 `import("icon.svg")`，就需要安装并开启 `vite-svg-loader`：

```shell
npm i -D vite-svg-loader
```

```ts title="vite.config.ts" {6}
import svgLoader from "vite-svg-loader";
import type { UserConfig } from "vite";

export default (): UserConfig => {
  return {
    plugins: [svgLoader()],
  };
};
```

使用 [defineAsyncComponent](https://cn.vuejs.org/guide/components/async.html) 实现一个异步的 Svg-icon：

```astro title="Icon.vue"
<script setup lang="ts">
  import { defineAsyncComponent } from "vue";

  defineOptions({ name: "icon" });

  // svg 由 vite-svg-loader 加载
  const Icon = defineAsyncComponent(() => import("../../assets/icon.svg"));
</script>

<template>
  <Icon />
</template>
```

## 解耦 Svg-icon

现在市面上的第三方组件库，会将图标抽离出来，单独封装成一个 package。

为什么不将 Svg-icon 和组件库放在一起维护和发布，而要单独抽离出来呢？

- 有条件的公司会制作一套定制化的 Svg-icon，不会用到组件库所提供的 Svg-icon；
- 图标与组件库解耦，可以更好的维护和更新图标资源，图标库单独发版不会影响组件库；
- 解耦后，组件库构建后的体积会大幅减少；

解耦之后，整个组件库就变成两个 package：

- components；
- icons；

使用 `scope` 的方式来命名，例如：

- `@whouu/geist-design`
- `@whouu/geist-design-icons`

同理也可以继续扩充相关的包，例如专属的 eslint 配置：`@whouu/geist-design-eslint` 等等。

## 搭建 Icon-package

使用 vite 初始化仓库：

```shell
# 选择 vue+ts 模板
npm create vite@latest
```

稍微改造一下目录结构：

- `App.vue` 用来调试图标组件；
- `index.ts` 用来导出组件；
- `vite.config.ts` 使用库模式打包组件；

```ansi
svg-icon
 ┣ src
 ┃ ┣ components
 ┃ ┃ ┗ IconCopy.vue
 ┃ ┣ App.vue
 ┃ ┣ index.ts
 ┃ ┗ main.ts
 ┣ package.json
 ┗ vite.config.ts
```

使用库模式打包，需要调整一下 `vite.config.ts`：

```ts title="vite.config.ts" {9,12-16}
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue(), dts({ include: ["./src/components", "./src/index.ts"] })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@whouu/geist-design-icons",
      fileName: format => `geist-design-icons.${format}.js`,
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

以这份 `vite.config.ts` 文件进行构建，构建产物是这样的：

```ansi
dist
 ┣ components
 ┃ ┗ IconCopy.vue.d.ts
 ┣ geist-design-icons.es.js
 ┣ geist-design-icons.umd.js
 ┗ index.d.ts
```

在 `package.json` 中，我们需要针对 `./dist/` 中的产物来声明库的一些入口、导出等 `key/value`：

```json title="package.json" {2,10}
{
  "type": "module",
  "files": ["dist"],
  "main": "./dist/geist-design-icons.umd.js",
  "module": "./dist/geist-design-icons.es.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/geist-design-icons.umd.js",
      "import": "./dist/geist-design-icons.es.js"
    }
  }
}
```

- `*.umd.js` 可以通过 `<script>` 标签引入，也可以通过 `require(CommoJS)` 引入；
- `*.es.js` 则是通过 `ESModule` 引入；
- 如果设置 `type:module`，类型声明文件需要写在 `exports` 中；

## feather-icons

对于 svg 的资源，有条件可以由公司设计制作，或者在 iconfonts 统一导出，

也可以像我这样，使用 [feathericons](https://feathericons.com/)，它包含了**200+**的资源文件。

多写几个图标组件后，你就会发现，除了 svg 内容不一样外，其他的所有东西都是一致的，都是复制粘贴。

所以我们需要一个通过样板代码自动生成组件的脚本：[`update-icons.js`](https://github.com/PassionZale/geist-design-icons/blob/main/scripts/update-icons.js)：

- 从 [feathericons](https://feathericons.com/) 拿到所有的 `icons`；
- 通过模板字符串声明 SFC 的样板代码；
- 遍历 `icons` 并扩展组件名；
- 遍历 `icons` 并结合第二步的样板代码生成文件并写入 `components/`；
- 写入完毕后更新 `index.ts` 导出组件；

```js title="update-icons.js"
import path from "node:path";
import feather from "feather-icons";
import fs from "fs-extra";
import pascalcase from "pascalcase";

const { icons } = feather;

const templateToComponent = icon => `<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-bind="attrs"
    :style="styles"
    >
    ${icon.contents}
  </svg>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

defineOptions({ name: "${icon.pascalCasedComponentName}", inheritAttrs: false });

const $attrs = useAttrs();

const props = defineProps({
  /** icon 大小  */
  size: {
    type: [String, Number],
  },
  /** icon 颜色  */
  color: {
    type: String,
    default: "currentColor",
  },
});

const styles = computed(() => {
  const size = props.size ? { width: props.size, height: props.size } : {};

  const color = { color: props.color };

  return { ...size, ...color };
});

const attrs = {
  viewBox: "0 0 24 24",
  "shape-rendering": "geometricPrecision",
  width: 24,
  height: 24,
  fill: 'none',
  stroke:"currentColor",
  strokeWidth: '1.5',
  ...$attrs,
};
</script>`;

Object.values(feather.icons).forEach(icon => {
  icon.pascalCasedComponentName = pascalcase(`g_icon_${icon.name}`);
});

Object.values(icons).forEach(icon => {
  const component = templateToComponent(icon);

  const filepath = `./src/components/${icon.pascalCasedComponentName}.vue`;

  fs.ensureDir(path.dirname(filepath)).then(() =>
    fs.writeFile(filepath, component, "utf8")
  );
});

const defaults = Object.values(feather.icons)
  .map(
    icon =>
      `export { default as ${icon.pascalCasedComponentName} } from './components/${icon.pascalCasedComponentName}.vue'`
  )
  .join("\n\n");

fs.outputFile("./src/index.ts", defaults, "utf8");
```

执行 `npm run ./scripts/update-icons.js`，我们便立即拥有了 [feathericons](https://feathericons.com/) 的全部 Svg-icon。
