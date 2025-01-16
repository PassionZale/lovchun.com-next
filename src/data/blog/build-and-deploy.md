---
title: Build & Deploy
pubDatetime: 2024-06-13
modDatetime: 2024-06-27
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

## 嵌套路径

将前端部署在根路径非常简单，但是如果部署嵌套路径下，事情就会变得复杂。

拿 `Vite + React18 + ReactRouter6` 举例，假设我们有一个项目，

并期望将它们部署在嵌套路径下：`foo` 部署至 `http://domain.com/foo`。

对于 `Vite` 而言，你需要设置它的 `base: '/foo'`：

```ts title="vite.config.ts"
import type { UserConfig } from "vite";

export default (): UserConfig => {
  base: "/foo";
};
```

对于 `ReactRouter6` 而言，你还需要设置它的 `basename="/foo"`：

~~如果你使用的是 `VueRourter` 就不需要了~~

```ts title="App.tsx"
<RouterProvider
	router={createBrowserRouter(routes, { basename: "/foo" })}
/>
```

配置完毕之后，当你的项目构建完毕之后，它就会正常的从 `/foo` 路径请求资源文件，

对于 `Nginx`，我们还需要一些额外的配置：

```nginx title="nginx.conf" "/foo" "/foo/bar"
server {
  listen 80;
  server_name localhost;
  root /var/www/html;
  index index.php index.html index.htm;

  location = /foo {
		root /var/www/html/foo/dist;
		try_files $uri $uri/ /foo/index.html;
  }

	location ~ ^/foo(.*) {
		root /var/www/html/foo/dist;
		try_files $1 $1/ /index.html =404;
	}

	# 多层嵌套路径同理
	location = /foo/bar {
		root /var/www/html/foo-bar/dist;
		try_files $uri $uri/ /foo/bar/index.html;
  }

	location ~ ^/foo/bar(.*) {
		root /var/www/html/foo/dist;
		try_files $1 $1/ /index.html =404;
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

## 更新提示

“解压文件”和“容器化”这两种部署方式，就是我们常说的：**增量部署**和**全量部署**。

**增量部署** 通常不会出什么大问题，因为每次发版之后，旧的静态资源文件还在，

**全量部署** 则不然，每次发版之后，旧的静态资源文件已全部删除。

如果你的项目使用了路由懒加载，用户在发版前已经打开了应用，

发版完成后，若用户点击了未访问过的路由，往往会出现白屏，

虽然我们已经设置了 `index.html` 不缓存，

但是需要用户刷新一次应用才会重新获取新版本的静态资源文件。

> 如何在前端部署成功之后给出更新提示？

想要给出更新提示，前端就需要知道当前客户端的版本号落后于最新版本号，

**在每次路由变化时，获取最新版本号，比对新旧版本号是否一致。**

这里的版本号不是指 `major.minor.patch`，而是指 `buildId`，

我们在构建时，将 `{ version: timestamp }{:json}` 写入到 `public/version.json` 中，

通过 `define` 定义全局常量 `define: { __APP_VERSION__: timestamp }{:json}`，

如果你也使用 `vite`，我们可以简单编写一个插件来完成这一步：

```js title="/plugins/buildVersion.js"
import path from "node:path";
import fs from "node:fs";

const writeVersion = async (versionFile, content) => {
  fs.writeFile(versionFile, content, err => {
    if (err) throw err;
  });
};

export default options => {
  let configPath;
  return {
    name: "buildVersion",
    configResolved(resolvedConfig) {
      configPath = resolvedConfig.publicDir;
    },
    async buildStart() {
      const file = configPath + path.sep + "version.json";
      const content = JSON.stringify({ version: options.version });
      if (fs.existsSync(configPath)) {
        writeVersion(file, content);
      } else {
        fs.mkdir(configPath, err => {
          if (err) throw err;
          writeVersion(file, content);
        });
      }
    },
  };
};
```

```ts title="vite.config.ts" {4}
import { defineConfig } from "vite";
import buildVersionPlugin from "./plugins/buildVersion";

