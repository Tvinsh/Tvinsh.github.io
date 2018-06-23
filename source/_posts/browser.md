---
title: 从浏览器多进程到JS单线程
photo: /img/browser.jpeg
date: 2018-06-08 19:50:19
excerpts: 简单记录浏览器的多进程和js的单线程
tags: 'web'
---

![browser](/img/browser.jpeg)

# 从浏览器多进程到JS单线程

------

#### 浏览器是多进程的

 **1.Browser进程** ：浏览器的主进程（负责协调、主控），只有一个
- 负责浏览器界面显示，与用户交互。如前进，后退等
- 负责各个页面的管理，创建和销毁其他进程
- 网络资源的管理，下载等

**2.第三方插件进程** ：每种类型的插件对应一个进程，仅当使用该插件时才创建

**3.GPU进程** ：最多一个，用于3D绘制等

**4.浏览器渲染进程（浏览器内核）**：
- Renderer进程，内部是多线程的
- 默认每个Tab页面一个进程，互不影响
- 页面渲染，脚本执行，事件处理等


#### 浏览器内核是多线程的

**1.GUI渲染线程** ： 
- 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等
- GUI渲染线程与JS引擎线程是互斥的，当JS引擎执行时GUI线程会被挂起（相当于被冻结了），GUI更新会被保存在一个队列中等到JS引擎空闲时立即被执

**2.JS引擎线程** ：
- 负责处理Javascript脚本程序，如V8
- JS引擎一直等待着任务队列中任务的到来，然后加以处理，一个Tab页（renderer进程）中无论什么时候都只有一个JS线程在运行JS程序
- 和GUI渲染线程互斥，如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞

**3.事件触发线程** ：
- 归属于浏览器而不是JS引擎，用来控制事件循环（可以理解，JS引擎自己都忙不过来，需要浏览器另开线程协助）
- 当JS引擎执行代码块如setTimeOut时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX异步请求等），会将对应任务添加到事件线程中
- 由于JS的单线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）

**4.定时触发器线程** ：
- 浏览器定时计数器并不是由JavaScript引擎计数的,（因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）

**5.异步http请求线程** ：
- 用于 http请求

#### 打开一个页面需要哪些进程和线程

1. Browser进程收到用户请求，首先需要获取页面内容（譬如通过网络下载资源），随后将该任务通过RendererHost接口传递给Render进程
2. Renderer进程的Renderer接口收到消息，简单解释后，交给渲染线程，然后开始渲染
	- (1)渲染线程接收请求，加载网页并渲染网页，这其中可能需要Browser进程获取资源和需要GPU进程来帮助渲染
	-  (2)可能会有JS线程操作DOM（这样可能会造成回流并重绘）
	-  (3)最后Render进程将结果传递给Browser进程
3. Browser进程接收到结果并将结果绘制出来

#### 浏览器器内核拿到内容后，渲染步骤：

1. 解析html建立dom树
2. 解析css构建render树（将CSS代码解析成树形的数据结构，然后结合DOM合并成render树）
3. 布局render树
4. 绘制render树（paint），绘制页面像素信息
5. 浏览器会将各层的信息发送给GPU，GPU会将各层合成（composite），显示在屏幕上

#### JS的运行机制

- JS分为同步任务和异步任务
- 同步任务都在主线程上执行，形成一个执行栈
- 主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
- 一旦执行栈中的所有同步任务执行完毕（此时JS引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。
![browser](/img/js.png)


#### macrotask与microtask

```
console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
    console.log('promise1');
}).then(function() {
    console.log('promise2');
});

console.log('script end');
```

JS中分为两种任务类型：macrotask和microtask，在ECMAScript中，microtask称为jobs，macrotask可称为task

**1.macrotask** ：
- 每一个task会从头到尾将这个任务执行完毕，不会执行其它
- 浏览器为了能够使得JS内部task与DOM任务能够有序的执行，会在一个task执行结束后，在下一个 task 执行开始前，对页面进行重新渲染 （task->渲染->task->...）
- 主代码块，setTimeout，setInterval等

**2.microtask** ：
- 在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）
- Promise，process.nextTick等
![browser](/img/mic.png)

下面这个链接详细介绍了宏任务和微任务，有兴趣可以看看。
https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/