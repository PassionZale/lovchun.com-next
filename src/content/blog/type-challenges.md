---
title: TS 类型体操
pubDatetime: 2024-01-26T04:06:31Z
modDatetime: 2024-01-27T04:06:31Z
slug: type-challenges
featured: true
draft: false
tags:
  - 指南
  - Typescript
description: 我对 Type Challenges 题解的一些心得和拙见，持续更新中...
---

<a href="https://tsch.lovchun.com" target="_blank">
  <img src="https://tsch.lovchun.com/logo.svg" alt="type-challenges" />
</a>

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

使用 `keyof` 提取 `interface` 的键后保存为联合类型：

```ts
interface User {
  name: string;
  age: number;
}
type UserProperties = keyof User;
// UserProperties = "name" | "age"
```

使用 `typeof` 来引用变量或者属性的类型：

```ts
const foo = (arg1: string, arg2: number) => {};

type FooFunction = typeof foo;

const tesla = ["tesla", "model 3", "model X", "model Y"] as const;

type Tesla = typeof tuple;
```

使用 `in` 提取联合类型的值，主要用于对象和数组。

> 不要用于 `interface`，否则会报错。

```ts
type name = "firstname" | "lastname";
type TName = {
  [key in name]: string;
};
// TName = { firstname: string, lastname: string }
```

## 类型约束

使用 `extends` 来进行类型约束，通常结合泛型来对其进行约束：

```ts
// 限制泛型为一个对象
type ObjectT<T extends object> = T;

// Error: Type 'number' does not satisfy the constraint 'object'
type MyObjectT1 = ObjectT<number>;
// Ok
type MyObjectT2 = ObjectT<{}>;

// 限制泛型为一个数组
type ArrayT<T extends { length: number }> = T;
// or
type ArrayT<T extends unknown[]> = T;

// 限制泛型为一个元组
type TupleT<T extends PropertyKey[]> = T;
```

在某些场景，也可以**粗暴**的将 `extends` 理解为 **“等于”**：

```ts
// 实现 Exclude
// 如果 T "等于" U 则不返回，否则返回
type MyExclude<T, U> = T extends U ? never : T;

// 实现 If
// 如果 C（条件）为 true，则返回 T，否则返回 F
type If<C extends boolean, T, F> = C extends true ? T : F;

type A = If<true, "a", "b">; // 推导出 -> 'a'
```

## 递归

和 `Javascript` 中的递归类型，类型调用自身也可以完成递归：

```ts
type MyAwaited<T extends PromiseLike<unknown>> = T extends PromiseLike<infer U>
  ? U extends PromiseLike<unknown>
    ? MyAwaited<U>
    : U
  : never;

type ExampleType = Promise<string>;

// 推导出 -> 'string'
type Result1 = MyAwaited<ExampleType>;
// 推导出 -> 'string | boolean'
type Result2 = Promise<Promise<Promise<string | boolean>>>;
```

## infer

`infer` 常常和**条件类型**一起使用，先来看一下**条件类型**：

```ts
T extends U ? X : Y
```

在 `Typescript` 中没有 `if/else/switch/case`，所以只能用**三目运算符**来编写**条件类型**：

```ts
type MyType<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends undefined
        ? "undefined"
        : T extends Function
          ? "function"
          : "object";
```

使用 `infer` 就是将类型交给 `Typescript` 自行推断：

```ts
// 推断数组中 item 的类型
type Item<T> = T extends (infer U)[] ? U : never;

// string[]
const arr1 = ["a", "b"];
// 推导出 -> 'string'
type Arr1 = Item<typeof arr1>;

// number[]
const arr2 = [1, 2];
// 推导出 -> 'number'
type Arr2 = Item<typeof arr2>;

// (string | number | boolean)[]
const arr3 = ["a", 1, false];
// 推导出 -> 'string | number | boolean'
type Arr3 = Item<typeof arr3>;

const arr4 = ["a", 1, false, { foo: "bar" }];
// 推导出 -> 'string | number | boolean | { foo: string; }'
type Arr4 = Item<typeof arr4>;
```

> `infer` 所声明的类型，需要在条件类型的**子语句**中使用

```ts
// 👍 Ok
type Item<T> = T extends (infer U)[] ? U : never;

// ❌ 'infer' declarations are only permitted in the 'extends' clause of a conditional type
type Item<T extends (infer U)[]> = U;
```

> 使用场景

- 推断对象值的类型：

```ts
type ObjectValue<T> = T extends { x: infer U } ? U : never;
```

- 推断函数参数的类型：

```ts
// 参考内置的 Parameters<T> 类型
type FuncParamType<T> = T extends (x: infer U) => unknown ? U : never;
```

- 推断函数返回值的类型：

```ts
// 参考内置的 ReturnType<T> 类型
type FuncReturnType<T> = T extends (...args: never[]) => infer R ? R : never;
```

- 推断泛型参数的类型

```ts
type PromiseType<T> = T extends Promise<infer U> ? U : never;
```

- 推断模板字符的类型

```ts
type RemoveUnderscore<T> = T extends `_${infer R}` ? R : T;

const foo = `_abc`;

// 推导出 -> 'abc'
type FooType = RemoveUnderscore<typeof foo>;
```

> 更多参考：[精读《Typescript infer 关键字》](https://github.com/ascoders/weekly/blob/master/%E5%89%8D%E6%B2%BF%E6%8A%80%E6%9C%AF/207.%E7%B2%BE%E8%AF%BB%E3%80%8ATypescript%20infer%20%E5%85%B3%E9%94%AE%E5%AD%97%E3%80%8B.md)