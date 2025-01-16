---
title: 构建小程序 - CI
description: 结合 miniprogram-ci 进行自动化上传和预览。
pubDatetime: 2023-07-17
slug: setup-miniprogram/part-5
column: setup-miniprogram
featured: false
draft: false
tags:
  - 指南
  - 微信小程序
---

## 目录

- [**《构建小程序 - 插件、目录、开发者工具、配置》**](/posts/setup-miniprogram/part-1)
- [**《构建小程序 - 异常、通讯、技巧》**](/posts/setup-miniprogram/part-2)
- [**《构建小程序 - 框架、Gulpjs、Task》**](/posts/setup-miniprogram/part-3)
- [**《构建小程序 - Generator》**](/posts/setup-miniprogram/part-4)
- [**《构建小程序 - CI》**](/posts/setup-miniprogram/part-5)

## 开发辅助

为了让开发者能够通过 `Node` 来控制小程序的上传、预览等功能，微信官方提供了两种开发辅助：`开发者工具(命令行/HTTP)` 和 `miniprogram-ci`

| 模块         | 命令行 | HTTP | miniprogram-ci |
| :----------- | :----- | :--- | :------------- |
| 登录工具     | 支持   | 支持 | 不支持         |
| 是否登录工具 | 支持   | 支持 | 不支持         |
| 预览         | 支持   | 支持 | 支持           |
| 上传代码     | 支持   | 支持 | 支持           |
| 自动预览     | 支持   | 支持 | 不支持         |
| 构建 npm     | 支持   | 支持 | 支持           |
| 清除缓存     | 支持   | 支持 | 不支持         |
| 启动工具     | 支持   | 支持 | 不支持         |
| 打开其他项目 | 支持   | 支持 | 不支持         |
| 关闭项目窗口 | 支持   | 支持 | 不支持         |
| 关闭工具     | 支持   | 支持 | 不支持         |

`开发者工具(命令行/HTTP)` 功能丰富，支持面广，~~**什么都好，就是一点都不好用！**~~

- 需要先开启 `HTTP` 服务端口；
- 关闭项目、打开其他项目等功能，在 `Windows` `MacOS` `MacOS ARM64` 表现不一致；
- 通过脚本改写 `project.config.json` 属性后，需要清除缓存，再调用预览等功能；
- `Windows` 下拼接 `cli` `端口号` 不同客户端可能安装路径不统一；

如果你想封装一个 `package` 提供给他人使用，不通平台的兼容性、安装路径等的初始化就能直接劝退大部分使用者，尤其是略懂前端的测试同事、完全不懂开发的产品和运营同事，会额外增加学习成本。

## 构建 NPM

> 小程序引入 `npm packages` 时，千万小心你的主包大小！
>
> - 构建 npm 后的 package 都会被计算在主包内
> - 构建 npm 时只会构建 `dependencies` 中的 `package`
> - 使用 `npm i dayjs --save --only=production` 来减少体积

![build-npm](/images/setup-miniprogram/build-npm.png)

```json title="package.json"
{
  "dependencies": {
    "dayjs": "^1.9.7"
  }
}
```

结合 `packageJsonPath` `miniprogramNpmDistDir` 来自定义 `miniprogram_npm` 输出目录

```json title="project.config.json" {5,6}
{
  "setting": {
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./src/"
      }
    ]
  }
}
```

```diff title=".gitignore"
  node_modules

+ src/miniprogram_npm
```

目录结构示例如下：

```ansi /miniprogram_npm/ /dayjs/
src
 ┣ home
 ┣ miniprogram_npm
 ┃ ┗ dayjs
 ┣ other subPackage
 ┣ subPackage1
 ┣ _shared
 ┣ app.js
 ┣ app.json
 ┗ app.scss
```

## MINIPROGRAM-CI

> 前置条件
>
> - 下载上传秘钥
> - 添加 (公网)IP 白名单

![ci-manage](/images/setup-miniprogram/ci-manager.png)

### 构建思路

