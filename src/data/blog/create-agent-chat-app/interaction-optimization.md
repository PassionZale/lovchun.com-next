---
title: 交互优化
description: 客户端渲染 LLM 输出时的交互优化：自动滚动、打字机。
pubDatetime: 2025-05-03
slug: create-agent-chat-app/interaction-optimization
column: create-agent-chat-app
featured: false
draft: false
toc: false
tags:
  - AI
  - React
---

## 自动滚动

大模型返回的 `streaming message` 被客户端实时渲染时，

整个 `MessageList` 区块都应该自动的滚动到底。

```tsx
import { useState } from "react";

const MessageList = ({ messages = [] }) => {
  const [messageListRef, setMessageListRef] = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // 更新 messageListRef 是否将要触底的状态
  const checkScrollPosition = useCallback(() => {
    if (chatMessageRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatMessageRef.current;

      // 偏移量（50）根据项目的不同可以微调
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 50;

      setAutoScroll(isAtBottom);
    }
  }, []);

  // 监听 scroll 事件，检查 messageListRef 是否将要触底
  useEffect(() => {
    if (messageListRef.current) {
      const nativeElement = document.querySelector("messageList");

      nativeElement.addEventListener("scroll", checkScrollPosition);

      return () => {
        nativeElement.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, [checkPosition]);

  // messages 追加时自动滚动到底部
  useEffect(() => {
    /**
     * autoScroll 为 false，可能是用户自行向上滚动了一段
     *
     * 这种场景消息列表不再自动滚动，而是停留在用户当前滚动处
     */
    if (autoScroll) {
      messageListRef.current?.scrollTo({
        top: messageListRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, autoScroll]);

  return (
    <div ref={messageListRef} className="messageList" onWheel={handleWheel}>
      {messages.map(message => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
```

## 打字机

为了让大模型输出的渲染更加的 `Humanize`，需要给渲染加上 **打字机** 的效果。

```tsx title="TypeWriter.tsx"
import { useState, useEffect } from "react";
import styles from "./index.module.css";

interface TypeWriterProps {
  content?: string;
  speed?: number;
  onDone?: () => void;
}

const TypeWriter = ({
  content = "",
  speed = 1000,
  onDone,
}: TypeWriterProps) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(index => {
        if (index >= content.length - 1) {
          clearInterval(id);

          onDone?.();

          return index;
        }
        return index + 1;
      });
    }, speed);

    return () => {
      clearInterval(id);
    };
  }, [content, speed, onDone]);

  useEffect(() => {
    setDisplayedContent(displayedContent => displayedContent + content[index]);
  }, [index]);

  return <div className={styles.typeWriter}>{displayedContent}</div>;
};
```

```css title="index.module.css"
@keyframes blink {
  from {
    opacity: 0%;
  }
  to {
    opacity: 100%;
  }
}
.typeWriter::after {
  content: "|";
  animation: blink 1s infinite;
}
```

---

除了上面两种常用的优化，还有一些特性例如，也能提高用户体验：

- 大模型输出 **暂停**；
- 大模型输出 **取消**；
- 大模型输出的 **分页**；
- 大模型输出 **反馈** 和提词 **调优**；
- 提词 **修改** 重新生成回答；
- 思考过程的 **折叠**；
- 工具链的 **渲染**；
- `usedToken` 的 **展示**；
- 等等...
