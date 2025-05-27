---
title: 状态管理
description: Agent Chat App 全局状态设计。
pubDatetime: 2025-05-05
slug: create-agent-chat-app/state-manage
column: create-agent-chat-app
featured: false
draft: false
toc: false
tags:
  - AI
---

`Agent Chat App` 需要一个庞大的 **状态管理**，每个状态都对应着它的特性。

一个最小的实现，包含以下功能和配置：

- 聊天时选择不同的 Agent；
- 聊天时选择不同的 Model；
- 消息列表；
- 取消对话；
- 互联网搜索；
- 系统提词；
- 温度；
- 上下文窗口大小；
- 最大令牌数；
- 随机种子；

## 配置

```ts
interface Config {
  /** 选中的 Agent */
  selectedAgent: "normal" | "rag" | "bi";
  /** 选中的 Model */
  selectedModel?: "gpt-3.5-turbo" | "gpt-4.1" | "deepseek-r1" | "deepseek-v1";
  /** 系统提词 */
  systemPrompt?: string;
  /** 温度 */
  temperature?: number;
  /** 上下文窗口大小（默认：2048） */
  numCtx?: number;
  /** 最大令牌数（默认：2048） */
  numPredict?: number;
  /** 随机种子，模型输出的可重复性 */
  seed?: number;
  /** 互联网搜索 */
  searchEnabled: boolean;
}
```

## 消息

- `Message['role']{:ts}`

  角色用来区分布局和渲染。

- `Message['type']{:ts}`

  `text` 统一走 `Markdown` 渲染，其他扩展类型可以通过自定义组件来实现不同的交互。

- `Message['loading']{:ts}`

  客户端调用接口后，用于控制消息气泡的加载状态。

```ts
interface Message {
  /** 消息 ID */
  id: string;
  /** 消息角色 */
  role: "user" | "assistant" | "system";
  /** 消息类型 */
  type: "text" | "image" | "audio" | "file" | "video";
  /** 消息内容 */
  content: string;
  /** 加载状态 */
  loading: boolean;
}
```

## 消息列表

- `Messages['streaming']{:ts}`

  流式返回时，客户端正在实时的渲染返回结果，在大模型返回完成前 `streaming` 会一直为 `true`，

  每次发送 `user prompt` 前，校验是否为 `true`，防止当前对话结束前又新增一次对话。

- `Messages['ControllerPool']{:ts}`

	每次发送 `fetch` 请求时，将 `Message['id']{:ts}` 与 `AbortController{:ts}` 映射起来，

	点击 **取消** 后，执行 `controller.abort(){:ts}` 即可实现 **取消请求**。

```ts
interface Messages {
  /** 会话ID */
  sessionId: string;
  /** 流式返回状态 */
  streaming: boolean;
  /** 消息列表 */
  messages: Message[];
  /** AbortController 池 */
  ControllerPool: Record<Message["id"], AbortController>;
}
```