- 通过脚本参数获取 `env`；
- 下载代码仓库至本地的 `workspace`；
- 切换至 `env-branch`；
- 安装依赖；
- 构建项目；
- 调用 `miniprogram-ci preview` 或 `miniprogram-ci upload`；

```ansi
ci
 ┣ keys
 ┃ ┣ private.${APPID_DEV}.key
 ┃ ┣ private.${APPID_PROD}.key
 ┃ ┣ private.${APPID_SIT}.key
 ┃ ┗ private.${APPID_UAT}.key
 ┣ build.js
 ┣ constants.js
 ┣ context.js
 ┣ miniprogramCI.js
 ┣ preview.js
 ┣ upload.js
 ┗ utils.js
```

### 注入 `env`

通过不同的 `command` 注入四套环境的 `env`

```diff title="package.json"
{
  "scripts": {
    "start:dev" : "gulp --env=dev",
    "start:sit" : "gulp --env=sit",
    "start:uat" : "gulp --env=uat",
    "start:prod": "gulp --env=prod",

-   "build:dev" : "gulp build --env=dev --output=./build --ignoreLocal",
+   "build:dev": "node ./scripts/ci/build --env=dev",

-   "build:sit" : "gulp build --env=sit --output=./build --ignoreLocal",
+   "build:sit": "node ./scripts/ci/build --env=sit",

-   "build:uat" : "gulp build --env=uat --output=./build --ignoreLocal",
+   "build:uat": "node ./scripts/ci/build --env=uat",

-   "build:prod": "gulp build --env=prod --output=./build --ignoreLocal"
+   "build:prod": "node ./scripts/ci/build --env=prod",

+   "preview:dev": "node ./scripts/ci/preview --env=dev",
+   "preview:sit": "node ./scripts/ci/preview --env=sit",
+   "preview:uat": "node ./scripts/ci/preview --env=uat",
+   "preview:prod": "node ./scripts/ci/preview --env=prod",

+   "upload:dev": "node ./scripts/ci/upload --env=dev",
+   "upload:sit": "node ./scripts/ci/upload --env=sit",
+   "upload:uat": "node ./scripts/ci/upload --env=uat",
+   "upload:prod": "node ./scripts/ci/upload --env=prod"
  }
}
```

### 初始化 `workspace`

在脚本中，设计了三种 `scripts`，它们的前置条件，都需要将 `workspace` 准备好:

```shell title="前置条件"
下载仓库 => 切换 env-branch => 安装依赖 => 构建项目
```

1. `build:env` => `build.js` => 迁移 `zip` 构建产物
2. `preview:env` => `preview.js` => 调用 `miniprogramCI.preview`
3. `upload:env` => `upload.js` => 调用 `miniprogramCI.upload`

将 **前置条件** 其提取，单独封装成 `context.js` 模块，共享给三种脚本:

```js title="constants.js" {2}
// 克隆 git 仓库至本地时，指定 REPO_DOWNLOAD_FOLDER 作为存储目录
const REPO_DOWNLOAD_FOLDER = ".mp-repos";

const ENV_BRANCH_MAPS = {
  // 环境名 : git branch-name
  dev: "dev",
  sit: "test",
  uat: "pre-release",
  prod: "master",
};

module.exports = {
  REPO_DOWNLOAD_FOLDER,
  ENV_BRANCH_MAPS,
};
```

```js title="utils.js"
// 根据仓库地址解析仓库名称
// http://gitlab.example.com/mp-example-repo.git
// =>
// mp-example-repo
function getRepoName(repo) {
  const arr = repo.split("/");

  return arr[arr.length - 1].replace(".git", "");
}
```

```shell title=".npmrc"
# 可以通过各种方式获取到仓库地址
# 1. 直接在 process.cwd() 路径下调用 git remote -v
# 2. 读取 package.json 中的 repository.url
# 3. 或者像我这样，在 .npmrc 里面硬编码
repo=http://gitlab.example.com/mp-example-repo.git
```

