---
title: Django 静态文件处理
description: 如何在 Django 中配置静态文件，搭配 Nginx 在生产环境下进行访问。
pubDatetime: 2018-04-04T04:06:31Z
postSlug: how-to-handle-the-static-files-in-django
featured: false
draft: false
tags:
  - 指南
---

## Table of contents

## 配置 staticfiles

打开 `setting.py`，将 `django.contrib.staticfiles` 加入至 `INSTALLED_APPS` 中：

```diff title="settings.py"
# Application definition
INSTALLED_APPS = [
  'django.contrib.admin',
  'django.contrib.auth',
  'django.contrib.contenttypes',
  'django.contrib.sessions',
  'django.contrib.messages',
+ 'django.contrib.staticfiles',
  'blog',
  'django.contrib.sitemaps',
]
```

## STATIC_URL

```python
STATIC_URL = '/static/'
```

这里，为 `STATIC_URL` 设置的 `/static/`，指定的是：每个 APP 里面的静态资源目录。

拿我的个站来讲，ProjectName 为 mysite，用于处理个站博客相关的 AppName 为 blog，目录大概如下：

```shell
mysite/
    mysite/
        setting.py
        ...
    blog/
       static/ # 这个目录，便是我们所设置的 STATIC_URL
            blog/
                css/
                   main.css
                js/
                images/
        ...
manage.py
```

## LOAD STATIC

在模板中，我们首先需要加载 Django 的 `STATICFILES_STORAGE`

```diff title="base.html"
+ {% load static %}
<html>
  ...others
```

然后便可以使用 `{% static 'static_url' %}` 进行静态资源文件的加载

```html
<link href="{% static 'blog/css/main.css' %}?v=1.0.1" rel="stylesheet" />
```

在浏览器中，便会看到 `main.css` 的请求

![main.css](/images/how-to-handle-the-static-files-in-django/a311b0d8gy1fq0dx3gdqsj20p80izdhg.jpg)

## STATICFILES_DIR

通常静态资源文件，例如一些通用的 _.css、_.js、\*.png 等等，可能全部 APP 都要用到，如 bootstrap.min.css，将它在每个 `app/static/app_name/css/` 里面复制粘贴一遍？

这明显不对，那么 `STATICFILES_DIR` 就是用来存放这些公共静态资源文件，现在我们来配置它

```python
STATICFILES_DIR = [
  os.path.join(BASE_DIR, 'static')
]
```

这里配置的目录名称仍然叫做 `static` ,它位于整个 `Project` 的根目录

```shell
mysite/
     mysite/
         setting.py
         ...
      blog/
         static/ # STATIC_URL
              blog/
                  css/
                      main.css
                  js/
                  images/
manage.py
static/ # 这个目录，便是我们所设置的 STATICFILES_DIR
     lib/
        bootstrap-3.3.7/
             ...
             css/
               bootstrap.min.css
```

和加载 static/blog/css/main.css 一样，我们来加载 bootstrap.min.css

```html
<link
  href="{% static 'lib/bootstrap-3.3.7/css/bootstrap.min.css' %}"
  rel="stylesheet"
/>
```

## STATIC_ROOT

这个目录，是 `Django` 开发模式和生产模式区别最大的地方。

前面配置好了静态资源，`DEBUG = True` ，啊哈，所有文件加载都很正常！

当你部署至生产环境，`DEBUG = False`，啊哈，怎么这么多 404！

首先，你要明白，开发模式下，Django 会依据所给予的 `STATIC` 相关路径配置，查找相应的静态文件，并响应给客户端；

生产环境下，`Django` 不再处理静态资源文件，你需要让 WEB 服务器来处理这些静态文件。

但是呢，现在我们的文件分散在 `/mysite/blog/static/`、`/mysite/static/`，如果你正在使用 `Django admin`，那么 `admin` 相关的静态文件肯能还在 `Django pacakage` 源码里面呢！

因此，我们需要将这些**分散的静态资源文件收集到统一的位置**，这个位置便是：`STATIC_ROOT`

设置好 `STATIC_ROOT` 后，执行 `collectstatic`，所有你注册过的 APP 中所使用的静态文件均会收集到你所指定的 `STATIC_ROOT` 目录中，例如我使用了 `django.admin`、`ckeditor` 等：

```shell
python manage.py collectstatic
```

![collecstatic](/images/how-to-handle-the-static-files-in-django/a311b0d8gy1fq0eoizv66j20jw0b475d.jpg)

执行完毕后，在根目录，会新增一个 `static_cdn/`

![static_cdn](/images/how-to-handle-the-static-files-in-django/a311b0d8gy1fq0epp14evj207s0brjrq.jpg)

## NGINX

假设使用的 WEB 服务器是 `Nginx`，并且我们已经成功部署了该 `Django` 项目。

由于 `Django` 设置的 `STATIC_URL` 为 `/static/`，因此，客户端依然会和开发模式时一样，静态资源文件请求，仍然是按照 `server_name/static/app_name/xxx.css`

所以，我们需要将`/static/`的访问 alias 至 `/static_cdn/` 就可以了

```nginx
location /static/ {
  gzip_static on;
  expires max;
  add_header Cache-control public;
  alias /usr/share/nginx/mysite/static_cdn/;
}
```

```shell
service nginx reload
```

重新加载 `Nginx` 配置文件后，访问一下你的项目，所有静态资源文件都是 **200 OK**！
