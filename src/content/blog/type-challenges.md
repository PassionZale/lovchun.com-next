---
title: TS 类型体操
pubDatetime: 2024-01-26T04:06:31Z
modDatetime: 2024-01-26T04:06:31Z
slug: type-challenges
featured: false
draft: false
tags:
  - 指南
  - Typescript
description: 我对 Type Challenges 题解的一些心得和拙见，持续更新中...
---

## Table of contents

## any

使用 `any` 标记某个变量的类型时，相当于关闭了类型检查。

你做任何事情都是**合法**的：

```ts
let anything: any

anything = 4321
if (anything <= 4321>) {} // Ok

anything = 'lovchun.com'
if (anything <= 4321>) {} // Ok

anything = []
if (anything <= 4321>) {} // Ok
```

正是如此，所以 `any` 类型非常危险，例如：可以在值为 `undefined` 的变量上调用函数：

```ts
let anything: any = undefined;

anything.someFunc(); // Ok
```

这也是我们经常遇到的语法报错：`Cannot read properties of undefined (reading 'someFunc'){:shell}`

## unknown

使用 `unknown` 标记类型时，恰恰和 `any` 相反。

你做任何事情都是**不合法**的：

```ts
let anything: unknown;

anything = 4321;
if (anything <= 4321) {
} // Error: anything is 'unknown'

anything = "lovchun.com";
if (anything <= 4321) {
} // Error: anything is 'unknown'

anything = [];
if (anything <= 4321) {
} // Error: anything is 'unknown'
```

`Typescript` 强制你在使用 `unknown` 类型前执行类型检查：

```ts /typeof anything === 'number'/
let anything: unknown;

anything = 4321;
if (typeof anything === "number" && anything <= 4321) {
} // Ok
```

> 应用场景

需要约束泛型为一个任意的数组类型：

```ts /unknown/ /any/
// 👍 推荐
type Push<T extends unknown[], U> = [...T, U];

// ❌ 不推荐
type Push<T extends any[], U> = [...T, U];
```

## never

如果 `any` 表示 **everything**，则 `never` 表示 **nothing**。

> 应用场景

`never` 通常和各种“条件”一起使用：

```ts /never/
// 第一个元素
type First<T extends unknown[]> = T extends [] ? never : T[0];

type arr = ["a", "b", "c"];

type arrFirst = First<arr>; // 推导出 -> 'a'

// 实现 Exclude
type MyExclude<T, U> = T extends U ? never : T;

type Result = MyExclude<"a" | "b" | "c", "a">; // 推导出 -> 'b' | 'c'

// 函数参数的声明：
type MyReturnType<T> = T extends (...args: never[]) => infer R ? R : never;
```

> 其他场景

- 用于 `function`：

```ts
function customError(message: string): never {
  throw new Error(message);
}
```

- 用于 `if/esle`：

```ts
function getValue(value: string) {
  if (typeof value === "number") {
    // do something...
  } else if (typeof value === "string") {
    // do something else...
  } else {
    assertNever(value);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

- 用于 `switch/case`：

```ts
type Color = 'red' | 'green' | 'blue'

function getColorHex(color: Color): string {
  swtich (color) {
    case 'red':
      return '#FF0000'
    case 'green':
      return '#00FF00'
    case 'blue':
      return '#0000FF'
    default:
      const _exhaustiveCheck: never = color
      return _exhaustiveCheck
  }
}
```

## 运算符

`keyof` 总是能结合起来

## K of T

## 递归

## 等于

## infer