```js title="context.js"
const path = require("path");
const { homedir } = require("os");
const yargs = require("yargs/yargs");
const args = yargs(yargs.hideBin(process.argv)).argv;

const { REPO_DOWNLOAD_FOLDER, ENV_BRANCH_MAPS } = require("./constants");
const { getRepoName } = require("./utils");

// 解构出脚本接收到的环境参数 --env=sit => sit
const { env } = args;

// 根据映射关系，获取 sit 对应的分支 test
const branch = ENV_BRANCH_MAPS[env];

// 读取 .npmrc 中的 repo 值，仓库地址 => http://gitlab.example.com/mp-example-repo.git
const repo = process.env.npm_config_repo;

// 获取到仓库名称 http://gitlab.example.com/mp-example-repo.git => mp-example-repo
// mp-example-repo 是拼接最终 workspace 目录中的一环
const repoName = getRepoName(repo);

// 拼接目录结构 => ~/.mp-repos/mp-example-repo/test/
// dev  =>  ~/.mp-repos/mp-example-repo/dev/
// sit  =>  ~/.mp-repos/mp-example-repo/test/
// uat  =>  ~/.mp-repos/mp-example-repo/pre-release/
// prod =>  ~/.mp-repos/mp-example-repo/master/
const repoPath = path.join(homedir(), REPO_DOWNLOAD_FOLDER, repoName, branch);

// 约定输出目录 ./build，它将作为 miniprogram-ci 所读取的工作目录
// ~/.mp-repos/mp-example-repo/test/build
const workspace = path.join(repoPath, `./build`);

// 克隆代码并切换环境分支
const cloneCommand = `git clone ${repo} ${repoPath} && cd ${repoPath} && git checkout ${branch}`;

// 安装依赖，为了让安装更快，使用 npm install --only=production
const installCommand = `cd ${repoPath} && npm install --only=production`;

// 构建命令，--output 与 workspace 相互对应
// 当然，这里也可以通过额外的 args 参数注入变成动态的
const buildCommand = `cd ${repoPath} && gulp build --env=${env} --output=./build --ignoreLocal`;

module.exports = {
  env,
  branch,
  repo,
  repoName,
  repoPath,
  workspace,
  cloneCommand,
  installCommand,
  buildCommand,
};
```

### 构建步骤

新增一个 `runExec()` 用于异步的执行 `command` 并在终端输出日志

```js title="utils.js"
const runExec = (command, options) =>
  new Promise((resolve, reject) => {
    try {
      const result = execSync(command, {
        stdio: "inherit",
        cwd: process.cwd(),
        ...options,
      });

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
```

规划出每次脚本运行所执行的步骤

1. 清空 `workspace` 确保目录干净、代码依赖都是最新的;
2. 执行 `cloneCommand`;
3. 执行 `installCommand`;
4. 执行 `buildCommand`;
5. 执行 `zip` `preview` `upload`;

```js title="步骤[1,2,3,4]" {20,27,34,43,48}
const clc = require("cli-color");
const fse = require("fs-extra");
const path = require("path");
const context = require("./context");
const { runExec, getBuildName } = require("./utils");

const { env, repoName, repoPath, cloneCommand, installCommand, buildCommand } =
  context;

run();

async function run() {
  try {
    // 1. 清空 `workspace`
    console.log(
      `[${clc.green("→")}] [${clc.blue(
        clc.bold(repoName)
      )}] 清理工作空间: ${repoPath}`
    );
    await fse.emptyDir(repoPath);

    // 2. 执行 `cloneCommand`
    console.log(
      `[${clc.green("→")}] [${clc.blue(clc.bold(repoName))}] 开始克隆仓库...`
    );
    console.log();
    await runExec(cloneCommand);

    // 3. 执行 `installCommand`
    console.log(
      `[${clc.green("→")}] [${clc.blue(clc.bold(repoName))}] 开始安装依赖...`
    );
    console.log();
    await runExec(installCommand);

    // 4. 执行 `buildCommand`
    console.log(
      `[${clc.green("→")}] [${clc.blue(
        clc.bold(repoName)
      )}] 开始构建应用: ${env}`
    );
    console.log();
    await runExec(buildCommand);
    console.log(
      `[${clc.green("✓")}] [${clc.blue(clc.bold(repoName))}] 构建成功`
    );

    // 5. 执行 `zip` `preview` `upload`;
  } catch (error) {
    console.log(
      `[${clc.red("✗")}] [${clc.blue(clc.bold(repoName))}] ${clc.red(
        clc.bold("请检查网络设置或者应用配置")
      )}`
    );

    console.log(error.toString().trim().split(/\r?\n/));
  }
}
```

