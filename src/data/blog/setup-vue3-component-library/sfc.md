---
title: 构建 Vue3 组件库 - 组件
description: 我对组件注册原理、目录设计、文件拆分的一些看法。
pubDatetime: 2023-11-23
slug: setup-vue3-component-library/sfc
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

## 组件注册

对于使用者来说，组件库可以批量导入，也可以单个导入，例如：

```ts title="main.ts"
// 批量导入
import { createApp } from "vue";
import App from "./App.vue";
import GeistDesign from "@whouu/geist-design";

createApp(App).use(GeistDesign).mount("#app");

// 单个导入
import { createApp } from "vue";
import App from "./App.vue";
import { GAvatar, GButton } from "@whouu/geist-design";

createApp(App).use(GAvatar).use(GButton).mount("#app");
```

### app.use()

参考 [官方文档](https://cn.vuejs.org/api/application.html#app-use)，`app.use()` 需要传递一个带 `install()` 方法的对象。

**组件的入口文件：**

```ts title="src/avatar/index.ts" {4}
import Avatar from "./avatar.vue";

export const GAvatar = () => {
  Avatar.install = () => {};

  return Avatar;
};

export default GAvatar;
```

**组件库的入口文件：**

```ts title="src/index.ts" {1}
const install = () => {};

export default { install };
```

### app.component()

> 正是因为要通过 `app.component()` 注册组件，组件的名称尤其重要，参考 [此处](/posts/setup-vue3-component-library/install-deps#vue)

在上面两个 `install` 方法中，我们调用 `app.component()` 将组件库中的组件注册到使用者的 Vue 实例中。

**组件的入口文件：**

每一个组件都需要 `installWrapper`，因此单独提取该方法:

```ts title="src/_utils/index.ts"
import type { App, Directive, Component } from "vue";

export type Install<T> = T & {
  install(app: App): void;
};

/**
 * 注册组件
 *
 * @param { Object } main 组件实例
 * @returns { Object } 组件实例
 */
export const withInstallComponent = <T extends Component>(
  main: T
): Install<T> => {
  (main as Record<string, unknown>).install = (app: App): void => {
    const { name } = main;
    name && app.component(name, main);
  };
  return main as Install<T>;
};
```

```ts title="src/avatar/index.ts" {4}
import Avatar from "./avatar.vue";
import { withInstallComponent } from "@/_utils";

export const GAvatar = withInstallComponent(Avatar);

export default GAvatar;
```

**组件库的入口文件：**

```ts title="src/index.ts" {5-11}
import * as components from "./components";

import type { App } from "vue";

const install = (app: App): App => {
  Object.entries(components).forEach(([key, value]) => {
    app.component(key, value);
  });

  return app;
};

export default { install };
```

## 目录结构

为了更好的维护和导出 `props` 的类型文件，将 `props` 单独抽离成一个 `.ts` 文件，`emits` 同理。

```ansi
avatar
 ┣ __test__
 ┃ ┗ avatar.spec.ts
 ┣ src
 ┃ ┣ avatar.vue
 ┃ ┣ interface.ts
 ┃ ┗ props.ts
 ┗ index.ts
```

在[官方文档](https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props)中，定义一个带有默认值的 props，大概是这样：

```html title="avatar.vue"
<script setup lang="ts">
  export interface Props {
    msg?: string;
    labels?: string[];
  }

  const props = withDefaults(defineProps<Props>(), {
    msg: "hello",
    labels: () => ["one", "two"],
  });
</script>
```

如何将 `withDefaults` `defineProps` `Props`，三者抽离到 `props.ts` 中，并像这样使用：

```html title="avatar.vue"
<script setup lang="ts">
  import { Props } from "./props";

  defineProps(Props);
</script>
```

参考[复杂的 prop 类型](https://cn.vuejs.org/guide/typescript/composition-api.html#complex-prop-types)，结合 `PropType` 和 `as const`：

- 通过 `as unknown as PropType<T>` 来定义类型；
- 使用 `as const` 让 `props` 只读；

```ts title="props.ts"
import type { PropType } from 'vue'

export const props = {
  booleanProp: Boolean,
  stringNumberBooleanProp: {
    type: [String, Number, Boolean] as unknown as PropType<string | number | boolean>,
    default: false
  },
  complexArrayProp: {
    type: Array as unknow as PropType<(string | number | boolean)[]>,
    default: () => []
  }
  enumStringProp: {
    type: String as unknown as PropType<'large' | 'medium' | 'normal' | 'small'>,
    default: 'normal'
  }
} as const
```

## ExtractPropTypes

某些场景，可能需要在 ts 中组装组件的 props，而后直接使用 `v-bind` 进行传递：

```astro title="example.vue"
<script setup lang="ts">
  /**
   * 此时 ts 无法进行静态类型检查，
   * 你也不清楚自己写的 props 是否和开发者定义的是否匹配
   */
  const avatarProps = {};
</script>

<template>
  <g-avatar v-if="avatarProps" v-bind="avatarProps"></g-avatar>
</template>
```

在 props.ts 中，使用 `ExtractPropTypes` 导出 SFC props 类型：

```diff title="props.ts"
+ import type { ExtractPropTypes, PropType } from 'vue'

export const props = {
  booleanProp: Boolean,
  stringNumberBooleanProp: {
    type: [String, Number, Boolean] as unknown as PropType<string | number | boolean>,
    default: false
  },
  complexArrayProp: {
    type: Array as unknow as PropType<(string | number | boolean)[]>,
    default: () => []
  }
  enumStringProp: {
    type: String as unknown as PropType<'large' | 'medium' | 'normal' | 'small'>,
    default: 'normal'
  }
} as const

+ export type AvatarProps = ExtractPropTypes<typeof Props>
```

再回到 `example.vue`：

```diff title="example.vue"
<script setup lang="ts">
+  import type { AvatarProps } from '@whouu/geist-design'

+  const avatarProps: AvatarProps = { size: 'medium' }
</script>

<template>
  <g-avatar v-if="avatarProps" v-bind="avatarProps" />
</template>
```
