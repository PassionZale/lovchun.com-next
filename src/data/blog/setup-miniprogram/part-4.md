---
title: 构建小程序 - Generator
description: 使用 gulp 增强你的工作流，制作一套页面和组件的生成器。
pubDatetime: 2023-07-10
slug: setup-miniprogram/part-4
column: setup-miniprogram
featured: false
draft: false
tags:
  - 指南
  - 微信小程序
---

![gulp-enhance-your-work-flow](/images/setup-miniprogram/gulp-enhance-your-work-flow.png)

## 目录

- [**《构建小程序 - 插件、目录、开发者工具、配置》**](/posts/setup-miniprogram/part-1)
- [**《构建小程序 - 异常、通讯、技巧》**](/posts/setup-miniprogram/part-2)
- [**《构建小程序 - 框架、Gulpjs、Task》**](/posts/setup-miniprogram/part-3)
- [**《构建小程序 - Generator》**](/posts/setup-miniprogram/part-4)
- [**《构建小程序 - CI》**](/posts/setup-miniprogram/part-5)

## 原理

整个流程非常的简单，通过加载 `component folder` 或 `page folder`，

动态的**迁移**对应 `template file` 到指定的目录中。

```shell
script => args => load folder => output folder
```

在创建 `page` 时，由于小程序 `app.json` 的特殊性质，我们需要区分`主包` 与 `分包`，

并且在迁移时，还要自动的更新 `app.json`，将新增的`主包` `分包` `页面` 等维护在配置文件中。

> 可以依据项目实际情况，将一切你认为需要初始化的东西全部写在模板装

```ansi
generator
 ┗ tmp
 ┃ ┣ component
 ┃ ┃ ┣ tpl.js
 ┃ ┃ ┣ tpl.json
 ┃ ┃ ┣ tpl.scss
 ┃ ┃ ┗ tpl.wxml
 ┃ ┣ page
 ┃ ┃ ┣ tpl.js
 ┃ ┃ ┣ tpl.json
 ┃ ┃ ┣ tpl.scss
 ┃ ┃ ┗ tpl.wxml
 ┃ ┗ index.js
```

## Component

<video width="100%" aspect-radio="16/9" controls>
  <source src="/videos/setup-miniprogram/make-component.webm" type="video/webm"></source>
</video>

```js title="component/tmp.js"
/**
 * // @echo FILENAME
 *
 * @desc      Component
 * @author    // @echo AUTHOR
 * @date      // @echo DATE
 */

Component({
  behaviors: [],

  options: {
    multipleSlots: true
  },

  externalClasses: [],

  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {}
})
```

```json title="component/tmp.json"
{
  "component": true
}
```

```md title="component/tmp.markdown"
# 组件文档

## classes

| 名称 | 说明 |
| --- | --- |
| N/A | N/A |

## props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| N/A | N/A | N/A | N/A |

## events

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| N/A | N/A | N/A |

## slots

| 名称 | 说明 |
| --- | --- |
| N/A | N/A |

## 示例

### 基本用法

N/A
```

```scss title="component/tmp.scss"
@import '@/_shared/styles/themes.scss';

.container {
  position: relative;
}
```

```html title="component/tmp.wxml"
<view class="container">
  <!-- @echo FILENAME -->
</view>
```

## Page

<video width="100%" aspect-radio="16/9" controls>
  <source src="/videos/setup-miniprogram/make-page.webm" type="video/webm"></source>
</video>

```js title="page/tmp.js"
/**
 * // @echo FILENAME
 *
 * @desc      Page
 * @author    // @echo AUTHOR
 * @date      // @echo DATE
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {}
})
```

```json title="page/tmp.json"
{
  "navigationBarTitleText": "wechat",
  "backgroundColor": "#f6f6f6",
  "navigationBarTextStyle": "black",
  "navigationStyle": "custom",
  "enablePullDownRefresh": false,
  "usingComponents": {}
}
```

```scss title="page/tmp.scss"
@import '@/_shared/styles/themes.scss';

.container {
  position: relative;
}
```

```html title="page/tmp.wxml"
<navbar title="<!-- @echo FILENAME -->" />

<view class="container">
  <!-- @echo FILENAME -->
</view>
```

## SCRIPTS

