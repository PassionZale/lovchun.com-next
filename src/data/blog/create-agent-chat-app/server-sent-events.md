---
title: SSE
description: 从 Fetch 到 Streams，以流的方式与 LLM 进行交互。
pubDatetime: 2025-05-01
slug: create-agent-chat-app/server-sent-events
column: create-agent-chat-app
featured: false
draft: false
tags:
  - AI
---

## 创建聊天

和大模型交互非常容易，拿 `openai` 举例，调用 `SDK`，仅仅 6 行代码就能完成交互：

```ts
import OpenAI from "openai";
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "你是谁？" },
  ],
});

console.log(completion.choices[0].message.content);
```

除了 `SDK`，你也可以调用 `RESTful API`：

```ts
const res = await fetch("https://api.openai.com/v1/chat/completions", {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${$OPENAI_API_KEY}`,
  },
  method: "POST",
  body: JSON.stringif({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "你是谁？" },
    ],
  }),
});

const completion = await res.json();

console.log(completion.choices[0].message.content);
```

这样的交互方式和平时写的业务接口，好像没什么两样，

依然是前后端通过 `JSON` 传输数据，

随着 `prompt` 越来越长，越来越复杂，

模型返回 `completion` 内容和时间也会随之增长，

用户等待的时间也会越来越长...

## 流式输出

开启 `stream` 后，大模型不再一次性生成最终结果，

而是逐步地生成中间结果，最终结果由中间结果拼接而成。

用流式输出的方式调用大模型，能够实时返回中间结果，

减少用户的阅读等待时间，并降低请求的超时风险。

```ts {10, 13-15}
import OpenAI from "openai";
const openai = new OpenAI();

const stream = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "user", content: "Say 'double bubble bath' ten times fast." },
  ],
  stream: true,
});

for await (const chunk of stream) {
  console.log(chunk);
  console.log(chunk.choices[0].delta);
  console.log("****************");
}
```

响应会通过事件流以块为单位逐步发送，我们可以使用 for 循环遍历事件流：

```js
{ role: 'assistant', content: '', refusal: null }
****************
{ content: 'Why' }
****************
{ content: " don't" }
****************
{ content: ' scientists' }
****************
{ content: ' trust' }
****************
{ content: ' atoms' }
****************
{ content: '?\n\n' }
****************
{ content: 'Because' }
****************
{ content: ' they' }
****************
{ content: ' make' }
****************
{ content: ' up' }
****************
{ content: ' everything' }
****************
{ content: '!' }
****************
{}
****************
```

## 结构化输出

虽然我们可以通过微调 `prompt`，让模型返回 `JSON`，例如：

### prompt

> 解析："江岸区建设大道"，并提取文本内包含中国的省(province)、市(city)、区(district)、详细地址(address)，在保证 province、city、dirstric 级联关系正确的情况下以 JSON 的形式返回，JSON 的格式是: "{province?: string, city?: string, district?: string, address?: string}"

### completion

````json
{
  "id": "chatcmpl-B9MBs8CjcvOU2jLn4n570S5qMJKcT",
  "object": "chat.completion",
  "created": 1741569952,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "根据你提供的文本“江岸区建设大道”，我们可以解析出以下信息：\n\n- **省 (province)**: 湖北省\n- **市 (city)**: 武汉市\n- **区 (district)**: 江岸区\n- **详细地址 (address)**: 建设大道\n\n以下是 JSON 格式的返回结果：\n\n```json\n{\n  \"province\": \"湖北省\",\n  \"city\": \"武汉市\",\n  \"district\": \"江岸区\",\n  \"address\": \"建设大道\"\n}\n```\n\n",
        "refusal": null,
        "annotations": []
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ]
}
````

但大模型输出内容具有**不确定性**，返回的内容可能不符合 `JSON` 格式:

- 比如输出的内容多了\```json```
- 或 “以下为JSON字符串” 等内容

### response_format

开启结构化输出功能可以确保大模型输出标准格式的 JSON 字符串。

#### json_object

> 大部分模型都支持

```ts {2-4}
const chatCompletion = await openai.chat.completions.create({
  response_format: {
    type: "json_object",
  },
  messages,
  model: "gpt-3.5-turbo",
});
```

#### json_schema

> 不是所有模型都支持

对于 `openai` 来说，从 GPT-4o 开始，大模型才支持结构化输出，

现在可以直接结合 `zod` 设置 `json-schema`：

```ts {16}
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const Areas = z.object({
  province: z.string(),
  city: z.string(),
  district: z.string(),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4.1",
  messages,
  response_format: zodResponseFormat(Areas, "event"),
});

const event = completion.choices[0].message.parsed;
```

