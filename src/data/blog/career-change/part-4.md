---
title: "转行程序员深漂的这三年 #4"
description: "编程工作的日常、不同公司的开发状况，技术变化快，要熟练基本功，沉淀业务提升自己，掌握新技术需反复尝试，还要保持激情以应对行业不断更新。"
pubDatetime: 2017-12-31
slug: career-change/part-4
column: career-change
featured: false
draft: false
tags:
  - 生活
---

**我对编程很感兴趣，想当一名程序员。**

每个人可能会有很多兴趣：音乐、美食、游戏、编程等等，这些兴趣都可以指向某个行业，为什么最后你要选“编程”这个兴趣？编程并没有想象中的那么酷，大概在你工作一两年，做过数个项目后，你会开始觉得它和传统行业也有很多共同点：若你专职于后端，业务上重复的增删改查；若你专职于前端，业务的交互逻辑、各种 UI 的实现、各大 PC 浏览器或移动端浏览器等兼容问题，这些都会是你长期的日常开发工作。

沟通方面，若你在一家小公司并且开发自己公司的产品，可能老板一句话就能定下需求，如果老板不太专注业务实现的方式，只关心业务实现的结果，你可以很容易就快速完成一个功能，然后上线；若你在一家大公司，有比较完备的 UI、产品等岗位的同事，一个功能需求，甚至是一个页面上的文案可能就会磨蹭许久，最终才能上线。要是这家公司的开发流程不严格，可能你还在写某个功能，产品又想把这个功能再变个样子，你会来来回回反复修改，一个原本两三天就能结束的功能，可能需要几倍的时间来完成。

