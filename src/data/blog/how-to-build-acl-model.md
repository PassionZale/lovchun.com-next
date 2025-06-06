---
title: ACL - Access Control List
description: 构建 ACCESS CONTROL LIST 模型。
pubDatetime: 2018-03-30
slug: how-to-build-acl-model
featured: false
draft: false
tags:
  - 指南
---

## 前言

一个基本的 ACCESS CONTROL LIST 会基于 “用户”、“角色”、“权限”三个模型：

1.“用户”不直接获得“权限”，而是通过“用户”所属“角色”来继承该“角色”所拥有的“权限”；

2.“角色”直接获得“权限”。

## 用户（USER）

用户模型，仅仅用于 AUTH 认证，最常见的是“登录校验”这块。例如一个 CMS 管理系统后台，USER 最常见的字段有 `username`、`password` 等等：

## 角色（ROLE）

角色模型，是系统为某个权限集合所定义的“权限集合”名称，你可以理解为“权限组”。

例如“运营员”，你可以将“增加商品”、“修改商品”、“查看商品”、“修改菜单”这四个“权限”作为一个“权限组”定义为“运营员”角色。然后将某个“用户”定义为“运营员”角色，则该“用户”即可继承“运营员”获得这三个“权限”。

再例如“仓库管理员”，你可以将订单相关的“权限组”定义为该角色等等。

有个特例是“超级管理员”，众所周知，这个角色，通常在系统中默认拥有全部权限，所以，这类角色，通常直接放在“用户”模型比较好。在程序中便可硬编码，判断该“用户”是否为超级管理，若为真则可不需要进行权限的判断了，在扩展方面会更好些。

## 权限（PERMISSION）

权限模型，是针对资源进行数据库操作时所定义的一些“操作名称”，例如对“商品”这个资源，常见的便是“增删改查”，更细化可以有“更换商品图片”等针对某些字段级别的资源操作。

## 用户 & 角色（Relation-Ship）

`MANY-TO-MANY`

## 角色 & 权限（Relation-Ship）

`MANY-TO-MANY`

## 模型 ER 图

![ER](/images/how-to-build-acl-model/006oyqbngy1fpuwonqjfvj30cx0d73yu.jpeg)

## 模拟数据

1. 用户 `user_admin` 为 `admin` 角色，该角色拥有四个权限：

```shell
create|delete|update|select product
```

2. 用户 `user_staff` 为 `staff` 角色，该角色拥有三个权限：

```shell
create|update|select| product
```

3. 用户 `user_visitor` 为 `visitor` 角色，该角色拥有一个权限：

```shell
select product
```

### Table Data

```shell
mysql> SELECT * FROM auth_user;
+----+--------------+--------------+
| id | username     | password     |
+----+--------------+--------------+
|  1 | user_admin   | user_admin   |
|  2 | user_staff   | user_staff   |
|  3 | user_visitor | user_visitor |
+----+--------------+--------------+
3 rows in set

mysql> SELECT * FROM auth_role;
+----+---------+
| id | name    |
+----+---------+
|  1 | admin   |
|  2 | staff   |
|  3 | visitor |
+----+---------+
3 rows in set

mysql> SELECT * FROM auth_permission;
+----+----------------+
| id | name           |
+----+----------------+
|  1 | create product |
|  2 | delete product |
|  3 | update product |
|  4 | select product |
+----+----------------+
4 rows in set

mysql> SELECT * FROM auth_user_role;
+---------+---------+
| role_id | user_id |
+---------+---------+
|       1 |       1 |
|       2 |       2 |
|       3 |       3 |
+---------+---------+
3 rows in set

mysql> SELECT * FROM auth_role_permission;
+---------+---------------+
| role_id | permission_id |
+---------+---------------+
|       1 |             1 |
|       1 |             2 |
|       1 |             3 |
|       1 |             4 |
|       2 |             1 |
|       2 |             4 |
|       2 |             3 |
|       3 |             4 |
+---------+---------------+
8 rows in set
```

## 常见的“权限”校验方法：

1. 硬编码在每一个视图或某个业务方法中；

2. 写在中间件中，根据“权限”所属的资源，如路由等，来进行校验。

## 封装用户权限校验

```php
<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable {

    use Notifiable;

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasPermission($permissionName)
    {
        foreach ($this->roles as $role) {
            if ($role->permisssions()->where('name', $permissionName)->exists()) {
                return true;
            }
        }
        return false;
    }

}
```

## 硬编码

例如，当用户进行“删除或创建商品”操作时，可以直接在控制器方法中进行限制：

```php
<?php

namespace App\Http\Controllers;

use App\Models\Product;

class ProductsController extends Controller {

    public function store(Request $request)
    {
        // 判断当前登录的用户是否有权限
        if (!$request->user()->hasPermission('create product')) {
            abort(403);
        }
        // do something
        return back()->with('status', '添加商品成功');
    }

    public function destroy(Product $product)
    {
        // 判断当前登录的用户是否有权限
        if (!$request->user()->hasPermission('delete product')) {
            abort(403);
        }
        // do something
        return back()->with('status', '删除商品成功');
    }

}
```

## 中间件

“硬编码”会因为路由的增加而使维护、扩展越来越麻烦，因此，通常将平行权限，或需要特定判断的业务才硬编码到视图逻辑中。

现在，我们往“权限”表中，加入路由字段，进行基于路由校验权限的扩展：

```shell
mysql> SELECT * FROM auth_permission;
+----+----------------+----------------+
| id | name           | route          |
+----+----------------+----------------+
|  1 | create product | product.create |
|  2 | delete product | product.delete |
|  3 | update product | product.update |
|  4 | select product | product.select |
+----+----------------+----------------+
4 rows in set
```

之后，我们便可在诸如Laravel 中间件、Codeigiter 钩子函数等，拦截请求，进行权限校验：

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Route;
use App\Models\Permission;

class PermissionAuth {
  public function handle($request, Closure $next) {

    $route = Route::currentRouteName();

    // 判断权限表中这条路由是否需要验证
    if ($permission = Permission::where('route', $route)->first()) {
        // 当前用户不拥有这个权限的名字
        if (!auth()->user()->hasPermission($permission->name)) {
            return response()->view('errors.403', [
                'status' => "权限不足，需要：{$permission->name}权限"
            ]);
        }
    }

    return $next($request);
  }
}
```
