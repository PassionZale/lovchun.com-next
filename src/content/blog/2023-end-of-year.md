---
title: 2023 总结
pubDatetime: 2023-12-31T04:06:31Z
slug: 2023-end-of-year
featured: true
draft: false
tags:
  - 生活
description: 2023 我心中的 Top8。
---

> 2023，**1 次**裁员，**4 家**公司，**4 个**仓库，**15 篇**博客，**2 本**书，**458 次**提交。

## Table of contents

## Ranks

3-7 月，在刷面试题、找工作、入职、换工作中反复横跳，

8-10 月，熟悉新公司，适应新环境，

直到最后一个季度，才挤出一些时间，做完了心心念的组件库。

整整一年，做了一些“自我陶醉”的小玩具，期间用到了许多有意思的工具和库，总结出我心中的 **Top8**：

| 排行              | 名称                                       |
| :---------------- | :----------------------------------------- |
| :1st_place_medal: | [Vercel](https://vercel.com/)              |
| :2nd_place_medal: | [Contentlayer](https://contentlayer.dev/)  |
| :3rd_place_medal: | [Vite](https://vitejs.dev/)                |
| #4                | [VitePress](https://vitepress.dev/)        |
| #5                | [Plop](https://plopjs.com/)                |
| #6                | [Slidev](https://sli.dev/)                 |
| #7                | [unbuild](https://github.com/unjs/unbuild) |
| #8                | [zustand](https://docs.pmnd.rs/zustand)    |

## Vercel

**Vercel 也太好用了吧！**

从 2022 年停掉阿里云 ECS 之后，就一直用它来部署我的各种项目：

- 关联 Github repo；
- 自定义域名解析；
- 部署和构建；
- 统计分析；
- 日志；
- 等等...

一直以来我都将 `A` 指向 `76.76.21.98`，但是十一之后，国内几乎无法访问，

反而 `CNAME` 指向 `cname-china.vercel-dns.com` 的二级域名在国内都能正常访问，

如果你也用 Vercel 部署，并使用了自定义域名，可以试试将 `CNAME` 指向 `cname-china.vercel-dns.com`。

## Contentlayer

在使用 Nextjs 重构网站时，想用 `*.mdx` 代替 `*.md`，

最早用 `@next/mdx`，热更新很慢，项目启动很慢，8G 的 2015 mba 完全带不动...

相比把 `*.mdx` 放到 `/pages/` 目录中当作页面路由，我更倾向于把他们放到 `/data/` 目录中，

整个站点的各类数据（包括文章）全部在里面，通过 `mdx-loader` + `node:fs` 来进行解析，

将 `*.mdx` 转换成 `data collections`，创建 `async router path`，

这么一波操作后，开发时更卡了...

后面找到了 Contentlayer，终于解决了这一系列的问题。

![contentlayer.png](/images/contentlayer.png)

## Vite

**Vite 也太快了吧！**

今年接手的大部分项目还是 Webpack3/4、Umi3，加上公司配置的电脑，开发体验一言难尽，

历史包袱重一些的项目，10 分钟内启动已是谢天谢地，从来没有体验过**热更新**。

接连用 Vite 开发了一些自己的小项目以及公司的新项目，启动和编译速度简直和火箭一样...

尤其是 `mport.meta.glob`，这个太酷了！

以前将路由或者组件按目录拆分成不同的模块，都需要一个个的 `import/export`，现在只需要一个通配符：

```ansi
router
 ┣ modules
 ┃ ┣ module1.tsx
 ┃ ┣ module2.tsx
 ┃ ┣ module3.tsx
 ┃ ┗ module4.tsx
 ┗ index.tsx
```

```ts title="index.tsx"
const routerModules = import.meta.glob(['./modules/*.tsx'], {
  eager: true,
}) as Record<
  string,
  {
    [key: string]: any
  }
>

const metaRouters: RouterObject[] = []

Object.keys(routerModules).forEach(item => {
  Object.keys(routerModules[item]).forEach(key => {
    metaRouters.push(...routerModules[item][key])
  })
})

const rootRouter: RouterObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Navigate to="/home" replace />
  },
  ...metaRouters,
  {
    path: '*',
    element: <Navigate to="/404" />
  }
]
```

## VitePress

今年在开发 [Geist Design](https://geist-design.lovchun.com) 时，用 VitePress 搭建了文档，

深入了解了如何自定义主题、配置、本地搜索，如何使用 `postcss` 解决样式冲突等问题...

沉浸式的编写 `Markdown`，简单、高效的完成文档的编写。

## Plop

实际项目中，经常会频繁建组件、页面，

最早，我总是通过 `node:fs` + `prompts` 来快速生成一些文件，例如：创建小程序组件/页面，Vue/React 组件/页面等等，

后面在某个项目中接触到了 Plop，今年又在三个项目中真正落地使用了一番，它确实是一个非常成体系的模板生成工具。

`*.hbs` 模板、添加、修改等常规的 `action` 其实没有什么好说的，参考官网即可，

这里主要介绍下 **追加**、**修改**、**自定义 action** 等操作：

```ansi
components
 ┣ avatar
 ┃ ┗ index.ts
 ┗ index.ts
```

```ts title="index.ts"
export { GAvatar } from "./avatar";
export * from "./avatar";

/** PLOP_INJECT_EXPORT */
```

通过 `/** PLOP_INJECT_EXPORT */` 这个标记物，每次创建组件后，在 `index.ts` 后面追加新组件的 `export` 代码：

```js title="plopfile.js"
actions: {
  {
    type: 'modify',
    path: 'components/index.ts',
    pattern: `/** PLOP_INJECT_EXPORT */`,
    template:
      `export { G{{pascalCase name}} } from './{{kebabCase name}}'\nexport * from './{{kebabCase name}}'\n\n/** PLOP_INJECT_EXPORT */`
  },
}
```

在开发组件库时，新增的组件需要编写文档，因此需要更新 VitePress `sidebar` 的配置：

```ts title="sidebar.ts"
export const sidebar = [
    '/components/': [
    {
      text: '组件',
      items: [
        {
          text: '通用',
          items: [
            {
              text: '图标 <small>Icons</small>',
              link: '/components/icons'
            } /** PLOP_INJECT_SIDEBAR_GENERAL */
          ]
        },
      ]
    }
  ]
]
```

```js title="plopfile.js"
actions: {
  async function modifySidebars(answers) {
    // sidebar.ts 文件路径
    const entryFilePath = path.resolve(
      __dirname,
      "../../docs/.vitepress/config/sidebar.ts"
    );

    // plop 模板
    const template = `,\n            { text: '{{title}} <small>{{pascalCase name}}</small>', link: '/components/{{kebabCase name}}' } /** PLOP_INJECT_SIDEBAR_{{category}} */`;

    // 读取文件内容
    const content = fs.readFileSync(entryFilePath, "utf-8");

    // 将匹配的标记物替换为 plop 模板
    const result = content.replace(
      ` /** PLOP_INJECT_SIDEBAR_${answers.category} */`,
      plop.renderString(template, answers)
    );

    // 获取 prettier 配置文件
    const prettierConfigs = await prettier.resolveConfig(entryFilePath);

    // 使用 prettier 格式化 result
    const validResult = await prettier.format(result, {
      filepath: entryFilePath,
      ...prettierConfigs,
    });

    // 将 result 覆盖写入 sidebar.ts
    fs.writeFileSync(entryFilePath, validResult, "utf-8");

    // 获取相对路径作为 action 的返回语
    const relativePath = path.relative(
      path.resolve(__dirname, "../../"),
      entryFilePath
    );

    return `${relativePath} modified`;
  }
}
```

## Slidev

起因是公司临时让我做一个技术分享，需要有 PPT 还要归档，但是我完全不会 PPT...

最后找到了 Slidev，用了近一周的时间，折腾了第一个作品：[Setup Miniprogram](https://talks.lovchun.com/2023/setup-miniprogram)，

它的静态部署、演讲录制、动画、代码高亮真的让我眼前一亮。

对我来讲，只有一个痛点，就是不能太随意的缩进或者格式化代码，最好每一行都顶头书写，

如果你要导出 PDF 进行存档，建议少使用 `v-click-hide/v-after`，因为导出的文件是全量的、纯静态的，会将下一步才出现的内容覆盖到之前步骤上。

## unbuild

如果说之前的 Vite 构建速度堪比火箭，那这个库就更可怕了。

unbuild 之所以命名为 unbuild，就是因为它不需要编译吧...

你只需要使用它的 `stub` 模式，跑一次编译，后面随意修改你的 sourceCode，立即就会生效，

没有 `watch` 进程的监听，没有二次构建，什么都没有发生，真的就是 unbuild。

## zustand

相比 `redux` `mobx`，zustand 给人的心智负担少了很多，写起来有一种在写 Vue3 的 composable api 的感觉...

**使用 zustand：**

```ts
import { create } from "zustand";

type Store = {
  count: number;
  inc: () => void;
};

const useStore = create<Store>()(set => ({
  count: 1,
  inc: () => set(state => ({ count: state.count + 1 })),
}));

export default useStore;
```

**使用 vue：**

```ts
import { ref } from "vue";

const useStore = () => {
  const count = ref(1);

  const inc = () => (count.value = count.value + 1);

  return {
    count,
    inc,
  };
};

export default useStore;
```
