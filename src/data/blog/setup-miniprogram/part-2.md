---
title: 构建小程序 - 异常、通讯、技巧
description: 分享一些小程序中自定义异常、页面之前的通讯以及实际开发中沉淀的技巧。
pubDatetime: 2022-07-03
slug: setup-miniprogram/part-2
column: setup-miniprogram
featured: false
draft: false
tags:
  - 指南
  - 微信小程序
---

![experience](/images/setup-miniprogram/experience.png)

## 目录

- [**《构建小程序 - 插件、目录、开发者工具、配置》**](/posts/setup-miniprogram/part-1)
- [**《构建小程序 - 异常、通讯、技巧》**](/posts/setup-miniprogram/part-2)
- [**《构建小程序 - 框架、Gulpjs、Task》**](/posts/setup-miniprogram/part-3)
- [**《构建小程序 - Generator》**](/posts/setup-miniprogram/part-4)
- [**《构建小程序 - CI》**](/posts/setup-miniprogram/part-5)

## 异常

联调接口时，通常后端会有一套通用的 `ResponseDTO`:

```ts
interface IBaseResponse<T = any> {
  /**
   * 业务状态码
   */
  code: number;
  /**
   * 响应数据
   */
  data: T;
  /**
   * 响应消息
   */
  message: string;
  /**
   * 响应时间戳
   */
  timestamp: number;
  /**
   * 自定义属性，如: path: string
   */
  [propName: string]: any;
}
```

在开发过程中，可能会有某些场景，期望 `Promise` 或者 `async function` 抛出一个异常：

```js
throw new Error("请求失败");
// 或
return Promise.reject("请求失败");
```

但是这样会导致我们自定义的异常和 API 的返回数据结构不一致，那么，我们就封装一个**自定义异常**进行统一:

### CustomException

```js
const EXCEPTION_ERROR_MESSAGE = "网络开小差~";

/**
 * 自定义异常, 数据结构与 IBaseResponse 相似
 * {
 *  "code": => 可选字段，非 200 的整数，默认为 5000
 *  "data": => 可选字段，用于自定义数据
 *  "message" => 必填字段，用于错误原因说明
 *  "timestamp" => 默认填充 当前时间戳（毫秒）
 *  "name" => 默认填充 'CustomException'
 * }
 */
class CustomException {
  constructor({ code = 5000, data, message }) {
    this.code = code;
    this.data = data;
    this.message = message || EXCEPTION_ERROR_MESSAGE;
    this.timestamp = +new Date();
    this.name = "CustomException";
  }
}

// ✅
throw new CustomException({ message: "自定义错误" });
// ❌
throw new Error("请求失败");
```

### SDKException

使用小程序 SDK 时，SDK 所给的 `error` 是这样的:

```json
{
  "errMsg": "openBluetoothAdapter:fail:not available",
  "errCode": 10001,
  "errno": 1500102
}
```

和 `IBaseResponse` 又有很大的差异，那么，我们就封装一个**SDK 异常**进行统一:

```js
const EXCEPTION_ERROR_MESSAGE = "网络开小差~";

/**
 * 自定义微信或企微 SDK 异常
 * https://developers.weixin.qq.com/miniprogram/dev/framework/usability/PublicErrno.html
 * {
 *  "errMsg": "openBluetoothAdapter:fail:not available",
 *  "errCode": 10001,
 *  "errno": 1500102,
 *  "code": => 可选字段，非 200 的整数，若设置了值，"errno" 和 "errCode" 会失效
 *  "data": => 可选字段，用于自定义数据
 *  "message": => 可选字段，用于捕获其他 js 错误，或自定义错误信息
 *  "timestamp" => 默认填 充当前时间戳（毫秒）
 *  "name" => 默认填充 'SDKException'
 * }
 */
class SDKException {
  constructor({ errMsg, errCode, errno, code, message, data }) {
    this.code = code || errno || errCode || 5000;
    this.data = data;
    this.message = message || errMsg || EXCEPTION_ERROR_MESSAGE;
    this.timestamp = +new Date();
    this.name = "SDKException";
  }
}
```

### 异常来源

**通过`instanceof`判断（:thumbsup: 推荐）**

```js
async function foo() {
  try {
    await bar();
  } catch (exception) {
    if (exception instanceof CustomException) {
      // 是我的自定义异常
    } else {
      // 不是我的自定义异常 <= Uncaught ReferenceError: bar is not defined
    }
  }
}
```

**通过`name`判断**

```js
async function foo() {
  try {
    await bar();
  } catch (exception) {
    if (exception.name === "CustomException") {
      // 是我的自定义异常
    } else {
      // 不是我的自定义异常 <= Uncaught ReferenceError: bar is not defined
    }
  }
}
```

### :zap: 额外小心

