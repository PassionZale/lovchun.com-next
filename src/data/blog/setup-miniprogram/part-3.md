---
title: 构建小程序 - 框架、Gulpjs、Task
description: 实际项目中，如何实用 Gulpjs 组装小程序开发框架，如何设计脚本目录，如何编写 Gulp Task。
pubDatetime: 2023-07-09
slug: setup-miniprogram/part-3
column: setup-miniprogram
featured: false
draft: false
tags:
  - 指南
  - 微信小程序
---

![gulp](/images/setup-miniprogram/gulp.png)

## 目录

- [**《构建小程序 - 插件、目录、开发者工具、配置》**](/posts/setup-miniprogram/part-1)
- [**《构建小程序 - 异常、通讯、技巧》**](/posts/setup-miniprogram/part-2)
- [**《构建小程序 - 框架、Gulpjs、Task》**](/posts/setup-miniprogram/part-3)
- [**《构建小程序 - Generator》**](/posts/setup-miniprogram/part-4)
- [**《构建小程序 - CI》**](/posts/setup-miniprogram/part-5)

## 框架

市面上有许多小程序开发框架: wepy/mpvue/taro/uni-app 等等...

选原生开发还是第三方框架，一直是个很纠结的问题。

### 原生开发

- 原生开发对 Node、预编译器、环境变量等支持很差，影响开发效率和工程构建流程；
- 小程序定义了一套新的语法、标签、内置组件，需要一定的学习成本；
- 生态差，很多时候都需要从零手写，没有太多好用的第三方库；

### 第三方框架

- 担心性能不如原生；
- 担心有些功能框架实现不了，只能用原生；
- 担心框架不稳定，比原生的坑还多；

### 如何取舍

- 项目很大，页面数量 30+；
- 交互复杂；
- 需要同时在企微和微信中运行；
- 不考虑其他平台；

**满足这四点，建议直接使用原生开发。**

针对原生开发，为了提高开发效率，首先需要做的就是挑选一个构建工具。

不论第三方框架是基于 `Vuejs` 还是 `React`，整个构建过程，它们都在干同一件事情：

> 将代码转换成小程序所约定的文件和目录

```shell
# 转换 wxss
css/less/scss/stylus => wxss
# 转换 wxml
jsx/template => wxml
# 转换 标签
html dom => <view/>、<text />、<scroll-view />、etc...
# 转换 语法
ES6 => ES5
```

小程序原生开发，不论是组件还是页面，通常都由四种文件组成:

| 文件类型 | 必须 | 说明 |
| :------- | :--- | :--- |
| `*.wxml` | 是   | 视图 |
| `*.js`   | 是   | 脚本 |
| `*.json` | 是   | 配置 |
| `*.wxss` | 否   | 样式 |

原生开发对比第三方框架，在 `js` 的处理上，我们不需要借助 `webpack` 或者 `babel` 来完成 `React` `Vuejs` `ES7/6` 的转换，

如果需要嵌套一层构建逻辑，最简单最直接的方式就是做**文件迁移**，那么 `Gulpjs` 这种基于 node stream 便是一个很好的选择，

简单粗暴，将 `源码` 转换后迁移到对应 `目录` 中。

```shell
# task.wxss.js
css/less/scss/stylus => wxss
# task.wxml.js
wxml => wxml
# 原生开发无需转换
html dom => <view/>、<text />、<scroll-view />、etc...
# 开发者工具已支持
ES6 => ES5
```

## 目录结构

```ansi
scripts
 ┣ gulp
 ┃ ┣ tasks
 ┃ ┃ ┣ clean.task.js
 ┃ ┃ ┣ js.task.js
 ┃ ┃ ┣ json.task.js
 ┃ ┃ ┣ others.task.js
 ┃ ┃ ┣ projectBuild.task.js
 ┃ ┃ ┣ projectMake.task.js
 ┃ ┃ ┣ scss.task.js
 ┃ ┃ ┣ watch.task.js
 ┃ ┃ ┣ wxml.task.js
 ┃ ┃ ┣ wxs.task.js
 ┃ ┃ ┣ wxss.task.js
 ┃ ┃ ┗ zip.task.js
 ┃ ┗ context.js
 ┗ lib
```

### 脚本

> 结合项目的 `workflow` 来设计所需要的脚本

**环境**

> 开发、测试、预发布、生产，四个环境同时也对应着四个环境分支

```js
const ENV_BRANCH_MAPS = {
  // 环境 : 分支
  dev: "dev",
  sit: "test",
  uat: "pre-release",
  prod: "master",
};
```

**运行**

> 本地运行时，直接以本地代码为准运行项目