const appVersion = new Date().getTime();

export const ViteConfig = defineConfig({
  define: {
    __APP_VERSION__: appVersion,
  },
  plugins: [
    {
      ...buildVersionPlugin({
        version: appVersion,
      }),
      apply: "build",
    },
  ],
});
```

我们还需要更改 `nginx.conf`，设置 `*.json` 也不缓存：

```diff titile="nginx.conf"
- location ~ \.(html|htm)$ {
+ location ~ \.(html|htm|json)$ {
	add_header Cache-Control "no-store, no-cache, must-relalidate";
}
```

使用 `axios` 或者 `fetch`，在 `vue-router` 每次路由变化时，获取最新的版本号并进行比对，

由于 `*.json` 不会被缓存，所以我们总能获取到最新的文件：

```js "__APP_VERSION__ !== jons.version"
router.beforeEach(async ({ next }) => {
  const res = await fetch("/version.json");

  if (res.ok) {
    const json = await res.json();

    if (json.version && __APP_VERSION__ !== json.version) {
      Modal.confirm({
        title: "发现新版本",
        onOk: () => window.location.reload(),
      });

      return;
    }
  }

  next();
});
```

`react-router@6` 并没有 `beforeEach` 这类钩子函数，通过封装 `useNavigate` 也可以实现这种拦截效果：

```ts title="useNavigate.ts"
import { Modal } from "antd";
import axios from "axios";
import { useCallback } from "react";
import {
  NavigateOptions,
  To,
  useNavigate as _useNavigate,
} from "react-router-dom";

export function useNavigate() {
  const navigate = _useNavigate();

  return useCallback(
    async (to: To, options?: NavigateOptions) => {
      if (import.meta.env.PROD) {
        try {
          const res = await axios.get("/version.json");

          if (res.data.version && res.data.version !== __APP_VERSION__) {
            Modal.info({
              autoFocusButton: null,
              title: "版本升级提示",
              content: "检测到版本更新，请刷新页面。",
              okText: "刷新",
              onOk: () => window.location.reload(),
            });

            return;
          }
        } catch (error) {
          // emtpy
        }
      }

      navigate(to, options);
    },
    [navigate]
  );
}
```

**这样做虽然可以解决问题，但是大部分版本比对是无效的。**

**应该没有哪个项目天天发生产吧？**

那么每次路由切换所产生的 `Get /version.json{:shell}` 除了浪费带宽，没有任何实质的意义...

`vite@4` 提供了 `vite:preloadError` 用来[处理加载报错](https://cn.vitejs.dev/guide/build.html#load-error-handling)，

所以我们只需要监听这个错误，而后封装一个容器组件即可，`vue` 同理：

```tsx title="PreloadErrorWrapper.tsx"
import { Modal, Result, Button } from "antd";
import { memo, useCallback, useEffect, useState } from "react";

const PreloadErrorWrapper = memo((props: React.PropsWithChildren) => {
  const [existError, setExistError] = useState(false);

  const listener = useCallback<EventListener>(event => {
    event.preventDefault();

    console.warn(event);

    setExistError(true);

    Modal.confirm({
      autoFocusButton: null,
      title: "版本升级",
      content: "检测到版本更新，请刷新页面！",
      okText: "刷新",
      onOk: () => window.location.reload(),
    });
  }, []);

  useEffect(() => {
    window.addEventListener("vite:preloadError", listener);

    return () => window.removeEventListener("vite:preloadError", listener);
  }, [listener]);

  return (
    <>
      {existError ? (
        <Result
          title="版本升级"
          subTitle="检测到版本更新，请刷新页面！"
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              刷新
            </Button>
          }
        />
      ) : (
        props.children
      )}
    </>
  );
});

export default PreloadErrorWrapper;
```
