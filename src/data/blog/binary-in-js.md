---
title: JS 中的二进制
pubDatetime: 2022-08-17
slug: binary-in-js
featured: false
draft: false
tags:
  - 指南
description: 通过 ArrayBuffer、Blob、File、FileReader、URL 等处理 Base64 的转换，以及图片的预览、上传、下载等。
---

> **在实际开发过程中，Base64 经常会用于处理图片的预览、上传、下载等。**
>
> - `FileReader.readAsDataURL()` 触发 `loaded`，并在回调中获取到 `data:URL`
> - `convertBase64ImageData()` 解析 `data:URL`，拿到 `base64Data` `contentType`
> - `base64ToBlob()` 将 `base64Data` 转换为 `Blob`
> - `FormData().append()` 可用于上传
> - `URL.createObjectURL()` 可用于下载

## 原生 Base64 编码和解码

从 IE10+浏览器开始，所有浏览器就原生提供了 Base64 编码解码方法，不仅可以用于浏览器环境，Service Worker 环境也可以使用。

它们就是 `atob` 和 `btoa`:

- `a` 表示 Base64 字符串
- `b` 表示 普通字符串

```js
window.btoa("lovchun.com"); // bG92Y2h1bi5jb20=

window.atob("bG92Y2h1bi5jb20="); // lovchun.com
```

## 预览图片

- 监听 `<input type="file" />` 的 `onchange` 拿到选中的 `File` 对象；

- 使用 `FileReader` 的 `readAsDataURL` 并在 `load` 事件中获取到 `data:URL` 格式的字符串（base64 编码）；

- 将 `data:URL` 赋值到 `img.src` 即可预览图片；

```js title="FileInput.jsx"
import React, { useState } from "react";
import Image from "next/image";

const FileInput = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onChange = e => {
    const file = e.target.files[0];

    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.addEventListener(
      "load",
      () => {
        setSelectedFile(reader.result);
      },
      false
    );
  };

  return (
    <form className="flex items-center space-x-6 py-6">
      <div className="shrink-0">
        {selectedFile && (
          <Image
            className="h-16 w-16 object-cover"
            src={selectedFile}
            alt="upload-image"
            width={100}
            height={100}
          />
        )}
      </div>
      <label className="block">
        <input
          type="file"
          onChange={onChange}
          className="block w-full text-sm text-gray-900 file:mr-4
              file:rounded-full file:border-0 file:bg-cyan-500
              file:px-4 file:py-2
              file:text-sm file:font-semibold
              file:text-white dark:text-gray-300
              dark:file:bg-gray-700 dark:file:text-gray-400
            "
        />
      </label>
    </form>
  );
};

export default FileInput;
```

## 上传图片

### 从 data:URL 中解析出 base64Data 和 contentType

```js title="convertBase64ImageData"
/**
 * data:image/jpeg;base64,XXXXXX
 *
 * 解析成
 *
 * {
 *    base64Data: 'XXXX',
 *    contentType: 'image/jpeg'
 * }
 */
function convertBase64ImageData(base64Url) {
  const arr = base64Url.split(",");

  const [metaData, base64Data] = arr;

  const contentType = metaData.match(/:(.*?);/)[1];

  return {
    base64Data,
    contentType,
  };
}
```

### 将 base64Data 和 contentType 转换为 Blob

```js title="base64ToBlob"
function base64ToBlob(base64Data, contentType = "") {
  // atob 将 base64 字符串解码为新的字符串
  const byteCharacters = atob(base64Data);

  // 使用 charCodeAt 将 byteCharacters 中的每个字节添加到 byteNumbers
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // new TypedArray() 创建 ArrayBuffer 的视图
  const byteArray = new Uint8Array(byteNumbers);

  // 创建 blob
  const blob = new Blob([byteArray], { type: contentType });

  return blob;
}
```

### 使用 FormData.append() 添加 Blob

```diff title="FileInput.jsx"
const onChange = (e) => {
  const file = e.target.files[0]

  const reader = new FileReader()

  if (file) {
    reader.readAsDataURL(file)
  }

  reader.addEventListener(
    'load',
    () => {
      setSelectedFile(reader.result)

+      const {
+        base64Data,
+        contentType
+      } = convertBase64ImageData(reader.result)
+      const blob = base64ToBlob(base64Data, contentType)

+      const formData = new FormData()
+      formData.append('file', blob) // 《== 上传参数
    },
    false
  )
}
```

## 下载图片

在某些情况中，我们可能需要使用 JS 去下载 `data:URL` 的图片，例如：**小程序太阳码**

小程序太阳码，由微信直接返回 `data:URL` 字符串，如果需要下载它：

- `data:URL` 转换为 `Blob`；

- `URL.createObjectURL` 引用 `Blob`；

- 创建 `<a />` 标签触发点击，完成下载；

```js title="downloadBlob"
const downloadBlob = (blob, filename) => {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // for IE
    window.navigator.msSaveOrOpenBlob(blob, filename);
    return;
  }

  let downloadLink = document.createElement("a");
  let downloadURL = URL.createObjectURL(blob);

  downloadLink.href = downloadURL;
  downloadLink.download = filename;
  downloadLink.click();

  setTimeout(() => {
    downloadLink = null;
    // URL.createObjectURL() 每次调用，都会创建一个新的 URL 对象
    // 每个 URL 对象必须调用 revokeObjectURL() 来释放内存
    URL.revokeObjectURL(downloadURL);
    downloadURL = null;
  }, 1000);
};
```