```diff title="build.js"

   run() {
      // 5. 执行 `zip`;

+    // 拷贝输出文件至 process.cwd()
+    const fileName = getBuildName(repoPath)

+    console.log(
+      `[${clc.green('→')}] [${clc.blue(
+        clc.bold(repoName)
+      )}] 开始拷贝文件: ${fileName}`
+    )

+    await fse.copy(
+      path.join(repoPath, fileName),
+      path.join(process.cwd(), fileName)
+    )

+    // 移除工作目录
+    await fse.emptyDir(repoPath)
+    console.log(
+      `[${clc.green('✓')}] [${clc.blue(clc.bold(repoName))}] 拷贝完成`
+    )
   }
```

```diff title="preview.js"
+  const CI = require('./miniprogramCI')

   run() {
    // 5. 执行 `preview`;

+    new CI(workspace).preview({ qrcodeFormat: 'terminal' })
   }
```

```diff title="upload.js"
+  const CI = require('./miniprogramCI')

   run() {
    // 5. 执行 `preview`;

+    new CI(workspace).upload()
   }
```

### miniprogramCI

在 `cloneCommand` `installCommand` `buildCommand` 结束后，便可得到 `workspace`

```shell
# 开发环境
~/.mp-repos/mp-example-repo/dev/build/**/*
# 测试环境
~/.mp-repos/mp-example-repo/test/build/**/*
# 预发布环境
~/.mp-repos/mp-example-repo/pre-release/build/**/*
# 生产环境
~/.mp-repos/mp-example-repo/master/build/**/*
```

```ansi
~
 ┗ .mp-repos
 ┃ ┗ .mp-example-repo
 ┃ ┃ ┣ dev
 ┃ ┃ ┣ master
 ┃ ┃ ┣ pre-release
 ┃ ┃ ┗ test
```

