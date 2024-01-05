---
title: 构建 Vue3 组件库 - 渲染器
description: 如何打包并发布组件库。
pubDatetime: 2022-11-25T04:06:31Z
postSlug: setup-vue3-component-library/plopjs
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
- [plop-template](https://github.com/PassionZale/geist-design/tree/main/scripts/plop-template)
- [plop-generator](https://github.com/PassionZale/geist-design/tree/main/scripts/plop-generator)
- [plopfile.js](https://github.com/PassionZale/geist-design/blob/main/plopfile.js)

在前面的文章中，开始一个组件，需要在各个目录中创建一系列的文件，例如创建一个按钮组件：

在 `src/` 中创建 `button` 目录，并添加 `_button.scss`，

此外还要在 `index.scss` 和 `index.ts` 中添加导入和导出代码，

`button` 目录中还要创建 `ts` 和 `vue` 文件等等。

```diff title="index.scss"
+ @import './_button.scss';
```

```diff title="index.ts"
+ export { GButton } from './button'
+ export * from './button'
```

如果每次创建一个新组件，都手动创建他们，可能会**崩溃**...

这些文件都是可以基于一份标准的样板代码，根据不同的组件名称来生成，

使用 [plopjs](https://plopjs.com/)，来编写模板生成器：

```shell
npm i -D plopjs
```

```diff title="package.json"
{
  "scripts": {
+    "plop": "plop"
  }
}
```

创建 popfile.js 并编写一个 `generator`：

- 输入组件名称；
- 将输入值转换为 kebabCase 风格；
- 使用 `add action` 来添加文件；
- 使用 `modify action` 来追加导入导出的样板代码；

```js title="plop-create-component"
/**
 * 组件 Generator
 *
 * @returns {import('plop').PlopGeneratorConfig}
 */
export const getGenerator = () => {
  return {
    description: '创建组件',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入组件名称'
      }
    ],
    actions: [
      // scss
      {
        type: 'add',
        path: 'src/_styles/_{{kebabCase name}}.scss',
        templateFile: 'scripts/plop-template/component/_styles/scss.hbs'
      },
      // __test__
      {
        type: 'add',
        path: 'src/{{kebabCase name}}/__test__/{{kebabCase name}}.spec.ts',
        templateFile: 'scripts/plop-template/component/__test__/spec.hbs'
      },
      // sfc
      {
        type: 'add',
        path: 'src/{{kebabCase name}}/src/{{kebabCase name}}.vue',
        templateFile: 'scripts/plop-template/component/src/sfc.hbs'
      },
      // props
      {
        type: 'add',
        path: 'src/{{kebabCase name}}/src/props.ts',
        templateFile: 'scripts/plop-template/component/src/props.hbs'
      },
      // interface
      {
        type: 'add',
        path: 'src/{{kebabCase name}}/src/interface.ts',
        templateFile: 'scripts/plop-template/component/src/interface.hbs'
      },
      // index
      {
        type: 'add',
        path: 'src/{{kebabCase name}}/index.ts',
        templateFile: 'scripts/plop-template/component/index.hbs'
      },
      // modify entries
      {
        type: 'modify',
        path: 'src/_styles/index.scss',
        pattern: `/** PLOP_INJECT_IMPORT */`,
        template: `@import './_{{kebabCase name}}.scss';\n/** PLOP_INJECT_IMPORT */`
      },
      {
        type: 'modify',
        path: 'src/components.ts',
        pattern: `/** PLOP_INJECT_EXPORT */`,
        template:
          `export { G{{pascalCase name}} } from './{{kebabCase name}}'\nexport * from './{{kebabCase name}}'\n\n/** PLOP_INJECT_EXPORT */`
      },
      {
        type: 'modify',
        path: 'src/global.d.ts',
        pattern: `/** PLOP_INJECT_EXPORT */`,
        template: `G{{pascalCase name}}: typeof components.G{{pascalCase name}}\n    /** PLOP_INJECT_EXPORT */`
      }
    ]
  }
}
```

创建文档也和组件类似，创建一个文档：

- 输入组件/页面名称；
- 选择导航分类；
- 使用 `add action` 来添加文件；
- 使用 `custom action` 更新 vitepress 的 `sidebar` 配置；

```js title="plop-create-example"
/**
 * 示例 Generator
 *
 * @returns {import('plop').PlopGeneratorConfig}
 */

import path from 'node:path'
import fs from 'node:fs'
import url from 'node:url'
import prettier from 'prettier'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SIDEBAR_MAPS = {
  通用: 'GENERAL',
  布局: 'LAYOUT',
  容器: 'CONTAINER',
  表单: 'FORM',
  数据展示: 'DATA_DISPLAY',
  反馈: 'FEEDBACK',
  导航: 'NAVIGATION',
  其他: 'OTHERS'
}

export const getGenerator = plop => {
  return {
    description: '创建示例',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入组件名称'
      },
      {
        type: 'input',
        name: 'title',
        message: '请输入标题'
      },
      {
        type: 'list',
        name: 'category',
        loop: false,
        message: '请选择分类',
        choices: Object.keys(SIDEBAR_MAPS).map(key => ({
          name: key,
          value: SIDEBAR_MAPS[key]
        }))
      }
    ],
    actions: [
      // markdown
      {
        type: 'add',
        path: 'docs/components/{{kebabCase name}}.md',
        templateFile: 'scripts/plop-template/example/markdown.hbs'
      },

      // sfc
      {
        type: 'add',
        path: 'docs/.vitepress/theme/examples/{{kebabCase name}}/basic.vue',
        templateFile: 'scripts/plop-template/example/sfc.hbs'
      },

      // sidebar
      async function modifySidebars(answers) {
        // sidebar.ts 文件路径
        const entryFilePath = path.resolve(
          __dirname,
          '../../docs/.vitepress/config/sidebar.ts'
        )

        // plop 模板
        const template = `,\n            { text: '{{title}} <small>{{pascalCase name}}</small>', link: '/components/{{kebabCase name}}' } /** PLOP_INJECT_SIDEBAR_{{category}} */`

        // 读取文件内容
        const content = fs.readFileSync(entryFilePath, 'utf-8')

        // 将匹配的标记物替换为 plop 模板
        const result = content.replace(
          ` /** PLOP_INJECT_SIDEBAR_${answers.category} */`,
          plop.renderString(template, answers)
        )

        // 获取 prettier 配置文件
        const prettierConfigs = await prettier.resolveConfig(entryFilePath)

        // 使用 prettier 格式化 result
        const validResult = await prettier.format(result, {
          filepath: entryFilePath,
          ...prettierConfigs
        })

        // 将 result 覆盖写入 sidebar.ts
        fs.writeFileSync(entryFilePath, validResult, 'utf-8')

        // 获取相对路径作为 action 的返回语
        const relativePath = path.relative(
          path.resolve(__dirname, '../../'),
          entryFilePath
        )

        return `${relativePath} modified`
      }
    ]
  }
}
```
