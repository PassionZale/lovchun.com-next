---
title: Build & Deploy
pubDatetime: 2024-06-13T04:06:31Z
slug: build-and-deploy
featured: false
draft: false
tags:
  - 指南
  - 工具
description: "还记得你第一次发布生产的场景吗？"
---

还记得你第一次发布生产的场景吗？

我已经完全忘记了... 印象中需要我紧盯发版的时候，我已是 **24h On Call** 的状态 😵‍💫

最开始做 Web 应用的时候，我还在 `.jsp` 里摸爬滚打，前端代码也在 `Java` 工程中，

发版就是部署 `jar` 包。~~偶尔后端的老哥还能帮我处理几个 Bug~~

后面又使用了一段时间的 `PHP`，弱类型语言不用编译，当年最简陋的发版：

`SSH` 登录服务器，`git pull{:shell}` 拉代码，发版结束...

SPA 应用的出世，前后端分离架构的流行，我才开始正式的接触 Build & Deploy 的流程。

## 归档构建产物

在最初没有标准化的 CI/CD 时候，

将前端的构建产物，例如 `/dist` 目录上传服务器是最常见的部署流程。

不论是公司分配的虚拟机，还是自己购买的 ECS，

大部分情况 **Deploy** 服务器内存都很小，无法在上面进行 **Build**。

**本地打包、归档构建产物、上传归档文件、解压部署**

这种构建部署流程，在公司资源少，项目小的场景中很是常见。

针对本地打包和归档构建，思路都是类似的：**归档指定目录至根目录**。

如果你使用 `vite`，可以自定义一个**归档插件**，在构建完成后执行归档脚本：

> 脚本会将 `dist/` 目录归档成 `${env}_${pkgName}_${YYYY-MM-DD}.zip`

```js title="plugins/archive.js"
import compressing from "compressing";
import path from "path";

const name = process.env.npm_package_name;

function compress(entry, output) {
  return compressing.zip.compressDir(entry, output, { ignoreBase: true });
}

function buildAt() {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${year}_${month}_${day}`;
}

export default function archive() {
  let config;

  return {
    name: "archive",

    apply: "build",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async closeBundle() {
      const { mode = "unknown" } = config || {};

      const output = `${mode}_${name}_${buildAt()}`;

      console.log("compressing...");
      try {
        await compress(
          path.resolve(process.cwd(), "dist"),
          path.resolve(process.cwd(), `${output}.zip`)
        );

        console.log(`${output}.zip created`);
      } catch (error) {
        console.error(error);
      }
    },
  };
}
```

```json title="package.json"
{
  "name": "vite-archive",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build:dev": "vite build --mode dev",
    "build:sit": "vite build --mode sit",
    "build:uat": "vite build --mode uat",
    "build:prod": "vite build --mode prod",
    "serve": "vite preview"
  },
  "devDependencies": {
    "compressing": "^1.5.1"
  }
}
```

```js title="vite.config.js"
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import archive from "./plugins/archive";

export default () => {
  return defineConfig({
    plugins: [
      vue(),
      archive(), // <-- use archive at here!
    ],
  });
};
```

归档文件创建成功后，剩下的就是将 `*.zip` 上传至服务器，

我们可以编写一个脚本来完成这一步：

```js title="deploy.js"
const fs = require("fs");
const path = require("path");
const cmd = require("node-cmd");
const Client = require("ssh2-sftp-client");
const sftp = new Client();

// 上一步所产生的归档文件名
const archiveFileName = "archive.zip";

// dotenv 注入环境变量
const result = require("dotenv").config({
  path: path.resolve(process.cwd(), ".env"),
});

if (result.error) throw result.error;

console.log("upload archive starting...");

// 上传归档文件
sftp
  .connect({
    host: process.env.DOTENV_HOST,
    port: process.env.DOTENV_PORT,
    username: process.env.DOTENV_USERNAME,
    password: process.env.DOTENV_PASSWORD,
  })
  .then(() => {
    const data = fs.createReadStream(
      path.resolve(process.cwd(), archiveFileName)
    );

    return sftp.put(data, process.env.DOTENV_REMOTE_PATH + archiveFileName);
  })
  .then(() => {
    console.log("upload archive success");

    return sftp.end();
  })
  .catch(error => {
    throw error;
  });
```

```shell title=".env"
DOTENV_HOST=localhost
DOTENV_USERNAME=username
DOTENV_PASSWORD=password
DOTENV_PORT=port
DOTENV_REMOTE_PATH=remote_path
DOTENV_IMAGE_NAME=image_name
```

上传完成后，便可登录服务器，将归档文件解压到对应的目录进行部署：

```shell
unzip 归档文件.zip -d 目标目录
```

## 发布构建产物

上述 **本地打包、归档构建产物、上传归档文件、解压部署**，其实还挺麻烦的，

打包发布折腾的如此别扭的根因，无非就是服务器无法打包，只能本地打包。

既然如此，那我们本地打包后，将 `/dist` 通过 `git push{:shell}` 提交上去，

然后登录服务器后执行 `git pull{:shell}` 拉代码就可以完成部署呢？

**当然不可以！**

一个比较好的方式，是将产物强制推送到新分支，例如 github 的 `gh-pages`：

```shell title="deploy.sh"
#!/usr/bin/env sh
set -e

# 你的打包命令
npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

# 例如：git push -f https://github.com/PassionZale/lovchun.com-next.git main:gh-pages
git push -f 项目地址.git 当前分支:gh-pages

cd -
```

这样构建产物单独一个分支，和源码完全隔离开，部署只需要每次拉取 `gh-pages` 分支的最新代码即可。

## Docker

随着微服务、容器化的盛行，前端的部署也蹭上了“容器化”的列车。

前端容器化最简单的 `Dockerfile` 配置大概如下，使用 `node` 进行打包，使用 `nginx` 进行部署。

```docker title="Dockerfile"
FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm run build

FROM nginx:alpine

COPY ./dist /usr/share/app

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

为了保证每次发版客户端都能立即生效，避免因浏览器缓存而引起的各种问题，

对 `nginx.conf` 增加些特殊配置：

- `html` 不缓存；
- 其他静态资源文件，缓存30天；

```nginx title="nginx.conf"
server {
  listen 80;
  server_name localhost;
  root /usr/share/app;
  index index.php index.html index.htm;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # 静态资源文件 缓存30天；
  location ~ \.(css|js|gif|jpg|jpeg|png|bmp|swf|ttf|woff|otf|ttc|pfa)$ {
    expires 30d;
  }

  # `html` 不缓存
  location ~ \.(html|htm)$ {
    add_header Cache-Control "no-store, no-cache, must-relalidate";
  }
}
```