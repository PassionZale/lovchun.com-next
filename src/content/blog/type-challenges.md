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

## 神奇的符号

![ts-operation](/images/type-challenges/ts-operation.png)

### ?. 可选链（Optional Chaining）

ES11（ES2020）新增的特性，TypeScript 3.7 支持了这个特性

> 我们在 为什么要使用 TypeScript？ TypeScript 相对于 JavaScript 的优势是什么？中提到 TypeScript 与标准同步发展，并推进了很多 ECMAScripts 语法提案，比如可选链操作符（ ?. ）、空值合并操作符（ ?? ）、Throw 表达式、正则匹配索引等，所以，这里介绍的符号大部分都是 ECMAScripts 规范的，TypeScript 特有的只有 ?: 、 ! 、& 、 |

可选链可让我们在查询具有多层级的对象时，不再需要进行冗余的各种前置校验：

```js
var info = user && user.info;
```

又或是这种：

```js
var age = user && user.info && user.info.getAge && user.info.getAge();
```

很容易出现语法错误： `Uncaught TypeError: Cannot read property...{:shell}`

用了 Optional Chaining ，上面代码会变成：

```js
var info = user?.info;
var age = user?.info?.getAge?.();
```

TypeScript 在尝试访问 `user.info` 前，会先尝试访问 `user` ，`user` 既不是 `null` 也不是 `undefined` 才会继续往下访问，如果`user` 是 `null` 或者 `undefined`，则表达式直接返回 `undefined`。

即可选链是一种先检查属性是否存在，再尝试访问该属性的运算符 （ `?.` ）。

目前，可选链支持以下语法操作：

```js
obj?.prop;
obj?.[expr];
arr?.[index];
func?.(args);
```

### ?? 空值合并运算符（Nullish coalescing Operator）

ES12（ES2021）新增的特性，TypeScript 3.7 支持了这个特性，当左侧的操作数为 `null` 或者 `undefined` 时，返回其右侧操作数，否则返回左侧操作数。

```js
// {
//   "level": null
// }
var level1 = user.level ?? "暂无等级"; // level1 -> '暂无等级'
var level2 = user.other_level ?? "暂无等级"; // level1 -> '暂无等级'
```

与逻辑或操作符 `||` 不同，`||` 会在左侧操作数为 falsy 值（例如，`''` 或 `0`）时返回右侧操作数。也就是说，如果使用 `||` 来为某些变量设置默认值，可能会遇到意料之外的行为：

```js
// {
//   "level": 0
// }
var level1 = user.level || "暂无等级"; // level1 -> 暂无等级
var level2 = user.level ?? "暂无等级"; // level2 -> 0
```

### ?: 可选参数和属性

TypeScript 特有的，在 TypeScript 2.0 支持了这个特性，可选参数和属性会自动把 `undefined` 添加到他们的类型中，即使他们的类型注解明确不包含 `undefined`。例如，下面两个类型是完全相同的：

```ts
// 使用--strictNullChecks参数进行编译
type T1 = (x?: number) => string; // x的类型是 number | undefined
type T2 = (x?: number | undefined) => string; // x的类型是 number | undefined
```

在 TypeScript 里，我们使用 `?:` 最多的情况是在接口中，通常：

```ts
interface Point {
  x: number;
  y: number;
}

let point: Point;

point = {
  x: 1,
  y: 2,
};
```

其中 point 中的两个属性 `x` 、`y` 都是必须的，如果赋值时缺少任意一个就会报错：

```ts
point = {
  x: 1,
};
// Property 'y' is missing in type '{ x: number; }' but required in type 'Point'.
```

但接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在。 所以，这里就需要可选属性（ `?:` ），即属性是可选的：

```ts
interface Point {
  x: number;
  y: number;
  z?: number; // 可选属性
}

let point: Point;

point = {
  x: 1,
  y: 2,
};
```

在 TypeScript 有两个内置的工具泛型可以帮助我们处理接口的可选操作：

- `Partial` ：把接口中的所有属性变成可选的；
- `Required` ：将接口中所有可选的属性改为必须的；

### Partial

`Partial` 的作用即把类型中的所有属性变成可选的：

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface Point {
  x: number;
  y: number;
}

type PartialPoint = Partial<Point>;

// PartialPoint 相当于：
// type PartialPoint = {
//     x?: number;
//     y?: number;
// }
// 所有属性均可选
```

### Required

`Required` 的作用刚好与 `Partial` 相反，就是将接口中所有可选的属性改为必须的，区别就是把 `Partial` 里面的 `?` 替换成了 `-?`：

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};

interface Point {
  x?: number;
  y?: number;
}

type RequiredPoint = Required<Point>;

// RequiredPoint 相当于：
// type RequiredPoint = {
//     x: number;
//     y: number;
// }
// 所有属性均必须
```

### ! 非空断言操作符

TypeScript 特有的，在 TypeScript 2.0 支持了这个特性，在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 `null` 和非 `undefined` 类型的。具体而言，运算 `x!` 产生一个不包含 `null` 和 `undefined` 的 x 的值。

```ts
function sayHello(hello: string | undefined) {
  const hi1 = hello!.toLowerCase(); // OK
  const hi2 = hello.toLowerCase(); // Error: Object is possibly 'undefined'
}
```

仅仅只是骗过了编译器，当你调用 `sayHello()` 依然会报错，这样使用是因为你已经断言了 `hello` 一定是 `string`：

```ts
let root: HTMLElement | null = document.getElementById("root");
// 非空断言操作符--> 这样写只是为了骗过编译器，防止编译的时候报错，但打包后的代码可能还是会报错
root!.style.color = "red";
```

### 非空断言操作符 & 类型守卫

类型守卫用于确保该类型在一定的范围内，常用 `typeof` 、 `instanceof` 、`in` 等。

```ts
function sayHello(hello: string | undefined) {
  if (typeof hello === "string") {
    const hi = hello.toLowerCase();
  }
}
```

但如果你这样写：

```ts
function sayHello(hello: string | undefined) {
  const isSay = typeof hello === "string";
  if (isSay) {
    const hi1 = hello.toLowerCase(); // Error: Object is possibly 'undefined'.
    const hi2 = hello!.toLowerCase(); // OK
  }
}
```

就会报错，即使 `isSay` 被分配到了类型守卫值，TypeScript 也只会丢失该信息。所以我们一般会加上非空断言操作符：

`const hi = hello!.toLowerCase(){:js}`

但 TypeScript 4.4 RC 会修复这个问题，如果你遇到这个问题，可升级到 TypeScript 4.4 版本后。

### \_ 数字分隔符（Numeric separators）

ES12（ES2021）新增的特性，TypeScript 2.7 就已经支持了这个特性， 这个特性允许用户在数字之间使用下划线\_来对数字分组。

```js
const million = 1_000_000;
const phone = 173_1777_7777;
const bytes = 0xff_0a_b3_f2;
const word = 0b1100_0011_1101_0001;
```

需要注意的是以下函数是不支持分隔符：

- `Number()`
- `parseInt()`
- `parseFloat()`

```js
const million = "1_234_567";

Number(million);
// NaN

parseInt(million);
// 1

parseFloat(million);
// 1
```

### \*\* 指数操作符

ES7（ES2016）新增的特性。

```js
2 ** 5; // 32
```

### & 交叉类型（Intersection Types）

在 TypeScript 中，交叉类型是将多个类型合并为一个类型，我们可以通过 `&` 把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

```ts
type PointX = {
  x: number;
};

type Point = PointX & {
  y: number;
};

let point: Point = {
  x: 1,
  y: 2,
};
```

如果多个类型中存在相同的属性？

```ts
type PointX = {
  x: number;
  z: string;
};

type Point = PointX & {
  y: number;
  z: number;
};

let point: Point = {
  x: 1,
  y: 2,
  z: 3, // Type 'number' is not assignable to type 'never'.
};
```

这里 `z` 为什么会是 `never` 类型？因为 `string & number` 的值是永不存在的值，即 `never`。

```ts
type PointX = {
  x: number;
  z: { x: string };
};

type Point = PointX & {
  y: number;
  z: { z: number };
};

let point: Point = {
  x: 1,
  y: 2,
  z: {
    x: "1",
    z: 2,
  },
};
```

而这样是可以的，所以，即多个类型合并为一个交叉类型时，如果多个类型间存在同名基础类型属性时，合并后的同名基础类型属性为 `never` ，如果同名属性均为非基础类型，则可以成功合并。

### | 联合类型（Union Types）

联合类型表示一个值可以是几种类型之一，用竖线 `|` 分隔每个类型，所以 `number | string | boolean` 表示一个值可以是 `number`， `string`，或 `boolean`。

```ts
let user: string | number | boolean = "an";
```

联合类型通常与 `null` 或 `undefined` 一起使用：

```ts
const helloName = (name: string | undefined) => {
  /* ... */
};
```

你也可以这么用：

```ts
type Hello = "say" | "kiss" | "smile";
```
