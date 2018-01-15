---
title: PWA 初探
photo: /img/pwa.png
date: 2018-01-16 17:52:00
excerpts: PWA 初探 
tags: 'js'
---

![图片内容](/img/pwa.png)

# PWA 初探

------

### 简介
简单介绍下，PWA 全名 Progressive Web Apps 即 渐进式网络应用， 是 Google 提出的用前沿的 Web 技术为网页提供 App 般使用体验的一系列方案。

和 PWA 相关的其实包含很多内容，这里我们重点探讨下和 webapp 有关的一些内容。 PWA 具有很多优势，比如以下：

> 1. 免安装，可添加快捷方式到桌面，类似原生app体验,敏捷更新
> 2. 响应式
> 3. 独立于网络连接
> 4. 可发现, 可重连, 可链接

这里面有很多功能是对传统 webapp 的巨大突破，这应该也是 PWA 这么火热的原因。

### 主要技术点

PWA 包括一系列的技术点，其中比较重要的包括：

> 1. Service Worker
> 2. Web App Manifest
> 3. App Shell
> 4. Push Notification

这其中，Service Workers 是 PWA 的关键，其中包括 Cache API、 Fetch API 等技术点，下面我们简单介绍下这些技术，通过了解这些技术可以大致了解 PWA 究竟是什么。

### Service Worker

> Service Worker 是一段脚本，与 Web Worker 一样，也是在后台运行。作为一个独立的线程，运行环境与普通脚本不同，所以不能直接参与 Web 交互行为。Native App 可以做到离线使用、消息推送、后台自动更新，Service Worker 的出现是正是为了使得 Web App 也可以具有类似的能力。

简单概括下即 No window，No DOM，NO XHR，NO localStorage。
在 Service Worker 当中会用到一些全局变量:

> 1. self: 表示 Service Worker 作用域, 也是全局变量
> 2. caches: 表示缓存
> 3. skipWaiting: 表示强制当前处在 waiting 状态的脚本进入 activate 状态
> 4. clients: 表示 Service Worker 接管的页面

##### servive worker 生命周期：

![生命周期](/img/service1.jpg)

> 1. parsed: 注册完成, 脚本解析成功, 尚未安装
> 2. installing: 对应 Service Worker 脚本 install 事件执行, 如果事件里有 event.waitUntil() 则会等待传入的 Promise 完成才会成功
> 3. installed(waiting): 页面被旧的 Service Worker 脚本控制, 所以当前的脚本尚未激活。可以通过 self.skipWaiting() 激活新的 Service Worker
> 4. activating: 对应 Service Worker 脚本 activate 事件执行, 如果事件里有 event.waitUntil() 则会等待这个 Promise 完成才会成功。这时可以调用 Clients.claim() 接管页面
> 5. activated: 激活成功, 可以处理 fetch, message 等事件
> 6. redundant: 安装失败, 或者激活失败, 或者被新的 Service Worker 替代掉


##### server worker 和主页面通信： 

server worker 主要通过 postMessage 来发送信息，通过监听 message 事件来获得信息，具体请看以下示例 --> [server worker通信](https://2fz1.me/blogDemos/sw/index.html)


##### server worker 截获请求和缓存

Service Worker 脚本最常用的功能是截获请求和缓存资源文件, 这些行为可以绑定在下面这些事件上:

> 1. install 事件中, 抓取资源进行缓存
> 2. activate 事件中, 遍历缓存, 清除过期的资源
> 3. fetch 事件中, 拦截请求, 查询缓存或者网络, 返回请求的资源


### Web App Manifest

官网上对于其的解释:

> Web 应用清单文件是简单的 JSON 文件，它在文本文件中提供了应用相关的有用信息 (比如应用的名称、作者、图标和描述)。但更特别的是，Web 应用清单可使用户将 Web 应用安装到设备的主屏幕上，并允许开发者自定义启动画面、模板颜色，甚至是打开的 URL 。

实际应用中，我们需要定义一个 ```manifest.json``` 文件，并将其引入 html 中 ```<link rel="manifest" href="manifest.json" />```

manifest.json 大致结构如下：

```json
{
    "name": "Qi Dian web app",
    "short_name": "QiDian",
    "start_url": "/index.html",
    "display": "standalone",
    "theme_color": "#FFDF00",
    "background_color": "#FFDF00",
    "icons": [{
        "src": "homescreen.png",
        "sizes": "192x192",
        "type": "image/png"
        },
        {
        "src": "homescreen-144.png",
        "sizes": "144x144",
        "type": "image/png"
        }
    ]
}
```
json 定义了以下内容：

> 1. name 用作当用户被提示安装应用时出现的文本
> 2. short_name 用作当应用安装后出现在用户主屏幕上的文本
> 3. start_url 决定了当用户从设备的主屏幕开启 Web 应用时所出现的第一个页面
> 4. display 打开后如何显示，如是否全屏，是否在浏览器中打开等
> 5. theme_color 可以对浏览器的地址栏进行着色
> 6. icons 字段决定了当 Web 应用被添加到设备主屏幕时所显示的图标

### App Shell

为了使 webapp 体验起来更像原生应用，结合 webapp 的外壳几乎没太大变化，比如导航栏，头部，底部等，我们可以通过之前说的 service worker 将 webapp 的外层ui框架缓存起来，当首次加载时缓存了 ui 框架，后面再访问时，就会立即出现已经缓存的ui框架，然后加载后续资源，给用户一种原生app的体验。

![appshell](/img/app-shell.png)

### Push Notification

推送通知可能是 PWA 比较吸引人的一个点了，推送通知可以很好的与用户进行互动，尤其是当他们关闭了标签页或访问其他网页的时候，即使用户没有浏览你的网站也会收到这些通知。