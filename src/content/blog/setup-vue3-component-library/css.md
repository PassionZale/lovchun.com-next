---
title: 构建 Vue3 组件库 - 样式
description: 组件库中 css variables 等一些经验之谈。
pubDatetime: 2023-11-24T04:06:31Z
postSlug: setup-vue3-component-library/css
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

## Css variables

组件库，最重要的就是[**颜色**](https://geist-design.lovchun.com/guide/colors.html)，一套成体系的颜色可以让人眼前一亮，

通过 `Css variables`，可以很方便的实现换肤，也可以使 `css` 更好的组织化，甚至能让使用者更方便的调整 UI。

对于不懂 UI、不懂设计的开发人员来讲，怎么快速整出一套 `Css variables`？

参考第三方组件库的 `调色盘` 是最快的方式之一，例如：[antd-design colors](https://ant-design.antgroup.com/docs/spec/colors-cn)，

或者我参考的 [vercel-design colors](https://vercel.com/design/color)。

## Light/Dark mode

在暗黑模式全面支持的今天，`Css Variables` 也需要提供两套。

实现 `Light/Dark mode` 非常简单，通常的做法是为 `html` 元素动态添加 `class`：

```ts title="theme.ts"
const THEMES = ["dark", "light"] as const;

const setTheme = (theme: (typeof THEMES)[number]): void => {
  if (typeof document === "undefined") return;

  const html = document.querySelector("html");

  html?.classList.remove(...THEMES);
  html?.classList.add(theme);
};

/** 切换为默认色系 */
export const enableLight = (): void => {
  setTheme("light");
};

/** 切换为暗黑色系 */
export const enableDark = (): void => {
  setTheme("dark");
};
```

在 `:root` 下声明 `Css variables`：

```scss title="themes/default/index.scss"
:root,
.light {
  // base color
  --accents-1: #fafafa;
  --accents-2: #eaeaea;
  --accents-3: #999;
  --accents-4: #888;
  --accents-5: #666;
  --accents-6: #444;
  --accents-7: #333;
  --accents-8: #111;
  --geist-foreground: #000;
  --geist-background: #fff;
  --geist-selection: var(--geist-cyan);

  // status color
  --geist-success: #0070f3;
  --geist-success-light: #3291ff;
  --geist-success-dark: #0366d6;

  --geist-error: #e00;
  --geist-error-light: #ff1a1a;
  --geist-error-dark: #c00;

  --geist-warning: #f5a623;
  --geist-warning-light: #f7b955;
  --geist-warning-dark: #f49b0b;

  // highlight
  --geist-alert: #ff0080;
  --geist-purple: #f81ce5;
  --geist-cyan: #79ffe1;
  --geist-violet: #7928ca;

  // etc...
}
```

```scss title="themes/dark/index.scss"
.dark {
  // base color
  --accents-1: #111;
  --accents-2: #333;
  --accents-3: #444;
  --accents-4: #666;
  --accents-5: #888;
  --accents-6: #999;
  --accents-7: #eaeaea;
  --accents-8: #fafafa;
  --geist-foreground: #fff;
  --geist-background: #000;
  --geist-selection: var(--geist-purple);

  // status color
  --geist-success: #0070f3;
  --geist-success-light: #3291ff;
  --geist-success-dark: #0366d6;

  --geist-error: #e00;
  --geist-error-light: #ff1a1a;
  --geist-error-dark: #c00;

  --geist-warning: #f5a623;
  --geist-warning-light: #f7b955;
  --geist-warning-dark: #f49b0b;

  // highlight
  --geist-alert: #ff0080;
  --geist-purple: #f81ce5;
  --geist-cyan: #79ffe1;
  --geist-violet: #7928ca;

  // etc...
}
```

## 目录结构

不在 SFC 的 `<style>` 标签书写样式，而是在单独的目录中编写样式文件，是为了：

- 和 [图标](/posts/setup-vue3-component-library/svg-icon) 一样，样式和组件解耦，减少构建后的体积；
- 便于移植到其他语言；~~万一你需要同时支持 Vue 和 React 呢？~~
- 在 package.json 中声明 `style` 属性；
- 在 package.json 中声明 `sideEffects` 属性；

```ansi
_styles
 ┣ foundation
 ┣ themes
 ┣ index.scss
 ┗ _avatar.scss
```

## 其他实践

我个人比较习惯直入直出的写法，只定义 `Css variables`，每个组件使用单独的 `.scss` 文件来编写样式。

如果你对 sass 有非常深入的了解，或者想更进一步，可以参考 [《SCSS 和 CSS变量的架构实践》](https://juejin.cn/post/7190370726677839932#heading-10)，里面详细介绍了 Element-plus 构建整套样式 `theme-chalk` 的思路和方法。

用这种思路编写代码之后，SFC 文件中需要通过 js 来单独组装 className，例如 `<el-avatar />`：

```astro
<template>
  <span :class="avatarClass" :style="sizeStyle">
    <img
      v-if="(src || srcSet) && !hasLoadError"
      :src="src"
      :alt="alt"
      :srcset="srcSet"
      :style="fitStyle"
      @error="handleError"
    />
    <el-icon v-else-if="icon">
      <component :is="icon"></component>
    </el-icon>
    <slot v-else />
  </span>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from "vue";
  import { ElIcon } from "@element-plus/components/icon";
  import { useNamespace } from "@element-plus/hooks";
  import { addUnit, isNumber, isString } from "@element-plus/utils";
  import { avatarEmits, avatarProps } from "./avatar";

  import type { CSSProperties } from "vue";

  defineOptions({
    name: "ElAvatar",
  });

  const props = defineProps(avatarProps);
  const emit = defineEmits(avatarEmits);

  const ns = useNamespace("avatar");

  const hasLoadError = ref(false);

  const avatarClass = computed(() => {
    const { size, icon, shape } = props;
    const classList = [ns.b()];
    if (isString(size)) classList.push(ns.m(size));
    if (icon) classList.push(ns.m("icon"));
    if (shape) classList.push(ns.m(shape));
    return classList;
  });

  const sizeStyle = computed(() => {
    const { size } = props;
    return isNumber(size)
      ? (ns.cssVarBlock({
          size: addUnit(size) || "",
        }) as CSSProperties)
      : undefined;
  });

  const fitStyle = computed<CSSProperties>(() => ({
    objectFit: props.fit,
  }));

  // need reset hasLoadError to false if src changed
  watch(
    () => props.src,
    () => (hasLoadError.value = false)
  );

  function handleError(e: Event) {
    hasLoadError.value = true;
    emit("error", e);
  }
</script>
```

Element-plus 通过 `useNamespace` 来构建 className 的前缀，整个 SFC 文件中看不到具体的类名，如果不熟悉这种风格，很难找到对应的样式。

如果再来一些循环等方法来开发 `Col` 等组件的样式的话：

```scss
@use "sass:math";

@use "common/var" as *;
@use "mixins/mixins" as *;
@use "mixins/_col" as *;

[class*="#{$namespace}-col-"] {
  box-sizing: border-box;
  @include when(guttered) {
    display: block;
    min-height: 1px;
  }
}

.#{$namespace}-col-0 {
  display: none;
  @include when(guttered) {
    display: none;
  }
}

@for $i from 0 through 24 {
  .#{$namespace}-col-#{$i} {
    max-width: (math.div(1, 24) * $i * 100) * 1%;
    flex: 0 0 (math.div(1, 24) * $i * 100) * 1%;
  }

  .#{$namespace}-col-offset-#{$i} {
    margin-left: (math.div(1, 24) * $i * 100) * 1%;
  }

  .#{$namespace}-col-pull-#{$i} {
    position: relative;
    right: (math.div(1, 24) * $i * 100) * 1%;
  }

  .#{$namespace}-col-push-#{$i} {
    position: relative;
    left: (math.div(1, 24) * $i * 100) * 1%;
  }
}

@include col-size(xs);

@include col-size(sm);

@include col-size(md);

@include col-size(lg);

@include col-size(xl);
```

:worried: 对于 `less/sass` 只会一个嵌套操作的，这种模式还比较费时费力，

如果你不想花费大精力深入 `sass`，可以采用单文件、唯一前缀的方式来快速编写组件样式，

如果你已经深入了解过 `sass`，也可以用上述模式来进行实践。