```js title="miniprogramCI.js"
const fse = require('fs-extra')
const path = require('path')
const clc = require('cli-color')
const { preview, Project, upload } = require('miniprogram-ci')
const Table = require('cli-table3')
const { getPackageName, getFormatFileSize } = require('./utils')
const logger = require('../lib/logger')

class MiniProgramCI {
  constructor(workspace) {
    this.workspace = workspace

    // 加载配置而后初始化项目对象
    // https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#项目对象
    if (this.loadProjectConfig(workspace)) {
      this.project = new Project({
        appid: this.appid,
        type: this.compileType,
        projectPath: this.workspace,
        privateKeyPath: this.privateKeyPath
      })
    }
  }

  // 1. 加载 project.config.json 并初始化 appid compileType
  // 2. 加载 package.json 并初始化 version
  // 3. 获取 上传秘钥 路径
  loadProjectConfig(workspace) {
    const projectConfigPath = path.join(workspace, 'project.config.json')
    const packagePath = path.join(workspace, '../package.json')

    if (
      fse.pathExistsSync(projectConfigPath) &&
      fse.pathExistsSync(packagePath)
    ) {
      try {
        const {
          setting,
          appid,
          compileType,
          projectname
        } = fse.readJSONSync(projectConfigPath)
        const { version } = fse.readJSONSync(packagePath)

        this.appid = appid
        this.setting = setting
        this.compileType = compileType
        this.desc = decodeURIComponent(projectname)
        this.version = version

        const privateKeyPath = path.join(
          workspace,
          `../scripts/ci/keys/private.${appid}.key`
        )

        if (fse.pathExistsSync(privateKeyPath)) {
          this.privateKeyPath = privateKeyPath

          return true
        } else {
          console.log(
            `[${clc.red('✗')}] ${clc.red(clc.bold('上传秘钥不存在'))}`
          )

          return false
        }
      } catch (error) {
        console.log(`[${clc.red('✗')}] ${clc.red(clc.bold('读取文件失败'))}`)

        return false
      }
    } else {
      console.log(`[${clc.red('✗')}] ${clc.red(clc.bold('工程文件不存在'))}`)

      return false
    }
  }

  // 优化打印输出
  // https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#返回
  printResult(result) {
    const { subPackageInfo = [], pluginInfo = [], devPluginId = '无' } = result

    const table = new Table({
      head: ['时间', '版本号', '项目备注']
    })

    table.push([new Date().toLocaleString(), this.version, this.desc])

    console.log(table.toString())

    console.log('包信息')

    const packageTable = new Table({
      head: ['类型', '大小']
    })

    subPackageInfo.forEach(packageInfo => {
      const formatSize = getFormatFileSize(packageInfo.size)

      packageTable.push([
        getPackageName(packageInfo.name),
        formatSize.size + formatSize.measure
      ])
    })

    console.log(packageTable.toString())

    if (pluginInfo && pluginInfo.length) {
      console.log('插件信息')

      const pluginTable = new Table({
        head: ['appid', '版本', '大小', 'devPluginId']
      })

      pluginInfo.forEach(pluginInfo => {
        const formatSize = getFormatFileSize(pluginInfo.size)

        pluginTable.push([
          pluginInfo.pluginProviderAppid,
          pluginInfo.version,
          formatSize.size + formatSize.measure,
          devPluginId
        ])
      })

      console.log(pluginTable.toString())
    }
  }

  relsoveQrPath(qrcodeFormat, qrcodeOutputDest) {
    if (qrcodeFormat === 'base64' || qrcodeFormat === 'image') {
      return path.join(this.workspace, qrcodeOutputDest || 'preview.png')
    }

    return ''
  }

  // ci 机器人编号
  get robot() {
    return Math.floor(Math.random() * 31)
  }

  // miniprogram-ci upload
  // https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#上传
  async upload() {
    if (this.project) {
      try {
        console.log(`[${clc.green('→')}] 开始上传...`)

        const uploadResult = await upload({
          project: this.project,
          version: this.version,
          desc: this.desc,
          setting: this.setting,
          onProgressUpdate() {},
          robot: this.robot
        })

        console.log(`[${clc.green('✓')}] 上传成功`)

        this.printResult(uploadResult)
      } catch (error) {
        logger.fatal(error)
      }
    }
  }

  // miniprogram-ci preview
  // https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#预览
  async preview(opts = {}) {
    const { qrcodeFormat = 'image', qrcodeDest } = opts

    if (this.project) {
      try {
        console.log(`[${clc.green('→')}] 开始预览...`)

        const previewResult = await preview({
          project: this.project,
          version: this.version,
          desc: this.desc,
          setting: this.setting,
          qrcodeFormat,
          qrcodeOutputDest: this.relsoveQrPath(qrcodeFormat, qrcodeDest),
          onProgressUpdate() {},
          robot: this.robot
        })

        console.log(`[${clc.green('✓')}] 预览成功`)

        this.printResult(previewResult)
      } catch (error) {
        logger.fatal(error)
      }
    }
  }
}

module.exports = MiniProgramCI
```

### ci-build

<video width="100%" aspect-radio="16/9" controls>
  <source src="/videos/setup-miniprogram/ci-build.webm" type="video/webm"></source>
</video>

### ci-preview

<video width="100%" aspect-radio="16/9" controls>
  <source src="/videos/setup-miniprogram/ci-preview.webm" type="video/webm"></source>
</video>

### ci-upload

<video width="100%" aspect-radio="16/9" controls>
  <source src="/videos/setup-miniprogram/ci-upload.webm" type="video/webm"></source>
</video>