可以参阅[《人月神话》](https://book.douban.com/subject/1102259/)这本书，里面提及了一些对软件开发过程的几个重要关键点，见解很独到，是软件工程的经典著作。

**我今年 XX 岁了，转行算迟嘛？**

每次看到类似这种提问，都非常庆幸自己在 2014 年作出转行的决定！在[《转行程序员深漂的这三年 #3》](posts/career-change/part-3)中，我叙述了自己在 2015 年，如何拿着两个静态页面 DEMO，投简历，就能收到诸多面试邀请，并一步步找到工作的过程。试想一下，如果我不是在 2015 找工作，而是在 2017 年呢！我想，应该不会收到面试邀请吧？

2015 年，在招聘的岗位职责上：熟悉 CSS 预处理语言（LESS、SASS等）之一、熟悉 MVVM（React、Angular、Vue 等）框架之一、熟悉常用自动化工具（Webpack、Gulp 等）之一、有移动端网页及 Hybrid App 经验优先、熟悉 Node.js 优先等这类的就职要求很少见，有的甚至没有，大部分还是 jQuery、Require.js、Backbone.js，常见的还是 PC 端上的 WEB 开发。

而现在呢？微信公众号、Hybrid App，移动端上的浏览器、诸多的 CSS 框架、CSS3、HTML5、ESC6、版本控制工具等等，2015 - 2017，就这短短两年，衍生出许多新的工具、框架、开发模式等等，每年的岗位需求也会和这些新技术牢牢匹配。IT 这一行，不论哪种岗位，哪种语言，技术栈每年都会发生日新月异的变化。

你每晚一年开始，便需要多学习和了解这一年的新事务，才能跟上当年的脚步！

**工具是为了提高开发效率，不要过于依赖它！**

就拿 CSS 还说，现在有很多框架，你只需要使用它们，照着官方文档就能轻松写出响应式强，兼容性好的 Web App，但是框架、工具等的出现是为了提高开发效率，如果你 CSS 还没有熟练，不知道 float 怎么用，不清楚 position 的概念，不明白 display 几种布局的方式，过于依赖它们，你可能做完一整个项目，CSS 熟练度提升为零。

网络上经常会看见一些新人的提问，大部分会类似“这个框架/工具没有实现这个功能，我该怎么实现”？

假如现在需要让某张图片自适应，等比缩放以匹配不同的客户端，依赖 Bootstrap ，可能只需要在标签上加一个类名， "class=img-responsive”，那不用 Bootstrap 呢？ 假如现在还需要一个自定义的模态框，你真的有了解过一个带遮罩模态框的 HTML 结构吗？遮罩层、内容层的 z-index 又该怎样定义？遮罩层又怎样才能撑满整个视口？内容层又如何相对遮罩层居中？

工具会过时，框架也会被替代，熟练你的基本工，知其然而知其所以然，才能在下一个新框架、新工具出来时，快速熟悉它们，跟上当前的节奏。

**每天都是重复的增删改查，都是重复的交互编码，我该怎么提升？**

可能一两年，或者做多几个项目后，你会慢慢觉得工作很枯燥。是啊，每天都在重复的写着交互、增删改查等等，除了更加熟悉框架、接口，编码更快，Debug 更准，好像没有什么其他提升，我该怎么办？你所写的业务，它们都是你的经验，都是你的提升！

有一段时间，我在做微信商城相关的项目，每天反复写着增删改查的业务逻辑：获取 OPENID，查出商品数据，渲染商品详情视图，用户点击购买，服务端校验金额，唤起微信支付，支付成功，服务端查询订单支付状态，更新订单表状态等等。为什么要在最开始获取 OPENID？为什么要在服务端校验金额？为什么微信 JSSDK 返回支付成功，还需要服务端去查询？为什么一个“用户下单”流程要分解成这么多步骤？这些就是业务！

和传统行业一样，一个服装厂，有专职生产衣服的车工（开发），也有专职设计衣服样板的师傅（架构）。那些师傅之所以可以做样板，不就是因为他们对整个衣服的制作流程（业务）熟悉吗？他们知道如何把衣服切分成不同部位，不同码数对应不同大小，车工小组便可更好的分工，更高效的完成一件衣服的制作。

当你迷茫，不知道怎么提升时，沉淀一下自己在当前公司所写过的业务，假如你和我一样做过一段时间商城相关项目：

一个最基础的商城，需要哪些表？如何处理文件上传？涉及到金额，为什么字段类型要用 decimal ？为什么微信支付 API 里的金额是 int，单位是分，而不是元？商品多规格，多库存怎么处理，等等... ...

代码量可以提升编码的效率，业务的积累才是你提升的成果。

**由量变到质变**

我记得第一次开始写 Vuejs 的时候，难到我的并不是 Vuejs 的 API 或者一些概念，而是 Webpack，它配置非常灵活，还有丰富的 Plugins、Loaders 等等，我始终不能很好的理解以及运用它。大部分时候，我都是用 vue-cli 去直接生成一个项目，于是我每天都会花几个小时，搭配看 Webpack 官方文档，去琢磨 vue-cli 所生成项目的目录结构、configs 文件等等，然后自己一步一步，从 npm init 开始，从 webpack-simple 开始，从头搭建一个项目，直到一两个月的某一天，我突然就会了。

事实上，学习到掌握一门新的技术，我一直认为自己的学习能力是很普通的，我掌握它们的唯一方法就是反复去尝试搭建，反复去尝试使用，反复看文档。

这 3 年的时光，我有很多类似这种学习 Webpack 的经历，如 Laravel、Vue、Django、React，可能 1 个月，也可能是 3 个月，甚至更久，对某个工具、框架无法理解，突然的某一天，就顿悟了。

“读书百遍，其义自见”，我想，应该就是这个道理吧。反复去琢磨一件事物，其中你免不了去查阅各种资料，日积月累，由量变到质变。当你下定决心，准备掌握一门新技术的时候，做好**“准备”**，做好**“反复”**，等待**“由量变到质变”**的那一天，享受**“顿悟”**的那一刻！

**保持住你的激情！**

如果你准备转行 IT，你必须面对一个事实，它并不是一个越老越吃香的行业，反而是一个在不断前进，不断更新的行业。你需要长期保持自己对新事物的激情、学习的激情，否则就会失去你的竞争力。

**我的 2015 - 2017**

![2015](/images/career-change/2015.png)
![2016](/images/career-change/2016.png)
![2017](/images/career-change/2017.png)

**第一个 100+ Star**

![100+ star](/images/career-change/100-star.png)
