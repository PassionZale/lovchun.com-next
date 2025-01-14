---
title: 构建小程序 - 插件、目录、开发者工具、配置
description: 推荐一些有趣且实用的 vscode插件、目录结构设计、微信开发者工具配置等。
pubDatetime: 2022-07-01
slug: setup-miniprogram/part-1
column: setup-miniprogram
featured: false
draft: false
tags:
  - 指南
  - 微信小程序
---

![miniprogram](/images/setup-miniprogram/miniprogram.jpeg)

## 目录

- [**《构建小程序 - 插件、目录、开发者工具、配置》**](/posts/setup-miniprogram/part-1)
- [**《构建小程序 - 异常、通讯、技巧》**](/posts/setup-miniprogram/part-2)
- [**《构建小程序 - 框架、Gulpjs、Task》**](/posts/setup-miniprogram/part-3)
- [**《构建小程序 - Generator》**](/posts/setup-miniprogram/part-4)
- [**《构建小程序 - CI》**](/posts/setup-miniprogram/part-5)

## VSCode 插件

- **ESLint**

  > 提供全局的语法检查

- **stylelint**

  > 提供 `*.scss` `*.wxss` 样式文件检查

- **Prettier**

  > 提供统一的全局代码格式化

- **wxml**

  > 提供 jsx 风格的代码格式化

- **小程序开发助手**

  > 提供 wxml 的语法高亮

## 目录结构

```ansi
miniprogram
 ┣ build
 ┣ dist
 ┣ scripts
 ┃ ┣ ci
 ┃ ┣ generator
 ┃ ┣ gulp
 ┃ ┗ lib
 ┣ src
 ┃ ┣ home
 ┃ ┣ subPackage1
 ┃ ┣ _shared
 ┃ ┣ app.js
 ┃ ┣ app.json
 ┃ ┗ app.scss
 ┣ .env.dev
 ┣ .env.prod
 ┣ .env.sit
 ┣ .env.uat
 ┣ gulpfile.js
 ┣ package.json
 ┗ _project.config.json
```

## 微信开发者工具

经过数次迭代后，微信开发者工具已经能够支持 `ES6 => ES5` 的转换了，此外，开发者工具在某个版本开启了文件依赖分析，导致`预览`或`上传`时会自动忽略动态引用的模块文件。

针对这两点，只需要开启或关闭对应配置项即可。

```diff title="_project.config.json"
{
    # 开启这3种配置项即可 ES6 => ES5
    # 开启后，我们便可在 *.js 文件中直接使用 ES6 语法
    # 注意！*.wxs 文件中仍然只能使用 ES5 语法
+   "es6": true,
+   "es7": true,
+   "enhance": true,

    # 禁用上传忽略
+   "ignoreUploadUnusedFiles": false,
    # 禁用预览忽略
+   "ignoreDevUnusedFiles": false
}
```

## 配置文件说明

由于小程序文件名的特殊性，在结合 `plugins` 和 `lint packages` 时，需要针对 `*.wxs` `*.wxss` `*.wxml` 等文件进行额外的配置。

```json title=".vscode/settings.json" {7,8,12,14-23}
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.autoClosingQuotes": "always",
  "javascript.preferences.quoteStyle": "single",
  "files.associations": {
    "*.wxss": "css",
    "*.wxs": "javascript"
  },
  "files.eol": "\n",
  "emmet.includeLanguages": {
    "wxml": "html"
  },
  "wxmlConfig.onSaveFormat": true,
  "wxmlConfig.format": {
    "indent_char": " ",
    "indent_size": 2,
    "indent_with_tabs": false,
    "wrap_attributes_count": 4,
    "wrap_attributes": "force-expand-multiline"
  },
  "minapp-vscode.formatMaxLineCharacters": 80,
  "minapp-vscode.documentSelector": ["none"]
}
```

```js title=".eslintrc.js" {3-10,12}
module.exports = {
  globals: {
    App: true,
    getApp: true,
    Page: true,
    wx: true,
    getCurrentPages: true,
    Component: true,
    Behavior: true,
    getDate: true,
    // *.wxs 中只能 getRegExp() 来创建正则
    getRegExp: true
  },
  // ... other configs
}
```

```diff:.gitignore
# 保留 .vscode/settings.json
# 应用配置给每位开发同事
+ .vscode/*
+ !.vscode/settings.json

# 排除工程文件，避免相互修改导致文件冲突

# 1. project.config.json 会通过脚本动态创建
+ project.config.json
# 2. 由微信开发者工具自动创建
+ project.private.config.json
```

