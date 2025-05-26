---
title: 解析和渲染
description: LLM 输出的解析、渲染、自定义标签的状态机。
pubDatetime: 2025-05-02
slug: create-agent-chat-app/parser-and-render
column: create-agent-chat-app
featured: false
draft: false
tags:
  - AI
  - React
---

## 输出的“多态”

从 2022年 12月 `ChatGPT` 推出后到现在，大模型现在拆分成了 **通用型模型** 和 **推理型模型**，

简单的 **“聊天”** 已经无法满足这几年延伸出来的需求。

我们更期望大模型能做更多的事情，客户端能渲染更多的内容，例如：

- **RAG**

  对大模型进行检索增强落地知识库，客户端能渲染知识库的内容、展示命中的资源链接；

- **Tool Calling / MCP**

  让大模型调用第三方应用，例如支持天气查询、路线查询、数据库查询等，

  客户端能渲染天气卡片、路线规划、BI 报表等；

- **联网搜索**

  让大模型能及时补充互联网上的新鲜事，客户端能渲染引用到的网页；

- **深度思考**

  让推理型模型能展示思维链，客户端能渲染思考过程；

## 输出的解析和渲染

如果你之前做过电商 `ToC` 的业务，大模型输出的解析和渲染，你会感觉有点像 **首页的装修**。

运行 `ollama run deepseek-r1:32b{:shell}` 并给出提词 `1+1等于几？`：

![llm-output](/images/create-agent-chat-app/llm-output.png)

由于 `deepseek-r1` 是 **推理型模型**，它按照 `<think>{思考过程}</think>{回答}` 做出了返回。

> 大模型返回纯文本时，整个输出就是一段 `Markdown`，
>
> 大模型输出的解析和渲染就是 `Markdown` 的解析和渲染。

将 `Markdown` 解析为 `HTML` 并渲染到页面，这不是多年前静态网站在干的事吗？

- `markdown-it`
- `unified`
- `mdx`
- `contentlayer`
- etc...

到现在有非常多的库可以完成这种转换，生态也非常丰富，上面列举的这些库都是我曾使用过的，

如果你使用 `React`，也可以直接使用 [react-markdown](https://github.com/remarkjs/react-markdown)。

- **RAG / 联网思考**

  让大模型用 `<reference>{链接}</reference>` 包裹命中的文档：

  ```html
  <reference>
    - [lovchun.com](https://www.lovchun.com) 
    - [SSE](https://www.lovchun.com/posts/create-agent-chat-app/sse) 
    - [解析和渲染](https://www.lovchun.com/posts/create-agent-chat-app/parser-and-render)
  </reference>
  ```

- **Tool Calling / MCP / 深度思考**

  让大模型用指定的标签包裹返回结果：

  ```html
  <!-- 天气 -->
  <tool-weather>
    {"code":"200","updateTime":"2020-06-30T22:00+08:00","fxLink":"http://hfx.link/2ax1","now":{"obsTime":"2020-06-30T21:40+08:00","temp":"24","feelsLike":"26","icon":"101","text":"多云","wind360":"123","windDir":"东南风","windScale":"1","windSpeed":"3","humidity":"72","precip":"0.0","pressure":"1003","vis":"16","cloud":"10","dew":"21"},"refer":{"sources":["QWeather","NMC","ECMWF"],"license":["QWeather
    Developers License"]}}
  </tool-weather>

  <!-- 地图 -->
  <tool-amap>
    //uri.amap.com/marker?position=121.287689,31.234527&name=park&src=mypage&coordinate=gaode&callnative=0
  </tool-amap>

  <!-- BI -->
  <tool-bi>
    {"columns":[{"title":"姓名","dataIndex":"name","key":"name"},{"title":"年龄","dataIndex":"age","key":"age"},{"title":"住址","dataIndex":"address","key":"address"}],"dataSource":[{"key":"1","name":"胡彦斌","age":32,"address":"西湖区湖底公园1号"},{"key":"2","name":"胡彦祖","age":42,"address":"西湖区湖底公园1号"}]}
  </tool-bi>

  <!-- 深度思考 -->
  <think>
    首先，我需要确定用户的问题是什么\n这是一个基本的数字问题。\n接下来，我要...
  </think>
  ```

我们只需要在解析 `Markdown` 时为不同的 **language-** 匹配不同的组件，例如下方的样板代码：

```tsx title="Message.tsx"
import { useState, useMemo, memo, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const CollapseReference = data => <LLMCollapseReference data={data} />;
const CollapseThink = data => <LLMCollapseThink data={data} />;
const ToolWeather = data => <LLMToolWeather data={data} />;
const ToolAmap = data => <LLMToolAMap data={data} />;
const ToolBi = data => <LLMToolBi data={data} />;

const Message = memo(({ message }) => {
  const components = {
    code: ({ className, children, ...rest }) => {
      const match = /language-(\w+)/.exec(className || "");
      const lang = match && match[1];

      if (lang) {
        switch (lang) {
          case "reference":
            return <CollapseReference data={children} />;

          case "think":
            return <CollapseThink data={children} />;

          case "tool-weather":
            return <ToolBi data={JSON.parse(children)} />;

          case "tool-amap":
            return <ToolAmap data={children} />;

          case "tool-bi":
            return <ToolWeather data={JSON.parse(children)} />;

          default:
            return (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={dark}
              />
            );
        }
      }

      return <code className={`language-${lang}`}>{children}</code>;
    },
  };

  const remarkPlugins = [RemarkMath, RemarkBreaks];

  const rehypePlugins = [RehypeKatex];

  return (
    <ReactMarkdown
      children={message}
      components={components}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
    />
  );
});

export default Message;
```

样板代码中用到了一些 `remarkPlugins` 和 `rehypePlugins`，

如果你不清楚它们是干什么的，可以浏览我之前写的 [unified](/posts/upgrade-to-astro-v5#unified)。

## 标签的状态机

通过不同的 `自定义标签` 来渲染不同的 `自定义组件` 仅仅只是将输出展示到了页面，

如果客户端做一些动态变化的交互，就需要解析出标签的状态机：

- `网页搜索中` -> `网页搜索结束` -> `共引用10个网页`；
- `思考中` -> `思考结束` -> `共10秒`；

上面最常见的两个例子分别对应了：`标签开始` -> `标签未闭合` -> `标签闭合`。

```js
{ role: 'assistant', content: '', refusal: null }
/** 标签开始 **/
{ content: '<think>' }
/** 标签未闭合 **/
{ content: " don't" }
/** 标签未闭合 **/
{ content: ' scientists' }
/** 标签未闭合 **/
{ content: ' trust' }
/** 标签未闭合 **/
{ content: ' atoms' }
/** 标签未闭合 **/
{ content: '?\n\n' }
/** 标签未闭合 **/
{ 标签未闭合: 'Because' }
/** 标签未闭合 **/
{ content: ' they' }
/** 标签未闭合 **/
{ content: ' make' }
/** 标签未闭合 **/
{ content: ' up' }
/** 标签未闭合 **/
{ content: ' everything' }
/** 标签闭合 **/
{ content: '!</think>' }
{}
```

可以参考 [page-assist](https://github.com/n4ze3m/page-assist/blob/main/src/libs/reasoning.ts) 中的工具函数来实现状态机的解析，

如果你是个“伸手党”，我更推荐直接使用 [parseReasoning](https://github.com/titusTong/parseReasoning)。

```tsx
const renderMessage = () => {
  let completionContent: string = "";

  let referenceContent: string = "";
  let referencing: boolean = false;

  let thinkContent: string = "";
  let thinking: boolean = false;

  // 提取 reference
  parseReasoning(content, "reference").map(item => {
    if (item.type === "reasoning") {
      referenceContent = item.content;
      referencing = item.reasoning_running;
    } else if (item.type === "text") {
      completionContent = item.content;
      referencing = item.reasoning_running;
    }
  });

  // 提取 think
  if (!referencing) {
    parseReasoning(completionContent, "think").map(item => {
      if (item.type === "reasoning") {
        thinkContent = item.content;
        thinking = item.reasoning_running;
      } else if (item.type === "text") {
        completionContent = item.content;
        thinking = item.reasoning_running;
      }
    });
  }

  return (
    <Typography>
      {referenceContent || referencing ? (
        <CollapseReference content={referenceContent} loading={referencing} />
      ) : null}

      {thinkContent || thinking ? (
        <CollapseThink content={thinkContent} loading={thinking} />
      ) : null}

      {!referencing && !thinking ? (
        <Message message={completionContent} />
      ) : null}
    </Typography>
  );
};
```

---

一个大模型输出的解析、渲染、自定义标签的状态机 **样板代码** 基本就完成了。