#### json_repair

> 就像服务端永远不能相信客户端的入参一样，大模型也永远不会 100% 正确返回你想要的东西。

尽管已经通过各种手段约定大模型返回 `JSON`，但是它仍然会出错，

最普遍的场景就是受限于 `max_tokens`，大模型返回的可能是被截断的 `JSON`：

```json title="截断的 JSON"
{
  'firstName': 'John'
  lastName: “Smith”
  fullName: John Smith,

  // TODO: fill in last season
  scores: [ 7.8 6.3 7.1, ],

  "about": "John loves a challenge, " +
          "but can quickly lose focus."
```

因此，接收大模型返回值后，还需要使用类似 [json_repair](https://josdejong.github.io/jsonrepair/) 这种库来修复常见的问题：

- 在缺少的键周围添加引号
- 添加缺少的转义字符
- 添加缺失的逗号
- 添加缺失的右括号
- 修复截断的 JSON
- 将单引号替换为双引号
- 用常规双引号替换特殊引号字符，例如 “...”
- 用常规空格替换特殊空格字符
- 将 `Python` 常量 `None` 、 `True` 和 `False` 替换为 `null` 、 `true` 和 `false`
- 等等...

```json title="修复后的 JSON"
{
  "firstName": "John",
  "lastName": "Smith",
  "fullName": "John Smith",

  "scores": [7.8, 6.3, 7.1],

  "about": "John loves a challenge, but can quickly lose focus."
}
```

但是这类库也只能处理基本的修复问题，遇到更为复杂的嵌套数据结构，偶尔也会修复失败，

所以无论如何，都需要使用 `try...catch` 兜底，以此来确保程序的健壮性：

> `JSON` 修复的逻辑可以酌情考虑是放在服务端还是客户端
>
> 放在服务端，可能需要提高机器的配置，影响接口的响应速度
>
> 放在客户端，会占用客户端的内存，影响用户的体验

```ts
import { jsonrepair } from "jsonrepair";

try {
  const json = "{name: 'John'}";

  const repaired = jsonrepair(json);

  console.log(repaired); // '{"name": "John"}'
} catch (err) {
  // 兜底
  console.error(err);
}
```

## API 封装

### service

在服务端，示例中使用 `Nextjs`，将 `openai` 相关调用和响应封装为一个工具模块：

````ts title="/services/chat.ts"
import { createParser } from "eventsource-parser";
import { NextRequest } from "next/server";
import fetch from "fetch-with-proxy";

const OPENAI_URL = "api.openai.com";
const DEFAULT_PROTOCOL = "https";
const PROTOCOL = process.env.PROTOCOL ?? DEFAULT_PROTOCOL;
const BASE_URL = process.env.BASE_URL ?? OPENAI_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const requestOpenai = async (
  path: string,
  { method = "POST", body }: { method?: "POST" | "PUT" | "GET"; body: any }
) => {
  const res = fetch(`${PROTOCOL}://${BASE_URL}/${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    method: method,
    body: body,
  });

  return res;
};

const buildSystemPrompt = (nickname: string): string => {
  return `你是小红书助手，我的名字是 "${nickname}"，在对话中你可以偶尔使用我的名字来增加对话舒适性。`;
};

export const createStream = async (req: NextRequest, onDone: () => void) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const body = await req.json();
  const { nickname, stream, messages } = body;
  const systemPrompt = buildSystemPrompt(nickname);

  const requestMessages = [{ role: "system", content: systemPrompt }].concat(
    messages
  );

  const res = await requestOpenai("v1/chat/completions", {
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: requestMessages,
      stream: stream,
      max_tokens: 2000,
      temperature: 0.9,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.3,
    }),
  });

  const contentType = res.headers.get("Content-Type") ?? "";

  if (!contentType.includes("stream")) {
    let content = await res.text();

    /**
     * 这一行 replace 非常重要，用来防止 OPENAI_KEY 泄露
     *
     * 当你的 OPENAI_KEY 导致 openai 异常时，openai 会返回如下的 error message：
     *
     * Incorrect API key provided: sk-*********************************ZXY. You can find your API key at https://platform.openai.com/api-keys
     *
     * 如果没有任何处理，走到 catch 而后 controller 给出 response，
     *
     * !!!任何调用此接口的都会明文拿到你所使用的 OPENAI_KEY!!!
     *
     * Incorrect API key provided: sk-*********************************ZXY. You can find your API key at...
     *
     * 处理后：
     *
     * Incorrect API key provided: ***. You can find your API key at...
     */
    content = content.replace(/provided:.*. You/, "provided: ***. You");

    /**
     * 最后做一层特殊的包装（以个人习惯为准）
     *
     * "ERROR_MESSAGE_BOUNDARY_```json
     * Incorrect API key provided: ***. You can find your API key at...```"
     *
     */
    return "ERROR_MESSAGE_BOUNDARY_```json\n" + content + "```";
  }

  const readableStream = new ReadableStream({
    async start(controller) {
      function onParse(event: any) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            onDone();
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  // 监听客户端的取消事件
  req.signal.addEventListener("abort", () => {
    // 部分大模型提供商，例如 coze，可以在此回调中调用 ”取消聊天接口“
    console.log("req aborted");
  });

  return readableStream;
};
````

### controller

完成 `servers` 的封装后，定义 `controller` 用来给前端调用：

````ts title="api/chat/route.ts"
import { NextRequest, NextResponse } from "next/server";
import { checkAccessCode } from "@/services/access";
import { createStream } from "@/services/chat";

export async function POST(req: NextRequest) {
  try {
    const errors = await checkAccessCode(req);
    const accessCode = req.headers.get("x-access-code");

    if (errors) {
      return NextResponse.json(errors[0], errors[1]);
    }

    const stream = await createStream(req);

    return new NextResponse(stream);
  } catch (error) {
    console.error("[Chat Stream]", error);

    /**
     * 接口正常返回的是模型的 completion，前端会使用 <ReactMarkdown /> 渲染
     *
     * 这里也将异常信息用 ```json *** ``` 包裹，并于前端使用一套渲染逻辑
     *
     * error: { message: "Something went wrong", code: 500 }
     * JSON.stringify 后： '{\n  "message": "Something went wrong",\n  "code": 500\n}'
     * markdown 包裹后：'```json\n{\n  "message": "Something went wrong",\n  "code": 500\n}\n```'
     */
    return new NextResponse(
      ["```json\n", JSON.stringify(error, null, "  "), "\n```"].join("")
    );
  }
}
````

至此，一个基本的 `/api/chat` 已经 ready！

## 前后端交互

最后的最后，在客户端，使用 `fetch` 通过 `SSE` 协议并开启 `stream` 调用：

```ts title="requests/chat.ts"
import { useUserStore } from "@/store";

export interface SendMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  nickname: string;
  messages: SendMessage[];
  onMessage: (message: string, done: boolean) => void;
  onError: (error: any, code?: number | string) => void;
  onAbortController?: (abortController: AbortController) => void;
}

const TIME_OUT_MS = 30000;

export const requestStreamingChat = async (params: ChatRequest) => {
  const { nickname, messages, onError, onMessage, onAbortController } = params;
  const accessCode = useUserStore.getState().accessCode;

  if (!accessCode) {
    return onError(new Error("No access code"), 401);
  }

  const controller = new AbortController();
  const reqTimeoutId = setTimeout(() => controller.abort(), TIME_OUT_MS);

  try {
    const res = await fetch("api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-code": accessCode,
      },
      signal: controller.signal,
      body: JSON.stringify({
        nickname,
        messages: messages.map(v => ({
          role: v.role,
          content: v.content,
        })),
        stream: true,
      }),
    });

    clearTimeout(reqTimeoutId);

    let responseText = "";

    const finish = () => {
      onMessage(responseText, true);
      controller.abort();
    };

    if (res.ok) {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      onAbortController?.(controller);

      while (true) {
        const resTimeoutId = setTimeout(() => finish(), TIME_OUT_MS);
        const content = await reader?.read();

        clearTimeout(resTimeoutId);

        /**
         * 至此，我们已经解析到了 SSE 中的 chunk content，
         *
         * 每个大模型服务商所返回的 content 中 value 的数据结构各有千秋，
         *
         * 这里以 /api/chat 为例，假定这个接口永远返回 { value: string }
         */
        const text = decoder.decode(content?.value);
        responseText += text;

        const done = !content || content.done;
        onMessage(responseText, false);

        if (done) {
          break;
        }
      }

      finish();
    } else if (res.status === 401) {
      console.error("Anauthorized");
      onError(new Error("Anauthorized"), res.status);
    } else {
      console.error("Stream Error", res.body);
      onError(new Error("Stream Error"), res.status);
    }
  } catch (err) {
    console.error("NetWork Error", err);
    onError(err as Error, "Network Error");
  }
};
```

---

**🫶 辛苦你看到了最后。**

一个前后端基于 `SSE` 交互，并打通大模型的 **样例代码** 基本就完成了，

当然它还远远不够，如果有任何建议，可以通过 [Discussions](https://github.com/PassionZale/lovchun.com-next/discussions) 或者 [邮箱](mailto:contact@satnaing.dev) 联系我。
