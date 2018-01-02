---
title: AMP 小结
photo: /img/amp.png
excerpts: AMP 全称 Accelerated Mobile Pages,顾名思义是为了加速移动网络的网页加载从而提升体验。 
tags: mobile
---

## AMP 简介

AMP 全称 Accelerated Mobile Pages,顾名思义是为了加速移动网络的网页加载从而提升体验。[AMP官网](https://www.ampproject.org/zh_cn/learn/overview/)上称其可在很多平台上提供卓越的用户体验。AMP网页采用3大核心组件构建而成，分别是：

    1. AMP HTML
    2. AMP JS
    3. AMP Cache

### AMP HTML

AMP HTML 是为确保可靠性能而具有某些限制的 HTML。意思就是可以使用绝大部分常规的HTML标签，但是对于影响性能的标签，AMP是禁止使用的，取而代之的是AMP自己经过处理的相对应的标签。以下大概列举几个比较重要的标签，具体可以看[官网中的描述](https://www.ampproject.org/zh_cn/docs/reference/spec)

| 原生      | AMP tag    |
|---------- |-------- |
| img |amp-img |
| video |amp-video |
| audio |amp-audio |
| a |href 不能是javascript: |

一个简单的标准的AMP页面如下：

```html
<!doctype html>
<html ⚡>
 <head>
   <meta charset="utf-8">
   <link rel="canonical" href="hello-world.html">
   <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
   <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
   <script async src="https://cdn.ampproject.org/v0.js"></script>
 </head>
 <body>Hello World!</body>
</html>
```
必须：

* 包含顶级 ```<html ⚡>``` 标记（也接受 ```<html amp>```）
* 在```<head>```内包含一个 ```<link rel="canonical" href="$SOME_URL">```标记，该标记指向 AMP HTML 文档的常规 HTML 版本，或在此类 HTML 版本不存在的情况下指向文档本身,在对应 HTML 中加上```<link rel="amphtml" href="$AMP_URL">```指向AMP页面
* 包含 ```<meta name="viewport" content="width=device-width,minimum-scale=1">``` 标记。还建议包括 ```initial-scale=1```
* 包含 AMP 需要的css
* 包含 ```<script async src="https://cdn.ampproject.org/v0.js"></script>``` 标记作为```<head>```中的最后一个元素（这样做将会包括并加载 AMP JS 库）
* 将样式内联，用```<style amp-custom>```来包裹
* 除了AMP需要的js和css，不能从外部引入需要的js，css文件


### AMP JS

实现所有AMP的最佳性能做法，管理资源加载，并提供上面提到的自定义标记，所有这些都是为了确保快速渲染网页；它可使来自外部资源的所有内容保持异步，让网页中的任何内容都能毫无阻碍地渲染；将所有 iframe 沙盒化，加载资源之前对网页上每个元素的布局进行预先计算，以及禁用性能缓慢的 CSS 选择器。

### AMP Cache

是一种基于代理的内容交付网络，用于交付所有有效的 AMP 文档。它可提取 AMP HTML 网页，对这些网页进行缓存，并自动改进网页性能。使用之后包括文档，所有 JS 文件及所有图片都从使用 HTTP 2.0 的同一来源加载，从而可实现最高效率。另外它还提供验证系统以及错误提示。

## AMP是如何提升性能的

看了上面的介绍以及实际体验之后，我们知道AMP确实很快，下面简单介绍下 AMP 是如何提升加载速度的。

### 仅允许异步脚本

javascript 会阻塞 DOM 构建和页面的渲染，AMP 页面不能包含作者自己编写的任何 JavaScript， 仅在 iframe 中允许第三方 JS，这样即使第三方 JS 触发了多次样式重新计算， 它们微小的 iframe 也只有非常少的 DOM，不会阻碍主页面的执行。

### 确定静态资源的大小

图片、广告或 iframe 等外部资源必须在 HTML 中声明其大小，以便 AMP 可以在资源下载前确定每个元素的大小和位置。

举个栗子，DOM 在渲染 img 标签的时候，要去异步请求图片资源，在加载图片的时候，不能阻塞 DOM 的渲染，所以我们首先渲染图片的占位符，比如原生的alt属性；
当图片加载完成，浏览器知道了图片的大小，于是将占位符替换成图片，如果占位符和图片的大小不一致，就会引起回流，即reflow，这个就是性能的消耗。

>reflow：例如某个子元素样式发生改变，直接影响到了其父元素以及往上追溯很多祖先元素（包括兄弟元素），这个时候浏览器要重新去渲染这个子元素相关联的所有元素的过程称为回流。

于是 AMP 将 img 替换成了 amp-img，用来解决刚才提到的问题，其实这个优化方案跟我们现在使用的图片lazyload有点相似，不过lazyload需要借助外部脚本来实现，amp-img则是将这些优化集成到了amp的脚本里了。

另外 AMP 不必等待所有资源都下载完成就可以直接加载页面布局，将文档布局与资源布局脱钩，布局整个文档（包括字体）只需要一个 HTTP 请求。

### 内联css并且有大小限制

CSS 会阻碍所有渲染和页面加载，AMP 中仅允许内联css，这样就减少了至少一个 css的请求，另外，内嵌样式表最大为 50 KB，对于一般页面都足够了，如果是非常复杂的页面，就需要比较精细的css风格。

### 仅运行 GPU 加速动画

这句话大概的意思就是有些动画会引起浏览器的重新渲染，比如改变了某个元素的宽高，就会引起之前说的回流。AMP 目前只支持使用 transform 和 opacity 属性更改来实现动画，具体解释可以看 [渲染性能](https://developers.google.com/web/fundamentals/performance/rendering/),[坚持仅合成器的属性](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count),对于担心仅使用这两个属性满足不了需求，[FLIP原则](https://aerotwist.com/blog/flip-your-animations/)可能会帮助将动画从开销更大的属性重新映射为变形和透明度的更改。

还有很多优化点就不一一列举了，比如延时加载和滚动加载等。

### AMP Cache

说了以上这么多，最重要的可能还是cache,官网解释如下：

>Google AMP Cache 是一种基于代理的内容交付网络，用于交付所有有效的 AMP 文档。它可提取 AMP HTML 网页，对这些网页进行缓存，并自动改进网页性能。使用 Google AMP Cache 时，文档，所有 JS 文件及所有图片都从使用 HTTP 2.0 的同一来源加载，从而可实现最高效率。

大意是 AMP Cache 会把 AMP 页面的所有资源都进行缓存并且替换掉了路径。

举个栗子，我们访问 起点国际m站中 Mystical Journey 这本书的详情页，路径是 ```https://m.webnovel.com/book/8335353205000005```,页面里有这本书的书封，路径是```https://img.webnovel.com/bookcover/8335353205000005/300/300.jpg?coverUpdateTime=1510210938392```,当 AMP Cache 对这个 AMP 页面进行缓存的时候，会扫描页面，对里面的资源进行缓存并且替换掉了路径。我们打开这个页面对应的AMP页面，发现图片的地址变成了```https://img-webnovel-com.cdn.ampproject.org/ii/w820/s/img.webnovel.com/bookcover/8335353205000005/300/300.jpg?coverUpdateTime=1510210938392```,变成了ampproject的cdn路径了，当我把这张图下载下来时，发现是webp格式的，这又是一种图片优化的方法，具体见[webp百度百科](https://baike.baidu.com/item/webp%E6%A0%BC%E5%BC%8F/4077671?fr=aladdin)，另外，这个详情页的地址也变了，变成了```https://www.google.co.uk/amp/s/m.webnovel.com/amp/book/8335353205000005```

通过 AMP Cache，所有资源都是同一个 host，可以共享 dns，还有google强大的cdn，另一方面，google搜索结果页还会对 AMP 页面进行预加载，所以经过以上，AMP 页面真的快得跟闪电一样！！！

### 其他

除了上述提到的组件，AMP 提供了一套完整的组件库，包括 amp-ifame 这样的UI组件，以及 amp-bind，amp-mustache 这样的功能组件。

另外，在AMP上海路演中，在大中华区推广 AMP 的负责人介绍，国内包括百度，360，搜狗，微博，QQ空间等都支持AMP，并且都有自己的cdn用来支持AMP Cache，不同于搜索引擎，在微博和QQ空间上，并不会主动去抓取 AMP 页面，比如你分享了一个 AMP 页面到 QQ空间当中，QQ空间不会主动去抓取，但是只要有一个用户在QQ空间中点开了这个页面，QQ空间就会收录缓存这个页面，当后面有人点击时，就是实现秒开的效果。