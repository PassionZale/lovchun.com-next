---
title: 国产之光 - DeepSeek
description: 使用 ollama 本地部署 deepseek-r1:32b 大模型。
pubDatetime: 2025-02-08
slug: deepseek-r1-32b
featured: false
draft: false
toc: false
tags:
  - 指南
---

春节期间网上全是 [DeepSeek](https://deepseek.com) 的各种消息，

开工的这两天正好有空，看看 36G 的 MBP 能否带动 `deepseek-r1:32b`。

![ollama](/images/deepseek-r1-32b/ollama.webp)

## 物料

- 16英寸 Macbook Pro - M3 Pro **12C** CPU, **18C** GPU, **36GB** Memory, **1TB** SSD storage
- [ollama](https://ollama.com/) - 开源的大型语言模型（LLM）平台，用来像 `Docker` 一样管理和运行模型
- [deepseek-r1:32b](https://ollama.com/library/deepseek-r1:32b) - DeepSeek 的第一代推理模型
- [Page Assist](https://chromewebstore.google.com/detail/page-assist-本地-ai-模型的-web/jfgfiigpkhlkbnfnbobbkinehhfdhndo) - 本地 AI 模型的 Web UI

## 安装 Ollama

[ollama](https://ollama.com/) 支持 macOS、Linux、Windows，前往 [ollama/download](https://ollama.com/download) 下载应用安装即可，

![ollama download](/images/deepseek-r1-32b/ollama-download.png)

macOS 下载会得到一个 `Ollama-darwin.zip` 文件，解压后将 `ollama.app` 移动到**应用**中，并运行它，

通过命令行输出版本号可以验证是否运行正常。

```shell
ollama --version
ollama version is 0.5.7
```

## 下载模型

由于模型从未下载过，执行 `pull` 或 `run` 都会开始下载模型：

- `ollama pull deepseek-r1:32b{:shell}`
- `ollama run deepseek-r1:32b{:shell}`

32b 的模型有 20GB，下载时间取决于网速，建议一大早下载或者挂一晚上吧。

02.07 白天 10:00 开始下载，一直到 18:00，才下了 4GB，速度 200kb/s ~ 2mb/s：

![download-slow](/images/deepseek-r1-32b/ollama-download-slow.jpg)

02.08 早上 7:00 重新下载，带宽拉满，速度 85mb/s 左右，5分钟左右下完：

![download-fast](/images/deepseek-r1-32b/ollama-download-fast.jpg)

## 对话模型

简单的发起了一次对话，思考时间有些久，不过内存压力还不算太大。

![deepseek chat](/images/deepseek-r1-32b/deepseek-chat.jpg)

## Web UI

现在有很多开源的 Web UI 可以对接本地大模型，这里我选择最简单的浏览器插件：[Page Assist](https://chromewebstore.google.com/detail/page-assist-本地-ai-模型的-web/jfgfiigpkhlkbnfnbobbkinehhfdhndo)，

安装 Page Assist 并开启联网搜索后，再发起一次对话验证效果。

*阿格莱亚 发布于 2025-02-05：*

![Page Assist](/images/deepseek-r1-32b/page-assist.png)
