---
title: 五月面经
description: 2023 前端是个巨难的一年，裸辞到顺利入职，焦焦虑虑，共勉吧。
pubDatetime: 2023-05-28T04:06:31Z
postSlug: may-interview-experience
featured: false
draft: false
tags:
  - 面试
---

## Table of contents

## 背景

> 面经又臭又长，总结写在最前面吧~
>
> 以为拿了一份补偿能放松的玩一段时间，其实并不是这样，很多人并不知道怎么享受自由，例如我...

- 双平台投递简历，5.10-5.25 面了 9 家，推了 2 家，拿到 3 家 offer；
- 武汉这边超多公司自带电脑，100-150 元/月补贴；
- 公司发 offer 前，会索要上家公司的人事和直系领导电话做背调；
- 五险一金大部分都是最低；
- 资源：
  - [武汉避坑](https://zhuanlan.zhihu.com/p/618705010)
  - [前端八股](https://juejin.cn/post/7016593221815910408)
  - [基础知识](https://github.com/febobo/web-interview)
  - [简历工具](https://github.com/Dunqing/resume)
  - [简历模板](https://github.com/geekcompany/ResumeSample)

21 年五一，深圳母公司在武汉开分公司，第一个报名回汉，薪资从 23k 打折到 18k，经过一年半之后的评级，升职后又从 18k 涨到 21k，外加每个月 2000 交通补贴，基本和升职前持平。

在武汉税前 23k，项目也是自己从 0 到 1，写了两年多，深圳武汉两边的研发同事跟我也很熟，感觉稳的不行，干劲十足，结果好景不长，分公司砍掉了...

今年 3 月，迫于各种原因，武汉分公司解散，去年年末生了小宝宝也不想再折腾了，选择拿赔偿走人，2,3 月工资、加班折现、退股、N+1 到手将近 20 万。

3.13 正式解除劳务合同后，经同事内推入职了一家公司，18k，算是无缝连接并且薪水也没压太多，在现在这行情下，简直做梦都不敢想，不带考虑直接入职，好景不长，在新公司做了两个月发现有些做不下去...

- 业务冷门（声纹相关）无人带；
- 同事之前无沟通；
- 电脑加密监控卡到爆；
- 老婆小孩二阳接二连三发烧；

遂提了离职，准备回家带娃，让老婆休息一段时间，自己也稍微放松下。

5.9 正式离职之前，约了趴趴英语和雷神科技两家公司的面试，再加上 BOSS 上面 HC 明显比之前多了不少，外包也打招呼个不停，让我以为行情变好了。

## 行情

离职之前，我已经约了两个公司面试，信心十足，期望薪资也是 18k 及以上，但因为各种原因，这两家都没拿到 offer。5.10 -5.12 期间也陆续投简历，都是打水漂毫无回音...

我开始有一些慌，拿不到 offer 事小，一直没新的面试事情就大了。

5.13-5.14 周末两天，利用带娃的间隙，重写了简历，重新弄了排版，5.15-5.21 开始各种海投。

从 18-20k，到 16-18k，再到 10-15k，从 BOSS 到 51JOB，每天拿着手机就是开启“财富软件--BOSS 直聘”，没有放过一个“1 个月内活跃”的前端岗。

5.10-5.25 这十几天，两个平台汇总了一下，大概如下：

- BOSS 直聘：打招呼 300+，简历投递 28，约面试 9；
- 51JOB：简历投递 37，约面试 2；

## 面经

### 趴趴英语

和之前武汉分公司类似，这家也是上海总部在武汉开设分公司，刚开始招聘建设武汉团队。

约面试后，会发一封邮件，需要做一份 `ddl`，详细可以看我的[这篇文章](/posts/pnpm-workspace-monorepo)。

交完 `ddl` 后，顺利进入二轮线上复试，可能我的 `ddl` 写的稍有特色，前 40 分钟基本在聊实现的思路，后 20 分钟问了一些平时的项目实现。

从组建分公司的背景，到整个线上面试的对答如流，真的已经很稳很稳...

二面过了三天，HR 还没回复，我问了一下之后，才知道在我二面结束之后，另外一个招聘的团队发过 offer 的前端已经入职，HC 满了。

真是欲哭无泪...

### 雷神科技

远程初面，聊了近一个小时，面试官可能最新在用 `Nuxt` 写了些东西，大部分时间都问我 `SSR`、`SSG` 等概念和基础知识。好在我拿 `Nextjs` 写过两个项目，基本都能答上来。

过了一天后，HR 约现场复试，复试俩面试官，前后端 leader 聚齐了，分别问了：

- 事件委托/代理，会引申到 `Vue` `React` 等框架都用了事件委托，这样做法的好处是什么；
- nextTick 原理，会引申到事件循环机制；
- HTTP 缓存；
- BFC；
- flex grid 布局；
- HTTP Method 有哪些，再额外说下 `GET` 和 `POST` 区别；
- Vue 组件通讯；
- 函数式编程，例如：柯里化、偏函数、管道、组合等；
- 闭包原理、优缺点，需要举例实际的使用场景，如可以用来做缓存等；
- 输入域名到页面渲染的过程；
- 你已经有分配的任务了，中间穿插进来其他的任务，你怎么处理；
- 你和同事联调，需要改东西，怎么说服别人听取你的建议；

三面 HR，说了 18k 期望薪资，让回去等通知，无下文...

### 电讯盈科

共一面，全程面试官不断的吹水他自己手写的一套微前端，每次我回答完一个问题后，他就会调侃一遍：以你这 10 年开发经验，还有没有其他方法...

折腾来折腾去，也没问几个深入的问题：

- CSS 垂直居中，分别使用 flex、table、grid 等实现；
- CSS 左右两个非固定高度 div，让他们显示在一行并高度一致；
- js 从 1000 个长度的数组对象中找到值;
- Vue 组件通讯；
- Vue2 中给数组或对象添加/移除索引或属性；
- 对微前端的看法；

第三题还比较有意思，例如这样一个数组对象：

```js
const users = [
  {
    name: "张三",
    birthDay: "2023-05-01",
  },
  {
    name: "李四",
    birthDay: "2023-05-02",
  },
  {
    name: "王五",
    birthDay: "2023-05-02",
  },
  {
    name: "赵六",
    birthDay: "2023-05-03",
  },
  {
    name: "其他",
    birthDay: "2023-05-04",
  },
  // ...假设后面还有 1000+ 个 user
];

// 找到 birthDay === '2023-05-02' 的数据

// 第一种方法
// 这样会导致取一次值，都需要循环一遍数组
const filters = users
  .filter(({ birthDay }) => birthDay === "2023-05-02")
  .map(({ name }) => name);

// 第二种方法
// 数组转换为对象后，通过 key-value 取值，只用循环一次数组
const _users = users.reduce((acc, cur) => {
  acc[`${cur.birthDay}`] === undefined
    ? (acc[`${cur.birthDay}`] = [cur.name])
    : acc[`${cur.birthDay}`].push(cur.name);

  return acc;
}, {});

const found = _users["2023-05-02"];
```

### 微盟

微盟也要在武汉搞分公司，又和我上家公司如出一辙... 同样的武汉分公司，同样的从 0 到 1 组建团队，同样的微信/企微生态 SaaS...

不论经历还是业务，基本 99.99%的对口...

远程共一面，当天面我的老哥不知何种原因反正没到公司，等了 20 多分钟后，来了另外两个人面我。

由于上家公司履历和微盟特别对口，所以上来我们就直接开始聊业务，再加上微盟计划把企微（导购端）放到武汉分公司，所以全程 40 多分钟的时间，我俩都在聊企微小程序（导购端）这块的业务。

第二位面试官，上来问了一大堆 JS 基础的八股文，可惜没背全，有几个答的模棱两可...

- 小程序相关的问的比较多比较杂，更偏向业务，比较有意思的一个就是落地页转发的设计方案；
- js 原型链；
- new 操作符做了什么；
- js 如何实现继承；
- 如何实现深度克隆；
- JSON 序列化反序列深度克隆有哪些缺点；
- Promise all race 等 API；
- bind、call、apply 区别，如何实现 bind；
- JS 事件循环机制；
- 深度优先和广度优先，深度克隆是哪一种；
- 简单介绍下自己的工作流；

面完说是 3 个工作日回复，杳无音信...

### 湖北普罗格

一轮技术面，比较简单，全程我在说，面试官旁敲侧击的问问，双方大概比对了下技术栈是否对口。

二轮技术面，问的更多，几乎都是照着简历上的项目经验问你的各种业务实现逻辑，可能是核实简历的真实性？

三面人事聊薪资...

十分常规的面试，没有特别亮点的地方，唯一有意思的是这家公司投过我老东家的标，所以背调的时候非常顺利，成功拿到 offer。

### 盒马

5.22 邮箱收到盒马的`探花在线笔试通知`，当晚就爆出阿里大裁员... 得，咱重在参与吧...

第一题：

```js
/**
 * 写个转换函数，把一个 JSON 对象的 key 从下划线(Pascal)转换到小驼峰形式(Camel)
 *
 * 如：converter({ a_bc_def: 1 }) 返回 { aBcDef: 1 }
 */
function converter() {}
```

第二题：

```js
// 不使用 Array.flat()，实现一个数组平铺函数，使用方式和返回值和 Array.flat() 一样

const arr = ["hi", ["hello", 1], 2, [3, [4, [5]]]];

function flat(list, depth = 1) {}

flat(arr);
// 默认展开一层
// ["hi","hello",1,2,3,[4,[5]]]

flat(arr, 3);
// 第二个参数支持控制层级
// ["hi","hello",1,2,3,4,5]
```

第三题：

```js
// 输入项
const itemList = [
  {
    id: 4,
    parentName: "供应链属性",
    parentId: 0,
  },
  {
    id: 2,
    parentName: "供应链属性",
    parentId: 4,
  },
  {
    id: 5,
    parentName: "供应链属性",
    parentId: 0,
  },
  {
    id: 6,
    parentName: "供应链属性",
    parentId: 5,
  },
];

/**
 * 补充下面函数，函数返回示例如下
 */
function buildTree(list) {}

// 返回示例
// [
//   {
//     id: 4,
//     parentName: '供应链属性',
//     parentId: 0,
//     children: [{ id: 2, parentName: '供应链属性', parentId: 4 }],
//   },
//   {
//     id: 5,
//     parentName: '供应链属性',
//     parentId: 0,
//     children: [{ id: 6, parentName: '供应链属性', parentId: 5 }],
//   },
// ]
```

第四题：

```js
// 实现一个方法，检查一个 npm 包的依赖项中有没有存在循环依赖。
// 不用考虑版本，只考虑包名即可
// 入参 pkgs 为项目中所有的依赖（包括子依赖）
// 返回 boolean
// pkgs 数据结构即为 package.json 内容的数组, 如有三个包 a、b、c 则入参为：

const pkgs = [
  {
    name: "a",
    dependencies: {
      b: "^1.0.0",
    },
  },
  {
    name: "b",
    dependencies: {
      c: "^1.0.0",
    },
  },
  {
    name: "c",
    dependencies: {
      a: "^1.0.0",
    },
  },
];
```

答完交卷，杳无音信中...

### 斗半匠

在武汉这边，我觉得公司环境非常不错了，除了大小周和通勤距离较远这两个痛点，其他全是优点，顺利拿到 offer。

笔试、技术一面、技术二面、HR 面、技术终面共五面，笔试 10 道题，也是类八股文的题目，技术一二面围绕着这 10 题又发散了一些其他问题，如解答思路或者实际开发中的应对场景。

整个面试给我的感觉，不仅倾向于候选人的技术水平，还倾向于候选人的性格、沟通能力等等，

被问到最多的是让我说出自己的优缺点，除了笔试，其他四面都会问一遍...

### 知会数字科技

这是一家做音频会议相关业务的公司，软硬件团队都有，软件这块属于今年新成立的，需要扩招，整体非常年轻，顺利拿到 offer。

一面的小哥和和气气，面试题比较常规没有特别有亮点的地方，

二面项目负责人，算是我遇到过整体沟通最流畅，最舒服的面试官了，她很详细的介绍了音频这块软硬件公司的优势，以及互联网化的前景，倒是让我涨了不少见识。

### 上海新域信息

也是一家武汉分公司，武汉这边没有人事，只有几个研发，大概问了：

- Vue 组件通讯；
- ref/reactive 区别；
- Vue2/3 区别；
- CORS；
- SPA 的一些优化；
- SEO 优化；

面完说要反馈到上海那边的 HR，杳无音信中...