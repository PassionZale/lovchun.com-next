---
title: "基于 CodeIgniter 构建 JWT RESTfull API Server #1"
description: 将 codeigniter-restserver、php-jwt 集成至 CodeIgniter 3，项目及环境初始化。
pubDatetime: 2018-03-14
slug: build-jwt-restfull-api-server-in-codeigniter/prerequisites
featured: false
draft: false
tags:
  - 指南
  - PHP
---

> 源码参考：[JWT-RESTfull-IN-CI-Tutorial](https://github.com/PassionZale/JWT-RESTfull-IN-CI-Tutorial)

## CodeIgniter

以 3.1.7 版本为例，下载地址：[codeigniter.org.cn](https://codeigniter.org.cn/)。

下载后，解压至当前文件夹，你会得到一个 `CodeIgniter-3.1.7` 的文件夹，

将它重命名为你喜欢的项目名，我重名为 `JWT-RESTfull-IN-CI-Tutorial` ，如图所示：

![codeigniter](/images/build-jwt-restfull-api-server-in-codeigniter/codeigniter.png)

## 启动项目

接下来，用 IDE 或者其他什么，例如 PhpStorm、NetBeans、Sublime 等打开这个 CI 项目，当然我这里用的 VScode，不过都差不多了。

打开 vscode 的终端，或者 cmd 都可以，只要可以跑命令行，启动 PHP 的内置服务器就行，确保你已经把 php 添加进了你的环境变量。

在项目的根目录，就是 `index.php` 所在的目录下键入：`php -S localhost:8000{:shell}`

![start server](/images/build-jwt-restfull-api-server-in-codeigniter/start-server.png)

在浏览器中访问 [http://localhost:8000](http://localhost:8000)，你就会看到 **CodeIgniter Welcome Page**：

![welcome](/images/build-jwt-restfull-api-server-in-codeigniter/welcome.png)

如果你不想使用 PHP 内置 Web Server，你可以使用 Apache、Nginx 等启动项目。

## FIRBASE/PHP-JWT

首先，需要找到一个 PHP 的 JWT Package，

这样我们只需要将这个包引入到项目中就可以直接使用了。

1. 访问 [jwt.io](https://jwt.io)
2. 点击 Libraries 导航，下面列出的就是各个语言所写的相关轮子
3. `CTRL + F{:shell}`，在当前页面中直接搜索“php”，找到 star 数最高的 `firbase/php-jwt`
4. 前往 [firbase/php-jwt](https://github.com/firebase/php-jwt)，阅读下 README，对它有个大致了解

![firbase/php-jwt](/images/build-jwt-restfull-api-server-in-codeigniter/firbase-php-jwt.png)

PHP-JWT 除了可以直接通过 `Composer` 安装，也可以将它的源码直接下载下来，

[firbase/php-jwt](https://github.com/firebase/php-jwt) 这里有4个 php 文件，将它们下载或复制，放到 `application/libraries/` 中：

![library](/images/build-jwt-restfull-api-server-in-codeigniter/library.png)

由于我不是通过 `Composer` 安装的，所以在 `JWT.php` 中需要手动 `require` 其他的三个文件：

![require](/images/build-jwt-restfull-api-server-in-codeigniter/require.png)

除此之外，`jwt` 也需要配置一个密钥用于生成 `token` 值，

在 CI 的配置文件目录 `application/config/` 中创建配置文件 `jwt.php`：

![jwt](/images/build-jwt-restfull-api-server-in-codeigniter/jwt.png)

## CODEIGNITER-RESTSERVER

[codeigniter-restserver](https://github.com/chriskacerguis/codeigniter-restserver) 这是专为 CI 所造的 `restserver package`，

使用它可以很方便的接收或者处理 Restfull 风格的 HTTP 请求。

这个源码其实就是一个引入 [codeigniter-restserver](https://github.com/chriskacerguis/codeigniter-restserver) 后的 CI 项目，它的实际源码总共有4个：

1. [REST_Controller.php](https://github.com/chriskacerguis/codeigniter-restserver/tree/master/application/libraries/REST_Controller.php) - RestServer 的主控制器，你需要将自己编写的业务控制器继承它，就和继承 CI_Controller 一样
2. [Format.php](http://github.com/chriskacerguis/codeigniter-restserver/tree/master/application/libraries/Format.php) - 用于格式化响应数据，可以格式化为 `json` `array` `csv` `html` `php` `xml`，默认为 `json`
3. [rest.php](http://github.com/chriskacerguis/codeigniter-restserver/tree/master/application/config/rest.php) - RestServer 的配置文件，类似 CI 中的大部分配置文件
4. [rest_controller_lang.php](https://github.com/chriskacerguis/codeigniter-restserver/tree/master/application/language/english/rest_controller_lang.php) - RestServer 的国际化配置项，里面包含了10来种语言，这里我暂时只选择 `english`

将它们分别放入对应的目录中：

![restserver-library](/images/build-jwt-restfull-api-server-in-codeigniter/restserver-library.png)

![restserver-config](/images/build-jwt-restfull-api-server-in-codeigniter/restserver-config.png)

![restserver-lang](/images/build-jwt-restfull-api-server-in-codeigniter/restserver-lang.png)

它没有一个非常详细的文档，但是有一个简单的使用教程：[code.tutsplus.com](https://code.tutsplus.com/tutorials/working-with-restful-services-in-codeigniter--net-8814),

不过源码中的注释非常非常的详细，总的来讲还是很容易就能理解的。

## 基础表结构

为了真实的模拟 HTTP 请求，以及实际的业务场景，现在我们来建一个非常简单的 todos 表：

![todo](/images/build-jwt-restfull-api-server-in-codeigniter/todo.png)

建表后，别忘了在 `application/config/database.php` 中填入你当前的数据库相关配置。

我们已经在 CI 中加入了 `php-jwt` `codeigniter-restserver`，并建好了数据库表、配置了数据库链接。

---

所有准备工作已经就绪了，接下来，在 [下一篇](/posts/build-jwt-restfull-api-server-in-codeigniter/implement) 我将模拟具体的业务场景实现如下业务：

1. 用户登录，服务端校验账户和密码，成功则返回当前这个用户的 `json web token`
2. 用户可以对 todo 表进行 CRUD，在 CRUD 操作时，校验 `json web token` 是否合法