```json
{
  "start:dev": "运行开发环境",
  "start:sit": "运行测试环境",
  "start:uat": "运行预发布环境",
  "start:prod": "运行生产环境"
}
```

<video width="100%" aspect-radio="16/9" controls>
  <source src="/videos/setup-miniprogram/local-dev.webm" type="video/webm"></source>
</video>

**构建**

> 环境构建时，以 remote env-branch 分支进行打包

```json
{
  "build:dev": "构建开发环境",
  "build:sit": "构建测试环境",
  "build:uat": "构建预发布环境",
  "build:prod": "构建生产环境"
}
```

<video width="100%" aspect-radio="16/9" controls>
  <source src="/videos/setup-miniprogram/env-build.webm" type="video/webm"></source>
</video>

### 依赖

| 名称                        | 版本    | 说明                             |
| :-------------------------- | :------ | :------------------------------- |
| del                         | ^6.0.0  | 清空指定目录                     |
| dotenv-flow                 | ^3.2.0  | 读取 .env 文件                   |
| fs-extra                    | ^10.1.0 | 替代 `fs` 操作目录或文件         |
| gulp                        | ^4.0.2  | N/A                              |
| gulp-dart-sass              | ^1.0.2  | 将 scss 转换为 wxss              |
| gulp-json-format            | ^2.0.0  | 格式化 json 文件                 |
| gulp-load-plugins           | ^2.0.7  | 更容易的加载 gulp 插件           |
| gulp-miniprogram-path-alias | ^0.3.1  | 让小程序支持 alias path 模块引入 |
| gulp-preprocess             | ^4.0.2  | 让小程序支持环境变量             |
| gulp-rename                 | ^2.0.0  | 更改目录或文件的名称             |
| gulp-zip                    | ^5.1.0  | 将 output 压缩为 zip             |
| require-dir                 | ^1.2.0  | 加载指定目录                     |
| through2                    | ^4.0.2  | 解析流中的数据并操作             |
| yargs                       | ^17.4.1 | 解析脚本中接收到的入参           |

### 上下文

环境变量、插件、配置等需要共享到每个 `gulp task` 中，提取一个 `context.js` 模块：

```js title="./scripts/gulp/context.js"
const { existsSync } = require('fs')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')({ DEBUG: false, lazy: true })
const path = require('path')
const dotenvFlow = require('dotenv-flow')

const yargs = require('yargs/yargs')
const args = yargs(yargs.hideBin(process.argv)).argv

const pkg = require('../../package.json')

const { dateFormatter } = require('../lib/helper')
const logger = require('../lib/logger')

const { env = 'dev', ignoreLocal } = args

const variables = parseENV()

// 构建时，最终生产压缩文件的名称 ${buildId}.zip
const buildId = `${pkg.name}_${env}_v${pkg.version}_${dateFormatter(
  new Date(),
  'yyyyMMddHHmmss'
)}`

// gulp-miniprogram-alias 配置
const aliasConfig = {
  '@': path.resolve(process.cwd(), 'src')
}

// gulp-preprocess 配置
const processContext = {
  ENV: env.toUpperCase(),
  VERSION: pkg.version,
  ...variables
}

// 解析 .env 文件
function parseENV() {
  const envPath = path.resolve(process.cwd(), `.env.${env}`)
  const envLocalPath = path.resolve(process.cwd(), `.env.local`)

  // gulp build 时，忽略 .env.local
  const envs =
    existsSync(envLocalPath) && !ignoreLocal
      ? [envPath, envLocalPath]
      : [envPath]

  try {
    const variables = dotenvFlow.parse(envs)

    const { APPID, API_BASEPATH } = variables

    if (!APPID || !API_BASEPATH) {
      logger.fatal('APPID, API_BASEPATH 必填，请检查 .env 配置文件')
    }

    return variables
  } catch (error) {
    logger.fatal(error)
  }
}

process.once('SIGINT', () => {
  process.exit(0)
})

module.exports = {
  // gulp 实例
  gulp,
  // gulp plugins 集合
  $,
  // 命令行入参
  args: { output: 'dist', ...args },
  // gulp-miniprogram-alias 配置
  aliasConfig,
  // ${buildId}.zip
  buildId,
  // gulp-preprocess 配置
  processContext,
  // 日志打印
  logger
  // etc ...
}
```

### 任务

**清空输出目录**

每次运行或构建项目时，清空 `output 目录`

