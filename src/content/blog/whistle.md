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

`Whistle` 是一款基于 `Node` 实现的跨平台抓包调试工具，类似于 `Fiddler`，

如果你已经熟练使用 `Fiddler`，可以跳过此文。

## Table of contents

## 使用背景

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

## 相关文档

## 为什么使用 Whistle？

## 为什么需要搭配 SwitchyOmega？
