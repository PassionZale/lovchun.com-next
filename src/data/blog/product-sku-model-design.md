---
title: 商品多规格多属性模型设计思路
description: 不涉及多仓库那种特别复杂的需求，简单阐述下自己对整个商品表模型的设计和理解。
pubDatetime: 2018-03-05
slug: product-sku-model-design
featured: true
draft: false
tags:
  - 指南
---

## 区分货品（SPU）和商品（SKU）

SPU = Standard Product Unit （标准化产品单元）：

一件衬衣，它就是一个 SPU，此外它不具有库存、价格等因素，它仅仅是众多款衬衣抽象出来了一个货品。

SKU = stock keeping unit(库存量单位)：

对于服装来讲，它应该会有尺寸、颜色等规格，以及该规格下对应的属性，如：XL、L、红色、白色等等，不同属性组合所表示的就是一个 SKU，如 尺寸：XL、颜色：红色，它会有库存、价格，用户真正下单所购买的也是 SKU，而不是 SPU。

SPU 是标准化产品单元，区分品种；SKU是库存量单位，区分单品；SPU 与 SKU 是 ONE-TO-MANY 的关系。

## 规格模型

SPU 是一个抽象出来的货品，货品再向上可以抽象为一个分类。如衬衣，它的规格尺寸、颜色等，是衬衣这个 SPU 所共有的，衬衣再网上可以归类为 服装 分类，服装这个分类可以包括多种 SPU，如衬衣、牛仔裤、T恤等等。

那么我们在创建一个分类时，就可以针对某个分类，如服装，定义好服装下面的公共规格，如：尺寸、颜色、尺码等等。

再创建一个货品时，便可将该分类下的规格，选择一个或者多个与货品形成绑定关系。

- 分类与规格：ONE-TO-MANY；
- 分类与货品：ONE-TO-MANY；
- 规格与货品：MANY-TO-MANY；

## 表结构设计

### 1. 数据表列表：

（分类）category

（规格）attribute

（属性）value

（货品）product

（商品）sku

### 2. 数据表关系：

分类、规格：ONE-TO-MANY

规格、属性：ONE-TO-MANY

分类、货品：ONE-TO-MANY

货品、商品：ONE-TO-MANY

货品、规格：MANY-TO-MANY

货品、属性：MANY-TO-MANY

商品、属性：MANY-TO-MANY

### 3. 简单的表结构图：

![表结构](/images/product-sku-model-design/table-design.jpg)

## 数据结构

现在我们设计好了模型，在进行前后端交互时，如何组织数据结构，利于前端渲染数据呢？我们在京东上找到一个带有多规格的商品，左边是规格（attribute）名称，右边是不同规格下的属性值（value），如图：

![示例](/images/product-sku-model-design/example.jpg)

首先，前端需要将该货品（SPU）下的全部规格及属性渲染出来，再根据用户所组合的属性来显示对应商品（SKU）的价格、库存等信息。那么我们大致的数据结构可以组装成这样：

![接口返回](/images/product-sku-model-design/api.jpg)

## 渲染方式

前端通过 detail 显示货品的公共信息，通过 attrs 将规格及规格的属性渲染至页面中，用户在每次勾选属性时，拼接 attr_id 及 value_id，在 skus.combines 中查询是否存在该组合，若存在，则显示当前 skus 的价格、库存等等信息。

同时，我们也可以将 sku_code 放在商品详情的 url 参数中，前端获取到 sku_code 后，通过 sku_code 也可以逆向查询到当前的 attribute 及 value 组合方式，直接将符合 sku_code 的属性渲染为 已选中 的高亮样式。

## 查询流程

只是简单的描述根据上述表结构，如何通过 product_id 进行查询并将查询结构封装为上图所示的数据结构，可能并非最优查询方式，这里我直接使用 Django 的 ORM 进行查询。

### 1. 封装 detail & attrs：

根据 product_id 可以直接在 product 表中查询到货品的基本信息，并将 product.id、product.name、product.desc 封装进 detail 属性中；

由于 product 与 attribute 及 value 均为 MANY-TO-MANY 的关系，我们可以通过 product_attribute 表、product_value 表获取到该 product 所关联全部的 attributes & values。

由于 attribute 与 value 是 ONE-TO-MANY 的关系，那么只需要循环 attributes，通过判断 value.attribute_id 与当前的 attribute.id 是否相等，便能将 attribute 与 value 组合封装。

```python
# 货品信息
product = Product.objects.get(pk=product_id)
# 货品的 attrs
attrs = product.attribute.all()
properties = []

for e in attrs:
  values = product.attribute_value.all()
  values_arr = []
  for item in values:
    if item.attribute == e:
      value = { 'id': item.id, 'name': item.name }
      values_arr.append(value)
  attr = { 'id':e.id, 'name': e.name, 'values': values_arr }
  properties.append(attr)
```

### 2. 封装 skus：

由于 product 和 sku 是 ONE-TO-MANY，通过 product，能直接获取到其全部的 skus。

接下来，sku 与 value 是 MANY-TO-MANY 的关系，便能获取到该 sku 下的全部 value，并通过 value 查询到其对应的 attribute_id，然后封装进每个 sku 的 combines 中。

```python
# 货品的 skus
sku = product.sku_set.all()
skus = []

for e in sku:
  inst = {
    'sku_id': e.id,
    'sku_code': e.sku_code,
    'sku_name': e.sku_name,
    'sku_price': e.sku_price,
    'sku_stock': e.sku_stock,
    'combines': []
  }
  values = e.attribute_value.all()
  for item in values:
    inst['combines'].append({
      'attr_id': item.attribute.id,
      'attr_name': item.attribute.name,
      'value_id': item.id,
      'value_name': item.name
    })

  skus.append(inst)
```

## 完整查询示例

```python
def detail(request, product_id):
  try:
    # 货品信息
    product = Product.objects.get(pk=product_id)
    # 货品的 attrs
    attrs = product.attribute.all()
    properties = []

    for e in attrs:
      values = product.attribute_value.all()
      values_arr = []
      for item in values:
        if item.attribute == e:
          value = { 'id': item.id, 'name': item.name }
          values_arr.append(value)
      attr = { 'id':e.id, 'name': e.name, 'values': values_arr }
      properties.append(attr)

    # 货品的 skus
    sku = product.sku_set.all()
    skus = []
    for e in sku:
      inst = {
        'sku_id': e.id,
        'sku_code': e.sku_code,
        'sku_name': e.sku_name,
        'sku_price': e.sku_price,
        'sku_stock': e.sku_stock,
        'combines': []
      }
      values = e.attribute_value.all()
      for item in values:
        inst['combines'].append({
          'attr_id': item.attribute.id,
          'attr_name': item.attribute.name,
          'value_id': item.id,
          'value_name': item.name
        })

      skus.append(inst)

  except Product.DoesNotExist:
    raise Http404('商品不存在。')

  result = {
    'detail': {
      'id': product.id,
      'name': product.name,
      'desc': product.desc
    },
    'attrs': properties,
    'sku': skus
  }

  data = json.dumps(result, cls=DecimalEncoder)
  return HttpResponse(data, content_type='application/json', charset='utf-8')
```

表会比较冗余，因为在创建或修改货品的规格时，需要同时操作 product_attribute、product_value、sku、sku_value 四张表。

其实 product_attribute、product_value 可以移除，通过 sku 及 sku_value 也能查询到该 product 所涵盖的 attribute & value。