```js title="./scripts/gulp/tasks/clean.task.js"
const del = require('del')
const { args } = require('../context')

module.exports = async () => {
  await del([`${args.output}/**`], { force: true, dot: true })
}
```

**迁移`*.js`文件**

```js title="./scripts/gulp/tasks/js.task.js"
const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src(['./src/**/*.js'])
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.preprocess({ context: processContext, type: 'js' }))
    .pipe(gulp.dest(args.output))
```

**迁移`*.json`文件**

```js title="./scripts/gulp/tasks/json.task.js"
const { args, gulp } = require('../context')

module.exports = () => gulp.src('./src/**/*.json').pipe(gulp.dest(args.output))
```

**迁移`*.scss`文件**

```js title="./scripts/gulp/tasks/scss.task.js"
const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src(['./src/**/*.scss', '!./src/_shared/styles/*.scss'])
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.dartSass.sync({ outputStyle: 'compressed' }))
    .on('error', $.dartSass.logError)
    .pipe($.preprocess({ context: processContext, type: 'css' }))
    .pipe(
      $.rename({
        extname: '.wxss'
      })
    )
    .pipe(gulp.dest(args.output))

```

**迁移`*.wxss`文件**

当用到某些第三方库时，里面的源码可能是 `wxss`，因此需要支持 `wxss` 的迁移。

```js title="./scripts/gulp/tasks/wxss.task.js"
const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src('./src/**/*.wxss')
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.preprocess({ context: processContext, type: 'css' }))
    .pipe(gulp.dest(args.output))
```

**迁移`*.wxml`文件**

```js title="./scripts/gulp/tasks/wxml.task.js"
const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src('./src/**/*.wxml')
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.preprocess({ context: processContext, type: 'html' }))
    .pipe(gulp.dest(args.output))

```

**迁移`*.wxs`文件**

```js title="./scripts/gulp/tasks/wxs.task.js"
const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src('./src/**/*.wxs')
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.preprocess({ context: processContext, type: 'js' }))
    .pipe(gulp.dest(args.output))
```

**迁移`others`**

迁移 `scss|wxss|js|wxs|json|wxml|md` 以外的文件，例如：图片。

```js title="./scripts/gulp/tasks/others.task.js"
const { args, gulp } = require('../context')

module.exports = () =>
  gulp
    .src(['./src/**/*.!(scss|wxss|js|wxs|json|wxml|md)'], {
      dot: true,
      nodir: true
    })
    .pipe(gulp.dest(args.output))
```

**制作 `project.config.json`**

你已经注意到，根目录放置的是 `_project.config.json`，而不是 `project.config.json`。

由于 `project.config.json` 是非常重要的工程配置，不仅会影响本地开发者工具，还会影响小程序的发布上传，

如果该文件被追踪提交，开发成员相互篡改、相互覆盖极易导致出现各类问题，

为了统一，通过任务以 `_project.config.json` 为**蓝图**在本地初始化一份 `project.config.json`。

```js title="./scripts/gulp/tasks/projectMake.task.task.js"
const through2 = require('through2')
const path = require('path')
const { existsSync } = require('fs')
const { processContext, gulp, $ } = require('../context')

/**
 * ./_project.config.json + 当前环境的 appid => ./project.config.json
 *
 * 每次运行项目时，都会执行 task.projectMake，
 * 如果反复覆盖 project.config.js，会导致微信开发者工具不能及时更新设置，
 * **工具甚至崩溃**
 * 此函数用于判断是否要重新覆盖 project.config.js
 * 若 现有的 project.config.js 中的 appid 和当前 .env 中 APPID 相同时，跳过任务
 * 若 现有的 project.config.js 中的 appid 和当前 .env 中 APPID 不同时，新建并覆盖
 *
 * 通过此函数，如果频繁运行同一环境，project.config.json 不会有任何变化
 *
 * @returns {boolean} true/false
 */
function projectShouldUpdate() {
  if (!existsSync(path.resolve(process.cwd(), 'project.config.json'))) {
    return true
  }

  const configs = require('../../../project.config.json')

  if (configs.appid !== processContext.APPID) {
    return true
  }

  return false
}

module.exports = cb => {
  if (projectShouldUpdate()) {
    return gulp
      .src('./_project.config.json')
      .pipe(
        through2.obj(function (chunk, _, callback) {
          const { contents } = chunk
          const data = JSON.parse(contents.toString())

          data.appid = processContext.APPID

          chunk.contents = Buffer.from(JSON.stringify(data), 'utf8')

          this.push(chunk)

          callback()
        })
      )
      .pipe($.jsonFormat(2))
      .pipe($.rename('project.config.json'))
      .pipe(gulp.dest('./'))
  } else {
    cb()
  }
}
```

**构建 `project.config.json`**

只有在运行 `npm run build:${env}` 时，才会执行该任务。

```js title="./scripts/gulp/tasks/projectBuild.task.task.js" {12, 14}
const through2 = require('through2')
const { processContext, args, gulp, $, buildId } = require('../context')