小程序的 SDK 会返回所有的错误，**包括：取消、拒绝等**，在捕获 `SDKException` 需要过滤掉这类场景:

```js {12,13}
/**
 * 拨打电话
 * @param {string} phoneNumber 电话号码
 */
export async function makePhoneCall(phoneNumber) {
  if (typeof phoneNumber !== "string")
    throw new SDKException({ message: "phoneNumber must be string" });

  try {
    await wx.makePhoneCall({ phoneNumber });
  } catch (error) {
    // exclude "取消" 的场景
    if (!error.errMsg || error.errMsg.indexOf("fail cancel") === -1) {
      wx.showToast({ title: error.errMsg, icon: "none" });

      throw new SDKException(error);
    }
  }
}
```

## 通讯

### queryParams

> **pageA** `navigateTo` **pageB** （最基本的通讯方式）

```js title="pageA.js"
Page({
  methods: {
    handleTap() {
      wx.navigateTo({ url: `pageB?foo=bar` })
    }
  }
})
```

```js title="pageB.js"
Page({
  onLoad(options) {
    const { foo } = options // <== foo is 'bar'
  }
})
```

### variableStorage

> **orderList** set data, **orderDetail** get data（适合一次性通讯复杂的数据结构）

#### 定义 storage class

```js title="_shared/helpers/storage.js"
/**
 * Storage
 *
 * @desc      内存存储，主要用于跨页面参数的传递
 */

import { CustomException } from './utils'

class Storage {
  constructor(options) {
    const { snapchat = false } = options || {}

    this.snapchat = snapchat
    this.data = {}
  }

  set(key, value) {
    if (!key) {
      throw new CustomException({ message: 'key 不能为空' })
    }

    this.data[String(key)] = value
  }

  get(key) {
    const value = key ? this.data[String(key)] : this.data

    if (this.snapchat) {
      this.removeItem(key)
    }

    return value
  }

  removeItem(key) {
    delete this.data[String(key)]
  }

  clear() {
    this.data = {}
  }
}

export default Storage
```

#### 定制专属 store

```js title="_shared/stores/order.js" {3,4,16,17}
import Storage from '../helpers/storage'

// 保证每个 store module 都是全新的 Storage 实例
const storage = new Storage({ snapchat: true })

class Store {
  get orderSourceData() {
    return storage.get('data')
  }

  set orderSourceData(val) {
    storage.set('data', val)
  }
}

// 导出 Order Store 实例
export default new Store()
```

```js title="orderList.js" {10-12}
import OrderStore from '@/_shared/stores/order'
import { useRequest } from '@/_shared/helpers/request'

Page({
  methods: {
    async handleDetail({ currentTarget: { dataset: { orderNo }}}) {
      const [err, res] = await useRequest('api/v1/order/detail', { orderNo })

      if(!err) {
        // 写入 orderSourceData
        OrderStore.orderSourceData = this.data.orders[index]
        wx.navigateTo({ url: `orderDetail` })
      } else {
        // error handler
      }
    }
  }
})
```

```js title="orderDetail.js" {5,6}
import OrderStore from '@/_shared/stores/order'

Page({
  onLoad() {
    // 读取 orderSourceData
    const data = OrderStore.orderSourceData
  }
})
```

### 发布订阅

> pageA `navigateTo` pageB （**先订阅后发布**）

#### eventBus

有很多实现方式，这里简单展示项目中使用的模块示例：

```js title="_shared/helpers/eventBus.js"
const notices = []

// 注册通知
export function on(name, observer, selector) {
  if (name && observer && selector) {
    const newNotice = {
      name,
      observer,
      selector
    }

    add(newNotice)
  }
}

// 移除通知（observer按name）
export function off(name, observer) {
  wx.nextTick(() => {
    // 以防post过程中同时remove
    for (let i = notices.length - 1; i >= 0; i--) {
      const inNotice = notices[i]

      if (inNotice.name == name && inNotice.observer == observer) {
        notices.splice(i, 1)
      }
    }
  })
}

// 移除通知（observer所有）
export function clean(observer) {
  wx.nextTick(() => {
    // 以防post过程中同时remove
    for (let i = notices.length - 1; i >= 0; i--) {
      const inNotice = notices[i]

      if (inNotice.observer == observer) {
        notices.splice(i, 1)
      }
    }
  })
}

// 发送通知
export function emit(name, info) {
  for (let i = 0; i < notices.length; i++) {
    const inNotice = notices[i]

    if (inNotice.name == name) {
      inNotice.selector(info)
    }
  }
}

// 加入通知数据
function add(newNotice) {
  if (notices.length > 0) {
    for (let i = 0; i < notices.length; i++) {
      const inNotice = notices[i]

      if (
        inNotice.name == newNotice.name &&
        inNotice.selector == newNotice.selector &&
        inNotice.observer == newNotice.observer
      ) {
        return
      }
    }
  }

  notices.push(newNotice)
}
```

