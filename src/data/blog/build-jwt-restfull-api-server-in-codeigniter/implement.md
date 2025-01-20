---
title: "基于 CodeIgniter 构建 JWT RESTfull API Server #2"
description: 将 codeigniter-restserver、php-jwt 集成至 CodeIgniter 3，接口业务等实现。
pubDatetime: 2018-03-15
slug: build-jwt-restfull-api-server-in-codeigniter/implement
featured: false
draft: false
tags:
  - 指南
  - PHP
---

> 源码参考：[JWT-RESTfull-IN-CI-Tutorial](https://github.com/PassionZale/JWT-RESTfull-IN-CI-Tutorial)

## 模拟业务场景

在 [上一篇](/posts/build-jwt-restfull-api-server-in-codeigniter/prerequisites) 我们已经做足了准备工作，并拟定了具体的业务场景：

1. 用户登录成功，颁发 TOKEN
2. 客户端每一次对 TODO 模型进行 CRUD 操作时，都会携带 TOKEN
3. 服务端会校验 TOKEN 合法性，给予响应请求的返回及数据库操作

在接下来的具体编码中，不会有表单验证、注册那些逻辑，

因为本文只是用于描述如何将 CI 集成为一个 JWT RESTfull API Repo。

## 定义模型

### User_model.php

User 模型中，一个简单的 login 方法用于对比账号密码是否正确，我们仅仅只是模拟一下 HTTP 请求进行了真实的数据库操作：

![user model](/images/build-jwt-restfull-api-server-in-codeigniter/user-model.png)

由于没有写注册逻辑，你应该在数据库中提前增加一条用户数据，如：

![user model table](/images/build-jwt-restfull-api-server-in-codeigniter/user-model-table.png)

### Todo_model.php

Todo 模型中，新增、删除、修改、查询单条记录、查询全部记录等操作：

![todo model](/images/build-jwt-restfull-api-server-in-codeigniter/todo-model.png)

## Authorization 辅助类

由于颁发 、验证 TOKEN 来自 JWT 类中的方法，为了能更方便的使用 JWT 类，我们可以在 CI 中封装自己的“辅助类”，自定义的辅助类放在 application/helpers/ 中。

在这个辅助类中，引入 JWT，并且在 Authorization 类中封装了两个方法：

1. `func validateToken` - 用于校验 TOKEN 的合法性
2. `func generateToken` - 用于颁发 TOKEN

![authorization](/images/build-jwt-restfull-api-server-in-codeigniter/authorization.png)

## Autoload 配置项

为了能更方便的使用数据库，不用反复写 `$this->load>library('database'){:php}`，

在 CI 中，我们可以将需要自动加载的特定 library、helper 等直接配置进 autoload 中。

![autoload](/images/build-jwt-restfull-api-server-in-codeigniter/autoload.png)

## Auth 控制器

准备了这么多，是时候写第一个控制器了，完成我们的场景一：

客户端发送 POST 请求，服务端通过 username & password 参数，颁发 TOKEN 返回给客户端。

![auth controller](/images/build-jwt-restfull-api-server-in-codeigniter/auth-controller.png)

接下来，我们需要在客户端中模拟这个“获取TOKEN”的 POST 请求。

打开接口调试工具，例如 Postman，我这里用的 [apizza](http://apizza.cc/)，

和 [上一篇](/posts/build-jwt-restfull-api-server-in-codeigniter/prerequisites) 一样，我们使用 `php -S localhost:8000{:shell}` 运行项目，

在 apizza 中模拟我们这次的请求：

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-1.png)

如果客户端传入的账户密码不存在，按照 Restfull 约定，服务端应该返回状态码为 401 Unauthorized：

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-2.png)

## Todo 控制器

该控制器会给予针对 Todo 模型的 CURD 操作的 API，通常服务端的 API URL 看起来应该像是这样的:

`http://example.com/api/`

CI 升级至 `3.*` 版本后控制器便能支持多级目录结构，现在我们来创建 Todo 控制器：

![todo controller](/images/build-jwt-restfull-api-server-in-codeigniter/todo-controller.png)

四个方法名分别对应了 GET、POST、PUT、DELETE 这四种请求方式。

### POST 请求

todo 表现在仍然是一张空表，因此，我们从 POST 请求开始，这个请求通常用来创建资源：

![todo post](/images/build-jwt-restfull-api-server-in-codeigniter/todo-post.png)

创建成功，接口将会返回 200 状态码，并将新创建的 todo 记录作为返回数据，

现在我们发出几次请求，让 API 为我们在数据库中插入 3 条记录：

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-3.png)

### GET 请求

现在表中有了 3 条记录，编写 GET 请求来进行获取资源：

1. 服务端查看 URL 中是否有 id 参数，如果有则返回该 id 的单条数据
2. 若没有，则返回全部数据，

当然这个示例并没有校验 id 的合法性，也没有处理 404 的错误，实际开发你应该补充这些逻辑：

![todo get](/images/build-jwt-restfull-api-server-in-codeigniter/todo-get.png)

**单条记录**

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-4.png)

**全部记录**

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-5.png)

### PUT 请求

PUT 通常用来修改某个指定的资源：

![todo put](/images/build-jwt-restfull-api-server-in-codeigniter/todo-put.png)

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-6.png)

### DELETE 请求

DELETE 用于删除指定的资源：

![todo delete](/images/build-jwt-restfull-api-server-in-codeigniter/todo-delete.png)

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-7.png)

## 钩子函数

至此，我们全部的 API 编写完毕，

接下来，也是最后一步，我们还需要加入钩子函数，校验令牌的合法性。

1. 再次打开 `application/config/config.php` 开启 `hooks`

![hook config](/images/build-jwt-restfull-api-server-in-codeigniter/hook-config.png)

2. 指定 hooks

CI 总共有 7 种钩子，这里我们选择 `post_controller_constructor`，

> 它会在你的控制器实例化之后立即执行，控制器的任何方法都还尚未调用

需要在钩子配置中指定我们将要使用的自定义钩子类以及执行的函数名称：

![hook use](/images/build-jwt-restfull-api-server-in-codeigniter/hook-use.png)

3. 编写 ApiAuthHook

![hook auth](/images/build-jwt-restfull-api-server-in-codeigniter/hook-auth.png)

## 保护路由

当我们再次访问任意一个 API 请求时，服务端会回应一个 400 的 Error Code：

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-8.png)

还记得第一个 `POST /auth/token` 吗？

这个请求服务端返回了 TOKEN，

在请求头中加入 `{ "Authorization": "bear TOKEN" }{:json}`

![apizza](/images/build-jwt-restfull-api-server-in-codeigniter/apizza-9.png)

接口正常返回了全部数据！

**为什么 bear 设置为 lovchun.com？**

前端需要通过 `cookie` 或者 `localstorage` 来存储 TOKEN，以此来保存调用接口的凭据，

试想一下，如果你的前端工程需要对接多个 API Server，

通过什么来标识 TOKEN 分别对应着哪个 Server ？

将 Authorization 的值用“唯一标识”+“一个英文空格”+“TOKEN”来存储，

服务端校验时，通过搜索该“唯一标识”的 Authorization 来获取 TOKEN。

_当然这个标识你完全可以自定义_

![jwt validate](/images/build-jwt-restfull-api-server-in-codeigniter/jwt-validate.png)

---

如果你是以 Apache 启动项目，Apache 会过滤掉请求头中的 Authorization 字段,

需要对根目录中的 `.htaccess` 进行修改才能让你的 Apache 正常接收 Authorization：

![.htaccess](/images/build-jwt-restfull-api-server-in-codeigniter/htaccess.png)