module.exports = () =>
  gulp
    .src('./_project.config.json')
    .pipe(
      through2.obj(function (chunk, enc, callback) {
        const { contents } = chunk
        const data = JSON.parse(contents.toString())

        delete data.miniprogramRoot

        data.projectname = buildId

        data.appid = processContext.APPID

        chunk.contents = Buffer.from(JSON.stringify(data), 'utf8')

        this.push(chunk)

        callback()
      })
    )
    .pipe($.jsonFormat(2))
    .pipe($.rename('project.config.json'))
    .pipe(gulp.dest(args.output))
```

在 `_project.confing.json` 中，初始化了 `miniprogramRoot` `projectname` `appid`

```json title="_project.config.json"
{
  "miniprogramRoot": "dist/",
  "projectname": "${YOUR_DEFAULT_PROJECTNAME}",
  "appid": ""
}
```

因此在执行 `npm run start:${env}` 后，我们只需要将*根目录*导入开发者工具即可开始开发。

在构建目录时，为了方便打包给测试同事以及发布线上，该任务做了三件事情：

- 移除 `miniprogramRoot`
- 将 `buildId` 设置为 `projectname`
- 将当前环境的 `APPID` 设置为 `appid`

**监听文件**

运行项目时，每当新增文件、新增目录、改变文件，会执行该任务，并执行对应的任务。

```js title="./scripts/gulp/tasks/watch.task.task.js"
const { gulp } = require('../context')

module.exports = cb => {
  const { parallel } = gulp

  gulp.watch(
    './src/**/*.scss',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:scss')
  )
  gulp.watch(
    './src/**/*.wxss',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:wxss')
  )
  gulp.watch(
    ['./src/**/*.js'],
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:js')
  )
  gulp.watch(
    './src/**/*.wxs',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:wxs')
  )
  gulp.watch(
    './src/**/*.json',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:json')
  )
  gulp.watch(
    './src/**/*.wxml',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:wxml')
  )
  gulp.watch(
    './src/**/*.!(scss|wxss|js|wxs|json|wxml|md)',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:others')
  )

  cb()
}
```

### Gulpfile.js

所有的任务脚本都已经准备好了，现在将 `task` `gulpfile` `scirpts` 结合起来，

在 `scripts` 中，设计了两组命令 `npm run start:${env}` 和 `npm run build:${env}`，

对应的，`gulp` 也需要提供两组任务来执行这两组命令：

```json title="package.json"
{
  "scripts": {
    "start:dev" : "gulp --env=dev",
    "start:sit" : "gulp --env=sit",
    "start:uat" : "gulp --env=uat",
    "start:prod": "gulp --env=prod",
    "build:dev" : "gulp build --env=dev --output=./build --ignoreLocal",
    "build:sit" : "gulp build --env=sit --output=./build --ignoreLocal",
    "build:uat" : "gulp build --env=uat --output=./build --ignoreLocal",
    "build:prod": "gulp build --env=prod --output=./build --ignoreLocal"
  }
}
```

```js title="gulpfile.js"
const requireDir = require('require-dir')
const { gulp } = require('./scripts/gulp/context')

// 获取全部任务模块
const tasks = requireDir('./scripts/gulp/tasks', {
  mapKey(_, baseName) {
    // 例: "clean.task" 转换成 "clean"
    const [taskName] = baseName.split('.')

    return taskName
  }
})

// 注册各个子任务
gulp.task('clean', tasks.clean)

gulp.task('build:scss', tasks.scss)
gulp.task('build:js', tasks.js)
gulp.task('build:json', tasks.json)
gulp.task('build:wxml', tasks.wxml)
gulp.task('build:wxss', tasks.wxss)
gulp.task('build:wxs', tasks.wxs)
gulp.task('build:others', tasks.others)

gulp.task('project:make', tasks.projectMake)
gulp.task('project:build', tasks.projectBuild)

gulp.task('watch', tasks.watch)

gulp.task('zip', tasks.zip)

// 聚合任务 gulp build
gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'project:build',
      'build:scss',
      'build:js',
      'build:json',
      'build:wxml',
      'build:wxss',
      'build:wxs',
      'build:others'
    ),
    'zip'
  )
)

// 聚合任务 gulp default
gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(
      'project:make',
      'build:scss',
      'build:js',
      'build:json',
      'build:wxml',
      'build:wxss',
      'build:wxs',
      'build:others'
    ),
    'watch'
  )
)
```
