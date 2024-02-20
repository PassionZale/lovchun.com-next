---
title: Whistle
pubDatetime: 2024-02-20T04:06:31Z
slug: whistle
featured: false
draft: false
tags:
  - 工具
description: Whistle + SwitchyOmega 抓包 & 调试。
---

[Whistle](https://github.com/avwo/whistle) 是一款基于 `Node` 实现的跨平台抓包调试工具，类似于 [Fiddler](https://www.telerik.com/fiddler)，

如果你已经熟练使用 [Fiddler](https://www.telerik.com/fiddler)，可以跳过此文。

## Table of contents

## 背景

回武汉一段时间后，遇到了一些奇奇怪怪的项目。

**项目本地无法运行，但是你要做需求：**

`JSP` + `jQuery` 至少 10 年的古老项目，版本控制用的 `SVN`。

整个仓库管理员只给前端开了 `/static/` 目录的权限，

没有 `Java` 的代码，前端都是纯静态文件：`*.html` `*.js` `*.css`，

~~当然，就算有全套代码，你也没办法把项目跑起来...~~

😅 毕竟一套 `JDK` 环境的安装，以及 `MySQL` `Redis` 等环境的内网访问申请又要折腾很久...

在项目无法运行，前端全是静态文件的情况下，需要进行需求开发，各个环境调试等等。

**各种 location.replace() 导致看不到返回值：**

如果在应用 A 调用某个接口，再使用 `location.replace(){:js}` “重定向” 到应用 B，

在浏览器的控制台就无法看到接口的返回。

偶尔应用 B 又会拿到 A 携带的 `query params` 再调用其他接口后继续 “重定向”，

几个关键接口看不到返回...

即便代码中用 `console.log(){:js}` 打印了返回值，浏览器控制台也无法展开这个对象。

而且你还需要一直把 `XHR` 和 `Console` 中的 `Preserve log` 保持开启...

😵‍💫 接口没文档，调试还看不到返回值。

**将环境变量硬编码到环境分支：**

微前端架构的项目，里面差不多有 10 个子项目，每个项目都有各自的环境变量文件，

这些文件没有规则，除非你啃代码找到哪些常量属于环境变量...

普遍的 workfollow，我们会从 `prod` 或 `master` 分支 `git checkout -b feature-branch{:shell}` ，

而后将 `feature-branch` 往不同的环境分支，如：`dev` `beta` `uat` 等上面合并，再发布对应的环境。

但是这个项目，将各种环境的常量提交到了 `evn-branch`，最初是从 `dev` 开始搬代码，一直搬到 `prod`。

后面开发全部使用 `cherry-pick` 进行代码合并...

从哪个 `env-branch` 切分支，你本地运行项目后就只会掉这个 `env` 环境的东西，

你想切环境？放弃吧！

## 使用 Whistle

综上所述，我需要一个工具：

- 使用本地文件调试远程文件；
- 对接口进行抓包；
- 将指定的域名转发到另一个域名；

第一个想到的是 [Fiddler](https://www.telerik.com/fiddler)，但是它太重了，最后选择了 [Whistle](https://github.com/avwo/whistle)。

### 安装

[Whistle](https://github.com/avwo/whistle) 本身是一个 `npm` 包，和安装其他包一样，全局安装它即可：

```shell
npm i -g whistle

# Or 使用镜像

npm i -g whistle --registry=https://registry.npmmirror.com
```

安装完毕后，[Whistle](https://github.com/avwo/whistle) 会注册全局的 bin：`w2`，

你可以执行 `w2 help{:shell}` 来判断是否安装成功。

### 初始化

> 在安装之前，建议将本机已有的全局代理（例如：ClashX 等）关闭。
>
> `w2` 默认代理端口为 8899，在执行前，请检查端口是否被占用，
>
> 或者使用 `--port` 参数自定义代理端口。

**首次**安装后，需要进行初始化：

```shell
w2 start --init

# Or 自定义代理端口

w2 start --init --port 4321
```

执行 `w2 start --init{:shell}` 会做下面几件事情：

#### 1. 设置系统全局代理

它会和你的 `ClashX` 等代理冲突，这也是为什么建议你在初始化前关闭已有的全局代理。

#### 2. 安装系统根证书

> 你只有安装了系统根证书，才能对 https 请求进行抓包。

注意事项：

- Mac 需要两次输入开机密码或指纹验证：

![mac ca 1](/images/whistle/mac-ca-1.png)
![mac ca 2](/images/whistle/mac-ca-2.png)

- Windows 需要最后点击 “是(Y)” 确认：

![windows ca](/images/whistle/windows-ca.jpeg)

#### 3. 访问 WEB UI

启动 [Whistle](https://github.com/avwo/whistle) 及配置完代理后，用 `Chrome` 浏览器访问配置页面。

可以通过以下两种方式来访问配置页面：

- 方式1：域名访问 [http://local.whistlejs.com](http://local.whistlejs.com)；
- 方式2：ip+端口访问 [http://127.0.0.1:8899](http://127.0.0.1:8899)；

![web ui](/images/whistle/web-ui.png)

![web ui rules](/images/whistle/web-ui-rules.png)

### 再次启动

> 每次重启电脑，你都需要再次执行 `w2 start{:shell}` 启动代理。

你可以将 `w2 start{:shell}` 理解成 `npm run dev{:shell}`，它只是一个运行在后台的 node 服务，

重启电脑后，服务进程自然就结束了，所以重启电脑后需要再次启动 `w2`。

## 搭配 SwitchyOmega

> 当你运行 `w2` 后，很快就会发现，它的全局代理会和 `ClashX` 等全局代理相互冲突，
>
> 认真工作、FQ 摸鱼，只能二选一。

由于我只需要在浏览器中使用 [Whistle](https://github.com/avwo/whistle) 来调试公司的项目，所以可以关掉全局代理。

在 [SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega) 中创建不同的情景模式：

- 需要调试的公司项目代理到 [Whistle](https://github.com/avwo/whistle)；
- 不需要调试的走 `ClashX` 代理；

### 安装

可以直接从 Chrome 应用商店安装插件：[Proxy SwitchyOmega](https://chromewebstore.google.com/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif?hl=zh-CN)，

如果无法访问，也可以从 [SwitchyOmega releases](https://github.com/FelisCatus/SwitchyOmega/releases) 中直接下载。

### 情景模式

首先，我们执行 `w2 proxy off{:shell}` 关闭 [Whistle](https://github.com/avwo/whistle) 的全局代理。

而后，新建 `whistle` 情景模式：

![mode whistle](/images/whistle/mode-whistle.jpg)

继续新建 `clash` 情景模式（如果你有全局代理）：

![mode clashx](/images/whistle/mode-clash.jpg)

调整 `auto switch` 情景模式：

![mode auto](/images/whistle/mode-auto.jpg)

图片中打码的为公司各个项目所涉及的域名，假如我只需要调试 `dev` 和 `beta` 环境，那么就单独设置这两个域名走 `whistle` 情景模式。

公司其他的项目，例如代码仓库、Jenkins、门户网站等都走直接链接，其他的走 `clash` 情景模式。

> 走直接链接是为了匹配上公司的 VPN 访问内网服务。

最后选择 `auto switch` 情景模式：

![select mode](/images/whistle/select-mode.jpg)

### 技巧

为不同的情景模式，设置你熟悉的颜色：

![mode color](/images/whistle/mode-color.jpg)

当匹配上对应情景时，会展示不同的颜色。

匹配到 `whistle` 情景模式：

![mode color 1](/images/whistle/mode-color-1.jpg)

匹配到 `clash` 情景模式：

![mode color 2](/images/whistle/mode-color-2.jpg)

点击 [SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega) 会呼出一个下拉框，可以选择情景模式，随时对当前网站指定情景模式：

![mode custom](/images/whistle/mode-custom.jpg)

## 解决痛点

经过上面 [Whistle](https://github.com/avwo/whistle) 和 [SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega) 的配置：

- 所制定的 `dev` 和 `beta` 域名会被代理到 [Whistle](https://github.com/avwo/whistle)；
- 公司其他的内部应用走直接链接；
- 剩下的都会走本地的全局代理；

- 使用本地文件调试远程文件；
- 对接口进行抓包；
- 将指定的域名转发到另一个域名；

### 使用本地文件调试远程文件

> 规则生效保存后，记得勾选一次 Disable cache 后再刷新页面，让浏览器重新请求一次静态资源文件。

在 Rules 中新建规则：

![rule 1](/images/whistle/rule-1.jpg)

### 对接口进行抓包

只要匹配到 `whistle` 情景模式，被 [Whistle](https://github.com/avwo/whistle) 所代理到的请求，都会被抓到：

![request log](/images/whistle/request-log.jpg)

### 将指定的域名转发到另一个域名

在 Rules 中新建规则：

![rule 2](/images/whistle/rule-2.jpg)

**🎉🎉🎉 现在，终于可以愉的开发这些奇奇怪怪的项目了！**