```js title=".prettierrc.js" {4-9, 11-16}
module.exports = {
  overrides: [
    // *.wxss 使用 css 规则进行美化
    {
      files: '*.wxss',
      options: {
        parser: 'css'
      }
    },
    // *.wxs 使用 babel 按照 js 规则进行美化
    {
      files: '*.wxs',
      options: {
        parser: 'babel'
      }
    }
  ],
  // ...other configs
}
```

```js title=".stylelintrc.js" {7}
module.exports = {
  rules: {
    'selector-type-no-unknown': [
      true,
      {
        // 忽略 page view 小程序原生标签
        ignoreTypes: ['page', 'view', 'string']
      }
    ]
  }
  // ...other configs
}
```

```diff title="package.json"
{
  "config": {
    "commitizen": {
+      "path": "node_modules/cz-customizable"
    },
    "cz-customizable": {
+      "config": ".cz-config.js"
    }
  },
  "husky": {
    "hooks": {
+      "pre-commit": "lint-staged",
+      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
+    "src/**/*.{js,wxs}": [
      "eslint --fix",
      "prettier --write"
    ],
+    "src/**/*.{scss,less,wxss}": [
      "stylelint --fix",
      "prettier --write"
    ],
    "src/**/*.json": [
      "prettier --write"
    ]
  },
}
```

```json title="jsconfig.json" {3,6}
{
  "compilerOptions": {
    "baseUrl": ".",
    // 增加 alias 配置
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "dist", "...等非源码目录"]
}
```

```shell title="env.*"
# 当前环境的小程序 APPID
# APPID 会被读取，而后会通过脚本注入并创建 project.config.json
APPID=${YOUR_MINIPROGRAM_APPID}

# 当前环境的 API BASEPATH
# 例如: https://sit-api.example.com
# 类似 axios.basePath，会被应用在 wx.request 的封装中
API_BASEPATH=${YOUR_API_PATH}
```

## 类库推荐

小程序实际开发过程中，有部分问题会严重的影响代码整洁和开发效率：

1. 没有**进程环境变量**，更换环境时，总是需要手动修改 `appid` 和 `域名`；
2. 没有 `alias`，在引入模块时，需要写很长的相对路径，如：`../../../../_shared/utils/index.js`；
3. 不支持 css 预处理；
4. `Commonjs` 最大弊端 “循环加载”，会导致你必须在使用处进行 `require(module)`，而不能在代码首行引入模块；
5. `project.config.json` 是非常重要的工程配置，不仅会影响本地开发者工具，还会影响小程序的发布上传，通常该文件被追踪提交，开发成员相互篡改、相互覆盖，没有标准化；

### [gulp-preprocess](https://github.com/pioug/gulp-preprocess)

通过读取并收集 `env.*`，在 Gulp Task 中注入环境变量，便可在 `runtime` 期间通过脚本读取不通的环境来切换对应的环境变量。

```js title="./scripts/gulp/tasks/js.task.js" {6}
const context = { APPID: 'appid', API_BASEPATH: 'API_BASEPATH' }

module.exports = () =>
  gulp
    .src(['./src/**/*.js'])
    .pipe($.preprocess({ context, type: 'js' }))
    .pipe(gulp.dest(args.output))
```

```js title="./src/_shared/configs/env.js"
export const APPID = '/* @echo APPID */' || ''

export const API_BASEPATH = '/* @echo API_BASEPATH */' || ''
```

### [gulp-alias](https://github.com/pengzhanbo/gulp-miniprogram-path-alias)

> 注入 alias 配置

```js title="./scripts/gulp/context.js"
// 声明 alias 配置
const aliasConfig = {
  '@': path.resolve(process.cwd(), 'src')
}
```

```js title="./scripts/gulp/tasks/js.task.js" {4}
module.exports = () =>
  gulp
    .src(['./src/**/*.js'])
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe(gulp.dest(args.output))
```

> 通过 alias 引入模块

**`*.js`**

```js
import userHelper from "@/_shared/helper/user";
```

**`*.wxs`**

```js
const userHelper = require("@/_shared/helper/user");
```

**`*.scss`**

```css
@import "@/_shared/styles/flex.scss";
```

**`*.wxml`**

```html
<import src="@/common/test.wxml" /> <image src="@/_shared/images/test.png" />
```

### [gulp-dart-sass](https://github.com/mattdsteele/gulp-dart-sass)

使用 `dart-sass` 来处理 `*.scss`，并迁移为 `*.wxss`

```js title="./scripts/gulp/tasks/scss.task.js" {4,5,8}
module.exports = () =>
  gulp
    .src(['./src/**/*.scss', '!./src/_shared/styles/*.scss'])
    .pipe($.dartSass.sync({ outputStyle: 'compressed' }))
    .on('error', $.dartSass.logError)
    .pipe(
      $.rename({
        extname: '.wxss'
      })
    )
    .pipe(gulp.dest(args.output))
```