```js title="index.js"
const { execSync } = require('child_process')
const path = require('path')
const through2 = require('through2')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')({ DEBUG: false, lazy: true })
const yargs = require('yargs/yargs')

const { dateFormatter, migration } = require('../lib/helper')
const logger = require('../lib/logger')

const args = yargs(yargs.hideBin(process.argv)).argv

const exec = command => {
  try {
    const result = execSync(command, { stdio: 'pipe' })

    return result.toString().replace(/(\r\n|\n|\r)/gm, '')
  } catch (error) {
    return null
  }
}

const userName = exec('git config user.name')
const userEmail = exec('git config user.email')

// 作者
const author = userName
  ? userEmail
    ? `${userName}<${userEmail}>`
    : userName
  : 'mp-generator'

// 组件名
const component = args.component || args.c

// 页面名
const page = args.page || args.p

// 分包名，例："home" "customer/order" 等
// 若不指定
// 组件则会创建至 "./src/_shared/components/" 中
// 页面则会创建至 "./src/home/pages/" 中
const _system = args.system || args.s
// 排除 "home" 目录，"home" 为主包
const system = _system === 'home' && page ? undefined : _system

// 模式，用于日志字符串拼接
const mode = page ? 'page' : 'component'

// 上下文变量
const processContext = {
  FILENAME: component || page,
  AUTHOR: author,
  DATE: dateFormatter(new Date(), 'yyyy-MM-dd')
}

// 文件名称
let fileName
// 输出目录
let output

if (mode === 'component') {
  const targetFolder = system
    ? `./src/${system}/components`
    : `./src/_shared/components`

  fileName = component
  output = path.resolve(process.cwd(), targetFolder, fileName)
}

if (mode === 'page') {
  const targetFolder = system ? `./src/${system}/pages` : `./src/home/pages`

  fileName = page

  output = path.resolve(process.cwd(), targetFolder, fileName)
}

validate()

run()

// 参数校验
function validate() {
  if (!component && !page) {
    logger.fatal(new Error('必须指定页面或组件名称'))
  }

  if (component && page) {
    logger.fatal(new Error('不能同时创建页面和组件'))
  }

  if (!output) {
    logger.fatal(new Error('无法解析出 output'))
  }
}

async function run() {
  try {
    await migrateJs()
    await migrateScss()
    await migrateOthers()
    await generateAppJson()

    logger.success(
      `${mode} has created @ ${path.resolve(process.cwd(), output)}`
    )
  } catch (error) {
    logger.fatal(error)
  }
}

// 迁移 js
function migrateJs() {
  return new Promise((resolve, reject) => {
    const stream = gulp
      .src(path.resolve(__dirname, `tpl/${mode}/tpl.js`))
      .pipe($.preprocess({ context: processContext, type: 'js' }))
      .pipe($.rename({ basename: fileName, extname: '.js' }))
      .pipe(migration())
      .pipe(gulp.dest(output))

    stream.on('end', () => resolve())

    stream.on('error', err => reject(err))
  })
}

// 迁移 scss
function migrateScss() {
  return new Promise((resolve, reject) => {
    const stream = gulp
      .src(path.resolve(__dirname, `tpl/${mode}/tpl.scss`))
      .pipe($.preprocess({ context: processContext, type: 'css' }))
      .pipe($.rename({ basename: fileName, extname: '.scss' }))
      .pipe(migration())
      .pipe(gulp.dest(output))

    stream.on('end', () => resolve())

    stream.on('error', err => reject(err))
  })
}

// 迁移 wxml json
function migrateOthers() {
  return new Promise((resolve, reject) => {
    const stream = gulp
      .src(path.resolve(__dirname, `tpl/${mode}/tpl.!(js|scss)`))
      .pipe($.preprocess({ context: processContext, type: 'html' }))
      .pipe(
        $.rename(p => {
          p.basename = fileName
        })
      )
      .pipe(migration())
      .pipe(gulp.dest(output))

    stream.on('end', () => resolve())

    stream.on('error', err => reject(err))
  })
}

// 更新 page route
function generateAppJson() {
  return new Promise((resolve, reject) => {
    if (mode !== 'page') return resolve()

    const stream = gulp
      .src(path.resolve(process.cwd(), './src/app.json'))
      .pipe(
        through2.obj(function (chunk, enc, callback) {
          const { contents } = chunk
          const data = JSON.parse(contents.toString())

          // 主包，则直接添加路由
          // 分包，则添加至分包的路由中
          if (!system) {
            const { pages = [] } = data

            const route = `home/pages/${fileName}/${fileName}`

            const found = pages.find(item => item === route)

            if (found === undefined) {
              pages.push(route)
            }
          } else {
            const { subPackages } = data

            const route = `pages/${fileName}/${fileName}`

            if (!subPackages || subPackages.length === 0) {
              data.subPackages = []
              data.subPackages.push({
                root: system,
                pages: [route]
              })
            } else {
              const index = subPackages.findIndex(item => item.root === system)

              if (index > -1) {
                const isExist = subPackages[index].pages.findIndex(
                  item => item === route
                )

                if (isExist === -1) subPackages[index].pages.push(route)
              } else {
                subPackages.push({
                  root: system,
                  pages: [route]
                })
              }
            }
          }

          chunk.contents = Buffer.from(JSON.stringify(data), 'utf8')

          this.push(chunk)

          callback()
        })
      )
      .pipe($.jsonFormat(2))
      .pipe(migration('generate'))
      .pipe(gulp.dest(path.resolve(process.cwd(), './src/')))

    stream.on('end', () => resolve())

    stream.on('error', err => reject(err))
  })
}
```
