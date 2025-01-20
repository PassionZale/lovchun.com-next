---
title: "搭建 LNMP 环境（Ubuntu 14.04）"
description: 基于 Ubuntu 14.04 安装 Linux、Nginx、MySQL、PHP 搭建 LNMP 技术栈
pubDatetime: 2018-07-27
slug: building-lnmp-environment
featured: false
draft: false
tags:
  - 指南
  - PHP
---

## LNMP

老生常谈的问题了，如果是第一次鼓捣服务器，折腾 PHP 环境，可能会比较痛苦，

本文基于 Ubuntu 14.04 的系统环境，假设你已登录至服务器。

## 安装 Nginx

```shell
sudo apt-get update
sudo apt-get install nginx
```

在 Ubuntu 14.04 中，Nginx 被配置为在安装时开始运行，

一旦它安装完毕，你即可直接在浏览器中访问服务器的 IP（公网） 地址。

如果你还不知道服务器的 IP（公网），在终端输入如下命令即可返回服务器的 IP：

```shell
ip addr show eth0 | grep inet | awk '{ print $2; }' | sed 's/\/.*$//'
```

![nginx](/images/building-lnmp-environment/nginx.png)

## 安装 MySQL

```shell
sudo apt-get install mysql-server
```

执行完这条命令后，会提示你设置一个 root 用户的密码，这个密码是 MySQL root 用户的密码，

MySQL 安装完成后，还需要对其进行一些配置：

```shell
sudo mysql_install_db
sudo mysql_secure_installation
```

这两行命令执行后，会让你输入一个密码（上一步设置的密码）。

此外，你还会被询问是否需要更改这个密码，你可以键入 **N** 或 **Y**，

然后一路 **Enter** 下去同意其他一些默认选项。

## 安装 PHP

由于 Nginx 不像其他一些 Web Server 那样包含本地 PHP 处理，因此我们需要安装：`php5-fpm` `php5-mysql`：

```shell
sudo apt-get install php5-fpm php5-mysql
```

## 配置 PHP 处理器

以 root 权限打开 php5-fpm 配置文件：

```shell
sudo nano /etc/php5/fpm/php.ini
```

在文件中找到 `cgi.fix_pathinfo` 参数，将其值设置为 **0**：

![fix_pathinfo](/images/building-lnmp-environment/fix_pathinfo.png)

每次修改 PHP 配置文件，都必须重启 `php5-fpm` 才能让新的配置生效：

```shell
sudo service php5-fpm restart
```

## 配置 Nginx 使用 PHP 处理器

执行 `sudo nano /etc/nginx/sites-available/default{:shell}` 打开 Nginx 默认站点配置文件，

通常你会看到如下默认配置：

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    root /usr/share/nginx/html;
    index index.html index.htm;

    server_name localhost;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

需要对其做一些配置，才能让 Nginx 能处理 `*.php` 文件：

1. 添加 `index.php` 允许在索引目录时提供 `*.php` 索引文件
2. 修改 `server_name` 指向服务器的域名或公网 IP
3. 启用 `error_page`
4. 添加 `try_files` 确保 Nginx 不会将错误的请求传递给 PHP

现在，该文件看起来会像这样：

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    root /usr/share/nginx/html;
    index index.php index.html index.htm;

    server_name server_domain_name_or_IP;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

重启或重载 `nginx.conf` 让新的配置生效：

```shell
# 重启
sudo service nginx restart
# 或重载
sudo service nginx reload
```

## 测试

```shell
sudo nano /usr/share/nginx/html/info.php
```

在该 `info.php` 文件中，我们写入 `phpinfo()`，该方法会打印出当前服务器 PHP 的环境：

```php
<?php
  phpinfo();
?>
```

在浏览器中访问该文件： `http://server_domain_name_or_IP/info.php`

![php info](/images/building-lnmp-environment/php-info.png)

如果看到这个页面，那么 LNMP 环境已搭建完毕！