#### eventKeys

**不要使用魔法字符**，使用**常量**：

```js title="@/_shared/constants/eventKeys.js"
/**
 * 订单已操作，例如：取消、支付、申请售后等
 */
export const ORDER_OPERATED = 'orderOperated'
```

#### 订阅事件

**先订阅（orderList 在 orderDetail 之前）**

```js title="orderList.js" {5,7,14,16}
import * as eventBus from '@/_shared/helpers/eventBus'
import * as eventKeys from '@/_shared/constants/eventKeys'

Page({
  // 若在 Component 中使用，生命周期函数为 attached
  onLoad() {
    eventBus.on(eventKeys.ORDER_OPERATED, this, (payload) => {
      console.log(payload) // <= { foo: 'bar' }

      this.reloadData()
    })
  },

  // 若在 Component 中使用，生命周期函数为 detached
  unUnload() {
    eventBus.clean(this)
  }
})
```

**后发布（orderDetail 在 orderList 之后）**

```js title="orderDetail.js" {12-16}
import * as eventBus from '@/_shared/helpers/eventBus'
import * as eventKeys from '@/_shared/constants/eventKeys'

Page({
  methods: {
    async handleCancel() {
      const { orderNo } = this.data

      const [err, res] = await useRequest('api/order/cancel', { orderNo })

      if(!err) {
        eventBus.emit(
          eventKeys.ORDER_OPERATED,
          // ↓↓↓↓ any paylod you want to pass ↓↓↓↓
          { foo: 'bar' }
        )
      }
    }
  }
})
```

## 技巧

### CSS Reset

```css title="@/_shared/styles/reset.scss"
page,
view,
scroll-view,
swiper,
swiper-item,
movable-area,
movable-view,
cover-view,
cover-image,
icon,
text,
rich-text,
progress,
button,
checkbox-group,
checkbox,
form,
input,
label,
picker,
picker-view,
radio-group,
radio,
slider,
switch,
textarea,
navigator,
functional-page-navigator,
image,
video,
camera,
live-player,
live-pusher,
map,
canvas,
open-data,
web-view,
ad {
  box-sizing: border-box;

  &::after {
    box-sizing: border-box;
  }

  &::before {
    box-sizing: border-box;
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

button {
  outline: 0;
  border: none;

  &::after {
    border: none !important;
  }
}
```

```css title="@/src/app.scss"
@import '@/_shared/styles/reset.scss';

page {
  background-color: $bg-color-default;
  width: 100vw;
  min-height: 100vh;
}
```

### 安全区适配

```css title="@/src/app.scss"
/* other stylesheet...  */

@supports (bottom: constant(safe-area-inset-bottom)) {
  .safe-area {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
@supports (bottom: env(safe-area-inset-bottom)) {
  .safe-area {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

**页面中使用**

```html {2}
<view class="page">
  <view class="safe-area" />
</view>
```

**组件中使用**

> [引用页面或父组件的样式](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E5%BC%95%E7%94%A8%E9%A1%B5%E9%9D%A2%E6%88%96%E7%88%B6%E7%BB%84%E4%BB%B6%E7%9A%84%E6%A0%B7%E5%BC%8F)

```html {2}
<view class="component">
  <view class="~safe-area" />
</view>
```

### Page Enhancer

某些场景，我们可能需要去增强 Page，例如：

- 在所有 `Page` 重写生命周期钩子；
- 在所有 `Page` 中填充 `data` 属性；
- etc...

还记得 `React` 中的 `HOC` 吗？

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

参考 `HOC`，我们可以编写一个 `Enhancer` 来增强小程序的 `Page` (`Component` 同理)：

```js title="@/_shared/helpers/pageEnhancer.js"
import * as eventBus from '@/_shared/helpers/eventBus'
import * as eventKeys from '@/_shared/constants/eventKeys'

const PageEnhancer = props => {
  // 重写生命周期钩子，并订阅某个事件
  const { onLoad, onUnload } = props

  onLoad && delete props.onLoad
  onUnload && delete props.onUnload

  props.onLoad = function() {
    eventBus.on(eventKeys.EVENT_KEY, this, (payload) => {
      // do something...
    })

    // 执行原本的 onLoad() 逻辑
    onLoad && onLoad.apply(this, arguments);
  };

  props.unUnload = function() {
    eventBus.off(eventKeys.EVENT_KEY, this)

    // 执行原本的 onUnload() 逻辑
    onUnload && onUnload.apply(this, arguments);
  }

  // 填充 data
  props.data.foo = 'bar'

  return props
}

export default PageEnhancer
```

```js title="page.js" {3,11}
import PageEnhancer from '@/_shared/helpers/pageEnhancer'

const props = PageEnhancer({
  // 全部的 Page 属性
  data: { id: 1 },
  onLoad(options) {},
  onUnload() {},
  methods: {}
})

