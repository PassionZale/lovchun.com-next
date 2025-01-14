---
title: 前端灰度发布落地方案
description: 基于 Nginx Ingress Controller 使用 canary-* 注解完成前端灰度与基线的流量转发。
pubDatetime: 2022-07-22
slug: front-end-gray-release-landing-scheme
featured: true
draft: false
tags:
  - 指南
---

![nginx ingress](/images/front-end-gray-release-landing-scheme/nginx-ingress.png)

## 原理

> 基于 `Nginx Ingress Controller`
>
> 使用 `canary-*` 注解完成前端基线与灰度的流量转发：
>
> - 一部分用户继续使用老版本的服务，
> - 将一部分用户的流量切换到新版本，
> - 如果新版本运行稳定，则逐步将所有用户迁移到新版本。

![nginx.ingress.kubernetes.io/canary-by-cookie](/images/front-end-gray-release-landing-scheme/annotation.jpeg)

**`nginx.ingress.kubernetes.io/canary-by-cookie`**

- :thumbsup: `canary-* Annotation` 也是社区官方实现的灰度发布方式。
- 表示基于 Cookie 进行灰度发布。
- Cookie 名称的特殊取值：
  - always：无论什么情况下，流量均会进入灰度服务。
  - never：无论什么情况下，流量均不会进入灰度服务。
  - 只要存在该 Cookie 名称，都会进行流量转发。

## 容器化

前端需要 `dockerized`，这样才能变成服务，而后让 `ingress` 将流量打入前端的 `Service`。

![ingress](/images/front-end-gray-release-landing-scheme/ingress.svg)

### :zap: 额外小心

> 前端容器化后，每次发布新版本会变成**全量发布**，而不是以往的**增量发布**。

现在的 `SPA` 项目，打包构建后，

为了加快首屏的展示速度，都会将路由组件打包成数个 `module.chunk.js`，

由统一的主入口 `bundle.chunk.js` 来控制加载当前路由的 `chunk.js`。

**上次发版的构建产物**

```ansi
dist
 ┣ bundle.old.js
 ┣ index.html
 ┗ module.old.js
```

```html title="index.html"
<script src="bundle.old.js" />
```

**本次发版的构建产物**

```ansi
dist
 ┣ bundle.new.js
 ┣ index.html
 ┗ module.new.js
```

```html title="index.html"
<script src="bundle.new.js" />
```

由于`index.html`文件名没有发生变化，发版成功后，

客户端访问时，会使用缓存，即**上个版本缓存的 `index.html`**，此时仍然会加载 `bundle.old.js`，

路由匹配后，`bundle.old.js` 会动态添加 `<script src="module.old.js" />`。

> 这也是某些场景，前端发布后新功能没有生效的原因。

**当容器化发布后，旧的文件会被全部移除，**

**`module.old.js` 已经不存在，但又要加载它，浏览器会白屏，控制台会报错。**

![module not found](/images/front-end-gray-release-landing-scheme/module-not-found.png)

### 缓存的处理

为了避免上述 `SPA` 应用增量发布的问题，只需要做一件事情：**HTML 文件不缓存，缓存其他静态文件**

**`html` 不缓存**

![html no-cache](/images/front-end-gray-release-landing-scheme/html-file.png)

**静态资源文件 缓存 30 天**

![static cache30days](/images/front-end-gray-release-landing-scheme/static-file.png)

> HTML 文件非常小，通常只有 1~2kb，每次请求并吞吐最新的文件也不会太消耗带宽。

**`<meta />` 标签控制缓存**

```html title="index.html"
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="expires" content="0" />
```

**仅仅通过 `<meta />`标签仍然是不够的，还需要完善 `nginx.conf`：**

```nginx title="nginx.conf" showLineNumbers {12-14,17-19}
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

- `no-store` : 不要在浏览器中缓存/存储任何响应。

- `no-cache` : 每次（每个请求）都向服务器询问“我可以向用户显示我拥有的缓存内容吗？”

- `must-revalidate` : 一旦缓存过期，就不再提供旧的资源，询问服务器并重新验证。

### Dockerfile

> 选用 `*-alpine` 版本的镜像，可以极大缩小镜像体积

```shell title="Dockerfile" showLineNumbers
# build stage
FROM node:lts-alpine as build-stage

WORKDIR /usr/share/app

COPY package*.json ./

RUN npm install --registry https://registry.npmmirror.com

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /usr/share/app/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /usr/share/app/dist /usr/share/app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

> 本地调试，创建容器并运行项目

```shell
docker build -t app:latest .

# 访问 http://localhost:8080
docker run -itd -p 8080:80 app:latest
```

## 基线与灰度

### 工作流

- `master` 分支用于发布基线
- `master-gray` 分支用于发布灰度
- `master-gray` ≥ `master`
- Jenkins 创建 `prod job` 与 `prod-gray job`

### 环境切换

> 一部分用户继续使用老版本的服务(基线)，一部分用户的流量切换到新版本(灰度)

灰度要精确到用户级别，那么最好的方式便是提供一个 API 让前端调用，

**静态资源层** 通过 `cookie: env-gray=always` ，由 `ingress` 将流量转发至 `prod` 或 `prod-gray`。

```js title="示例代码"
const loadEnv = async () => {
  const COOKIE_GRAY_KEY = "env-gray";
  const COOKIE_GRAY_VALUE = "always";

  const reload = () => {
    // 设置 cookie: env-gray=always 后，重新加载页面
    // 下次请求携带 always, ingress 便会将流量转发至 prod-gray
    window.location.reload();
  };

  try {
    const { data } = await request("user/env");

    const currentEnvIsGray = getCookie(COOKIE_GRAY_KEY) === COOKIE_GRAY_VALUE;

    const env = data?.env;

    switch (env) {
      case "gray":
        if (!currentEnvIsGray) {
          setCookie(COOKIE_GRAY_KEY, COOKIE_GRAY_VALUE);
          reload();
        }
        break;

      default:
        removeCookie(COOKIE_GRAY_KEY);

        if (currentEnvIsGray) {
          reload();
        }
        break;
    }
  } catch (e) {
    removeCookie(COOKIE_GRAY_KEY);
  }
};
```

cookie 不存在灰度标识，流量转发至基线：

![基线](/images/front-end-gray-release-landing-scheme/base.png)

cookie 存在灰度标识，流量转发至灰度：

![灰度](/images/front-end-gray-release-landing-scheme/gray.png)

**API 层** 通过请求头增加灰度标识，来告知 API 按 `prod` 还是 `prod-gray` 处理。

后端打通基线与灰度，比前端复杂更多，阿波罗配置、字典表、权限等等一系列的配置或业务需要做处理，

除了在请求头中增加 API 的灰度标识，也可以结合自身项目实际场景替换。
