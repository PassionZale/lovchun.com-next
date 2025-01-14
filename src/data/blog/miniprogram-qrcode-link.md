---
title: 小程序码与小程序链接
description: 完整的梳理微信小程序中各种链接、太阳码、二维码等。
pubDatetime: 2023-09-12T04:06:31Z
postSlug: miniprogram-qrcode-link
featured: false
draft: false
tags:
  - 指南
  - 微信小程序
---

## 统计

| 名称                 | 接口名称                                                                                                                       | 过期             | 数量         |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :--------------- | :----------- |
| 获取小程序码         | [getQRCode](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getQRCode.html)                    | 永久有效         | 100,000      |
| 获取不限制的小程序码 | [getUnlimitedQRCode](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html)  | 永久有效         | N/A          |
| 获取小程序二维码     | [createQRCode](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/createQRCode.html)              | 永久有效         | 100,000      |
| URL Link             | [generateUrlLink](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-link/generateUrlLink.html)       | 最长30天，可配置 | 500,000/天   |
| URL Scheme           | [generateScheme](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-scheme/generateScheme.html)       | 最长30天，可配置 | 500,000/天   |
| Short Link（短期）   | [generateShortLink](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/short-link/generateShortLink.html) | 30天             | 1,000,000/天 |
| Short Link（长期）   | [generateShortLink](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/short-link/generateShortLink.html) | 永久有效         | 100,000      |

## 获取小程序码

> [getQRCode](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getQRCode.html)

由于每个小程序只能生成**10w 次**，此接口在开发中几乎很少使用。

该接口方便的地方在于，整个 `path` 参数可以支持最大**1024**字节长度，例如：

```json
{
  "path": "pages/index/index?foo=bar&foo=bar&..."
}
```

## 获取不限制的小程序码

> [getUnlimitedQRCode](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html)

此接口经常用于各种推广场景生成小程序太阳码，例如：推广海报。

相比于[getQRCode](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getQRCode.html)，你不能直接传递完成的 `path`，需要传入 `page` 和 `scene` 来替代，例如：

```json
{
  "page": "pages/index/index",
  "scene": "XXXXX"
}
```

- `page` 不能携带参数
- `scene` 最大 32 个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()\*+,/:;=?@-.\_~

### 最佳实践

在实际的小程序开发中，例如：商品详情页，会使用自定义图片、商详数据、太阳码合成推广海报，

将推广海报转发给微信好友后，微信用户通过识别海报中的太阳码进入商品详情。

1. 由于请求商品详情数据的入参可能有许多个键值对，因此需要让服务端的同事将这些键值对转换成 `scene`：

```js
const payload = {
  productId: 1,
  shareUserId: 1,
  skuId: 1,
  // etc...
};

const { scene } = await encodeSceneApi(payload);
```

2. 再通过 `path` 和 `scene` 换取太阳码：

```js
const wxacode = await commonQrcodeApi({
  path: "product/pages/index",
  scene,
});
```

> 大部分情况，`1`， `2` 两步都会被整合成一个接口让前端调用。

3. 识别太阳码进入页面，通过 `scene` 换取对应的参数：

```js
async onLoad(options) {
  const { scene } = options

  const payload = await decodeSceneApi(scene) // <-- { productId, shareUserId, skuId }

  const sourceData = await getProductDetailApi(payload)
}
```

## 获取小程序二维码

> [createQRCode](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/createQRCode.html)

由于每个小程序只能生成**10w 次**，此接口在开发中几乎很少使用。

对于二维码来讲，有很多方法可以直接生成，实际场景中使用更多的是替换为**配置**[扫普通链接二维码打开小程序](https://developers.weixin.qq.com/miniprogram/introduction/qrcode.html)，

**扫普通链接二维码打开小程序**缺点也有一些，例如：

- 需要将校验文件放到根路径下（类似配置 webview 合法域名）；
- 规则至多配置 100 条；
- 每月至多发布 100 次；

## URL Link

> [generateUrlLink](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-link/generateUrlLink.html)

**该接口适合不想自己实现短链接转长链接，直接使用微信的短链接**

通过此接口会得到一个**短链接**，例如：

`https://wxaurl.cn/*TICKET*` 或 `https://wxmpurl.cn/*TICKET*`

最常见的场景是将该**短链接**拼接在短信中，让用户在短信中直接打开小程序，例如：

- 点击营促销推广短信，进入促销活动详情；
- 点击订单状态变化短信，进度订单详情；
- 等等...

## URL Scheme

> [generateScheme](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-scheme/generateScheme.html)

**该接口适合自己已实现短链接转长链接**

通过此接口会得到一个协议链接，例如：

`weixin://dl/business/?t= *TICKET*`

常见的使用场景同 `URL Link`，将链接放到短信中，但是由于 Android 点击无法打开小程序，因此需要使用 `H5` 做跳转。

```js
location.href = "weixin://dl/business/?t= *TICKET*";
```

## Short Link

> [generateShortLink](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/short-link/generateShortLink.html)

通过此接口会得到一个类似**口令**的文本，例如：

`#小程序://小程序示例/示例页面/9pZvnVw3KMCQpVp`

就和淘宝口令类似，将 `Short Link` 在微信中发送给好友或者朋友圈，其他用户点击即可直接打开小程序对应的落地页。