Page(props)
```

### SDK Promisify

虽然现在大部分 SDK 支持**异步**，但仍然有少量不支持，例如：`wx.login` 等，只能使用`回调`函数的形式处理 SDK 的成功与失败：

```js
wx.login({
  success(res) {
    if (res.code) {
      //发起网络请求
      wx.request({
        url: "https://example.com/onLogin",
        data: {
          code: res.code,
        },
      });
    } else {
      console.log("登录失败！" + res.errMsg);
    }
  },
});
```

现在对 `wx.login` 做一个 `Promise` 的异步封装：

```js
const wxLogin = () =>
  new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      },
    });
  });
```

如果项目中使用了 10 个 SDK 的调用，代码会变成... :confused:

```js
const sdk1 = () => new Promise((resolve, reject) => {
  sdk1({
    success: () => resolve(),
    fail: () => reject()
  })
}

const sdk2 = () => new Promise((resolve, reject) => {
  sdk2({
    success: () => resolve(),
    fail: () => reject()
  })
}

const sdk3 = () => new Promise((resolve, reject) => {
  sdk3({
    success: () => resolve(),
    fail: () => reject()
  })
}

// sdk 4-10...
```

参照 `Nodejs` 中的 [`util.promisify(original)`](https://nodejs.org/dist/latest-v16.x/docs/api/util.html#utilpromisifyoriginal)，封装一个简易的 `promisify()`：

```js title="@/_shared/helpers/utils.js"
/**
 * 将回调形式的函数做一个 promise 封装
 * @param {*} func
 * @returns {Promise}
 */
export const promisify = fn => options =>
  new Promise((resolve, reject) => {
    fn({
      ...options,
      success: resolve,
      fail: reject
    })
  })
```

```js title="@/_shared/helpers/wechat.js"
import { promisify } from '@/_shared/helpers/utils'

export const wxLogin = promisify(wx.login)
export const wxCheckSession = promisify(wx.checkSession)
export const wxGetUserProfile = promisify(wx.getUserProfile)
export const wxGetSetting = promisify(wx.getSetting)
export const wxOpenSetting = promisify(wx.openSetting)

// usage example:
// async func() {
//   const { authSetting } = await wxOpenSetting()
// }
```

### SDK ApplyPermission

在小程序中，很多针对客户端的 SDK，都需要**申请权限**，例如：获取地理位置、选择微信地址、添加联系人到通讯录、保存图片至相册 等...

某些 SDK 一旦用户拒绝，再次调用时会直接报错而不会再执行后面的逻辑，

此时，我们需要引导用户打开小程序**设置页**，开启对应权限。

完整的 `SDK ApplyPermission` 示例：

```js
/**
 * 保存图片至手机相册
 * !!!延用 success fail 回调函数，是为了覆盖 sdk 默认的 toast 交互提示!!!
 * @param {function} success 接口调用成功的回调函数
 * @param {function} fail 接口调用失败的回调函数
 * @returns {Promise}
 */
export async function saveImageToPhotosAlbum({ success, fail, ...options }) {
  const scope = "scope.writePhotosAlbum";

  const applyPermissionMsg =
    "您未开启保存图片到相册的权限，请点击确定去开启权限！";

  const noPermissionMsg = "未开启保存图片到相册的权限";

  let canIUse = false;

  try {
    const { authSetting } = await wxGetSetting();

    // 用户已拒绝权限，则为 false
    // 首次申请权限，则为 undefined，微信会自动发起一次授权
    if (authSetting[`${scope}`] === false) {
      // wx.openSetting() 必须由用户 tap 触发，必须写为同步函数
      wx.showModal({
        title: "提示",
        content: applyPermissionMsg,
        success: async res => {
          if (res.confirm) {
            const { authSetting } = await wxOpenSetting();

            if (authSetting[`${scope}`]) {
              canIUse = true;
            } else {
              fail
                ? fail(new SDKException({ message: noPermissionMsg }))
                : wx.showToast({ title: noPermissionMsg, icon: "none" });
            }
          }
        },
      });
    } else {
      canIUse = true;
    }

    if (canIUse) {
      const result = await promisify(wx.saveImageToPhotosAlbum)(options);

      success
        ? success(result)
        : wx.showToast({
            title: "图片已保存相册，请在手机相册查看",
            icon: "none",
          });
    }
  } catch (error) {
    // exclude "取消保存" 的场景
    if (!error.errMsg || error.errMsg.indexOf("fail cancel") === -1) {
      fail
        ? fail(new SDKException(error))
        : wx.showToast({ title: error.errMsg, icon: "none" });
    }
  }
}
```

以上是我在小程序实际开发过程中，为数不多但又较为常见的经验总结。

欢迎你提交 `Pull Request` 和我一起完善。:tada: :tada: :tada:
