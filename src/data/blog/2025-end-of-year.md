---
title: "2025: AI 编程的元年"
pubDatetime: 2026-01-16
modDatetime: 2026-01-16
slug: 2025-end-of-year
featured: false
draft: false
tags:
  - AI
  - 生活
description: Reasoning, Agents, Vibe Coding, AI 编程的元年.
---

> 2025，**3 个**仓库，**7 篇**博客，**369 次**提交。
>
> Reasoning, Agents, Vibe Coding, AI 编程的元年，2025，又是一年结束了。

## Reasoning LLMs

今年, 每家公司都至少发布了一个推理模型.

不仅如此, 一些推理模型还是可以在 **推理** 或 **非推理** 模式下运行的混合模型.

许多模型的 API 都新增了类似 `reasoning` 或 `thinkable` 等参数来控制模型是否开启推理.

记得 2023 年第一次和 GenAI 聊天, ChatGPT 的 `typing writer` 让我有一种在和真人聊天的感觉...

当 DeepSeek-R1 将整个思考的过程通过 UI 呈现出来的时候,

那可真是楼下买了震楼机, 给我震撼到家了...

但是过了数周, 我就有些讨厌这个特性, 因为整个过程太慢了,

十个字符的 Prompt, 模型可能会经过数分钟的 Reasoning 才会给出最终的 Completion.

**我花了一段时间才理解推理的用途.**

最初我以为 Reasoning 是为了让模型回答的更准确,

但是我完全可以通过 Prompt 调优, 或者提供更详细的 Context 来达到这个效果.

随着模型的升级, 各种 Coding Agent 的完善, 我才逐渐理解...

**推理的真正价值在于驱动工具.**

- 具有工具访问权限的推理模型可以规划多步骤任务
- 执行它们
- 并继续对结果进行推理
- 用于更新计划以更好地实现目标

## Agent

如果要评选 2025 的年度词汇, 那么 **Agent** 一定是前三.

从 2023 年简单的 ChatBot,

到特殊任务边排的 Workflow,

再到今年越来越智能的 Agent,

短短 2 年的时间, AI 在实际生产的落地更上一层楼!

**ReAct Agent**（Reasoning + Acting Agent）是一种 AI 智能体框架模式,

它将 **推理** 和 **行动** 结合起来, 让大模型能够:

- Thought（思考） - 模型先思考当前情况
- Action（行动） - 根据思考结果执行具体操作
- Observation（观察） - 观察行动结果，再进行下一轮思考

当你向 ReAct Agent 发送 "今天天气如何?", 它就会将推理和行动结合起来:

- Thought: 我需要查询当前天气
- Action: Search[武汉天气]
- Observation: 武汉今天晴，温度 -1°C
- Thought: 用户可能还想知道明天的情况
- Action: Search[武汉明天天气]

ReAct Agent 和其他 Agent 的区别:

- 简单 Chain：只能按固定步骤执行
- ReAct：可以动态推理、规划、调整行动
- Tool-use Agent：专注于调用外部工具
- Multi-agent：多个 Agent 协作完成复杂任务

今年我深度使用了一些 **Coding Agent**, 尤其是 `Cline` 和 `Claude Code`.

这些智能体将各种特性和调优结合起来, 无限放大了推理模型的能力.

这里有一张 `Claude Code` + `glm-4.7` 会话中的一段可视化截图,

展示了 Coding Agent 是如何结合这些特性:

- Thought
- Action
- Observation
- Tool-use
- Multi-agent

让推理模型自己达到:

- 增强 Prompt
- 意图识别
- 调用工具
- 总结再思考

![conversation.png](/images/2025-end-of-year/conversation.png)

## Vibe Coding

今年 6 月, 谷歌正式发布了 `gemini-2.5-pro`, 这是我唯一可以**免费**通过 API 调用的非国产模型,

我使用 `Cline` + `gemini-2.5-pro` 氛围编程了 5 个 Side Project.

工作的这么多年, 单兵作战是常态, 导致我写代码非常独,

哈哈, 注意是**单独的独**, 不是**有毒的毒**!

我非常讨厌别人(包括 AI)动我的代码, 也更不喜欢动别人代码(除非交接给我).

所以整个 2024 年, 我没有让 AI 给我写过一行代码.

学习并使用 AI 最初的动力来自于佑佑,

老婆在佑佑一岁多的时候, 买了宝宝巴士的点读绘本,

一年下来家里绘本已经有十多本了,

佑佑非常喜欢他的 JoJo 笔和那一堆绘本, 一玩可以玩一个小时.

### JoJo

早些时候, 我在拼多多上 5 块钱买了两本绘本,

一个有 200 种工程车, 一个有 200 种食物.

佑佑总是会拿着 JoJo 笔点上面的图片, 我只能告诉他这两本书不能发声...

后面我发现 JoJo 笔的包装盒里有一套录音贴, 总共 400 个, 刚好能覆盖这两本书.

我只需要准备好 400 个 `.mp3` 并导入到 JoJo 笔,

贴上录音贴, 就能让 5 块的绘本 -> 150 块的点读绘本!

我用手机给两本书的每一页拍照, 将这些照片发给 `gemini`:

> 我: 识别这些图片, 提取其中的文字, 只包含中文, 并以 `string[]` 的格式返回.
>
> gemini: ['苹果', '香蕉', ...]
>
> 我: 你是一个畅销的童书绘本作家，你擅长以孩童的纯真眼光看这世界，制作出许多温暖人心的作品.
>
> 针对这段 `string[]`, 为每一个词语生成一段20至50字符长度的旁白, 词汇不要太复杂, 这是为 1~2 岁的宝宝准备的,
>
> 并以 `{ label: '苹果', value: '00001', desc: '旁白'}[]`, `value` 从 `00001` 开始递增, 直至结束.
>
> gemini: `[{ label: '苹果', value: '00001', desc: '苹果 红红的苹果，圆圆的，像小皮球一样，每天一个苹果，医生远离我！'}, { label: '香蕉', value: '00002', desc: '香蕉 黄黄的香蕉，弯弯的，像小月亮一样，吃香蕉，长高高！'}, ...]`

![pdd.jpg](/images/2025-end-of-year/pdd.jpg)

拿到 `gemini` 所生成的数据源后, 我使用 [OOMOL](https://oomol.com/) 编排了一个工作流用来批量生成 `.mp3`.

- 循环数据源
- 用 `desc` + `cosyvoice-v1_longhua` 调用 `Cosyvoice-V1`
- 将 audio 保存为 `${value}.mp3`

![oomol.png](/images/2025-end-of-year/oomol.png)

**最后, 我有了这 400 个 `.mp3` 文件!**

![cosyvoice.png](/images/2025-end-of-year/cosyvoice.png)

**将 `.mp3` 导入 JoJo 笔, 贴上这 400 个录音贴**

![voice.jpg](/images/2025-end-of-year/voice.jpg)

**臭屁坨(佑佑)! 用 JoJo 笔点一下, 这两个绘本现在会说话了!**

![jojo.jpg](/images/2025-end-of-year/jojo.jpg)

### time-gem

今年下半年之后, 佑佑的**三把斧**把我和老婆治的服服帖帖:

- 中午不睡觉
- 晚上睡的晚
- 哄睡不让关灯

早些时候, 老婆给佑佑订了一年的《婴儿画报》, 这套刊物的公众号有个**小雨姐姐讲故事**的节目,

每天公众号会推送一篇软文, 里面会有一段讲故事的音频,

小雨姐姐深得佑佑心, 哄睡全靠她.

但是哄睡一般需要很久, 一段故事的音频却只有三五分钟,

喜马拉雅上有他们的专栏, 也已经很久没更新了, 没有最新的故事音频.

我让 `gemini` 给我做了两个应用:

- Web App: 通过公众号文章的链接抓取 `.mp3` 音频文件并上传到阿里云的 OSS
- Android App: 列出音频播放 `.mp3`

**Web App**

![web-app.png](/images/2025-end-of-year/web-app.png)

**Android App**

<div class="grid sm:grid-cols-3 gap-4">

![android-app.jpg](/images/2025-end-of-year/android-app.jpg)

<div class="col-span-2">

这个 APP 基于 ReactNative 开发和构建,

在此之前我从来没有完整的使用 RN 写过任何东西,

我也不清楚 Android 如何更新, 如何播放音频等等...

得益于 `gemini` 的多模态, 我只需要测试并发送截图, 让它自行识别并 debug,

前前后后让 `gemini` 改 UI、改播放、改逻辑等等, 折腾了一周多...

如果放在以前, 这个速度简直不敢想象.

我需要调研前端怎么写爬虫, 如何爬取公众号,

查看阿里云 OSS 文档写上传,

查看 ReactNative 文档, 本地怎么搭建 APP 开发环境, 调研播放音频相关的库...

这一套搞完应该就到 2026 年了吧 ~

</div>
</div>

### mcp-server-routine-bot

[mcp-server-routine-bot](https://github.com/PassionZale/mcp-server-routine-bot) 是我使用 `gemini` 所构建的 MCP Server.

2024 年 11 月底, Anthropic 发布了 MCP (Model Context Protocol，模型上下文协议),

在经过前面几次使用 `gemini` Vibe Coding 之后,

今年 8 月, 我觉得真的需要让 AI 担当我的 Development Assistant 了!

和之前的 Vibe Coding 不同, 这次我更多的让模型调研文档、编写开发计划、优化代码,

一周多的时间, 我已经做出了第一个 MVP 版本, 并快速的掌握了整个 MCP Server 和 MCP Clinet 的相关知识,

随着数月的迭代, 现在它已经内置 8 个工具, 是我每天都会频繁使用的工具之一了.

**Jenkins**

| 工具名称            | 描述                          |
| ------------------- | ----------------------------- |
| `jenkins_job_list`  | 获取 Jenkins 中的所有作业列表 |
| `jenkins_job_build` | 触发指定 Jenkins 作业的构建   |

**GitLab**

| 工具名称                      | 描述                           |
| ----------------------------- | ------------------------------ |
| `gitlab_create_merge_request` | 在 GitLab 中创建合并请求       |
| `gitlab_merge_merge_request`  | 在 GitLab 中合并指定的合并请求 |

**网页抓取**

| 工具名称         | 描述                           |
| ---------------- | ------------------------------ |
| `fetch_html`     | 获取网页原始 HTML 内容         |
| `fetch_json`     | 抓取并解析 JSON 文件           |
| `fetch_txt`      | 获取纯文本内容（移除HTML标签） |
| `fetch_markdown` | 将网页内容转换为 Markdown 格式 |

### codesugar

[codesugar](https://github.com/PassionZale/codesugar) 是我使用 `gemini` 构建的一款 Vscode Plugin.

我用过一些带 GUI 界面的 Coding Agent,

有一个痛点是它们无法让我自定义 Prompt 来生成 git commit message.

我让 `gemini` 参考 [Cline](https://github.com/cline/cline) 的源码分析它是如何实现这个功能的,

然后让它协助我一起完成了 [codesugar](https://github.com/PassionZale/codesugar) 的开发,

现在你应该可以在插件市场搜到了!

![vscode-plugin.png](/images/2025-end-of-year/vscode-plugin.png)

### vizcode

[vizcode](https://github.com/PassionZale/vizcode): 用代码可视化我的想法.

回顾 2023 到 今年上半年, 我最常用的几乎都是文本模型,

和那个掉用了无数遍的 `/completions/create`.

我想再使用一些视觉模型、语音模型,

这是我首次通过 AI 学习一个全新的框架: [motion-canvas](https://github.com/motion-canvas/motion-canvas):

- 使用 [context7](https://github.com/upstash/context7) 给大模型提供最新的、特定版本的文档和代码示例
- 使用大模型结合 `DeepResearch` 收集素材、设计脚本
- 使用大模型为最终脚本添加 `SSML` 标记
- 调用语音模型生成 `.mp3`
- 如何使用 MCP Server 让文本模型支持视觉
- 等等...

## GLM Coding Plan

> 🚀 速来拼好模，智谱 GLM Coding 超值订阅，邀你一起薅羊毛！Claude Code、Cline 等 20+ 大编程工具无缝支持，“码力”全开，越拼越爽！立即开拼，享限时惊喜价！
>
> 链接：[https://www.bigmodel.cn/glm-coding?ic=9PITSQM0LP](https://www.bigmodel.cn/glm-coding?ic=9PITSQM0LP)

9 月份听播客才知道**智普**, 在国庆期间购买了 Lite 套餐, 结合 `Cluade Code` 一直用到现在,

简单聊一聊我这 3 个月的使用情况.

10 月份编码套餐刚出来, 购买的人还不算太多, 智普的服务端算力充足,

哪怕是 Lite 套餐也几乎毫无卡顿, GLM-4.6 也是嘎嘎猛,

在熟悉了 `Claude Code` 之后, 我就将它用于公司的需求开发中.

只要给到足够的上下文, 基本上偏差不会太大, 满分 100 的话, 我可以打 85 分.

11 月中旬开始 GLM-4.6 有些降智, 体感没有 10 月份好用,

随着用户量的增加, 下午高峰期 `decode` 的速度变得非常慢.

就这样凑合用到 12.23, GLM-4.7 正式发布, 并且支持了 `Claude Code think` ,

好消息是, 又回到了嘎嘎猛的感觉.

坏消息是, Lite 套餐现在整天都很慢...

我找朋友借了 Pro 的 Key, 下午明显比 Lite 快上不少. ~~虽然也挺慢的~~

此时论坛、企微群等各个渠道, 大家都开始喷智普超卖严重, 导致 `decode` 速度非常慢, 完全用不了...

1月23日, Coding Plan 开启限量发售模式, 我觉得稍微改善了一些些,

不过现在 GLM 已经变成"午夜战神"了, 因为白天都很慢...

我每个月几乎会用掉 5 亿的 tokens, 20元/月, 为我连续工作一整天, 有求必应.

~~慢就慢点吧~~

![glm.png](/images/2025-end-of-year/glm.png)
