---
title: 前端乱炖
photo: /img/js.jpg
date: 2018-06-18 19:50:19
excerpts: 记录一些前端笔记，不定时更新
tags: js
---

![图片内容](/img/js.jpg)

# 前端乱炖，不定时更新

------

## 怎么画一条0.5px的边

参考[人人博客](https://fed.renren.com/2018/03/24/half-of-one-px/)，万能方法，能完美兼容ios和安卓，如下

```css
.hr.scale-half {
    height: 1px;
    transform: scaleY(0.5);
    transform-origin: 50% 100%;
}
```

1.直接设置0.5px，在不同的浏览器会有不同的表现
- IOS的Chrome会画出0.5px的边，而安卓(5.0)原生浏览器是不行的

2.线性渐变linear-gradient
```css
.hr.gradient {
    height: 1px;
    background: linear-gradient(0deg, #fff, #000);
}
```
- 这个效果和scale 0.5的差不多，都是通过虚化线，让人觉得变细了

3.boxshadow
```css
.hr.boxshadow {
    height: 1px;
    background: none;
    box-shadow: 0 0.5px 0 #000;
}
```
- 在Chrome和Firefox都非常完美，但是Safari不支持小于1px的boxshadow

4.svg
```css
.hr.svg {
    background: none;
    height: 1px;
    background: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='1px'><line x1='0' y1='0' x2='100%' y2='0' stroke='#000'></line></svg>");
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzFweCc+PGxpbmUgeDE9JzAnIHkxPScwJyB4Mj0nMTAwJScgeTI9JzAnIHN0cm9rZT0nIzAwMCc+PC9saW5lPjwvc3ZnPg==");
}
```
也能完美适用于ios和安卓。

## 圆环放大的动画

参考[人人博客](https://fed.renren.com/2017/12/17/svg-animation/)，如下
```html
<svg width="22px" height="22px">
    <circle r="8" cx="11" cy="11" fill="#fff" stroke="#2492fc">
        <animate attributeName="r" from="8" to="10" dur="0.3s" begin="mouseover" fill="freeze" class="magnify"/>
        <animate attributeName="r" from="10" to="8" dur="0.3s" begin="mouseout" fill="freeze" class="shrink"/>
    </circle>
</svg>
```

![svg](/img/svg.png)

## 打开新窗口

参考[asaki](https://blog.asaki.me/2018/05/07/)，如下

1.大多数现代浏览器发现一个打开新窗口的操作不一定是由用户主动发起的时候，浏览器就有可能会阻止这个打开新窗口的操作，比如通过 AJAX 从服务器获取到一个链接，然后用window.open在新窗口中打开这个链接，浏览器就会拦截这个弹窗。

解决方法，先打开页面再修改链接：
```
$a.onclick = () => {
  const win = window.open()
  fetch('<URL>')
    .then(resp => {
      win.location.href = resp.json().url
    })
}
```

2.使用window.open或者通过 a 标签的target="_blank"打开新窗口子页面时，新页面会将一个叫作opener的全局对象指向源页面的窗口对象，浏览器已经对这个对象做了很多限制，但是我们还是可以通过 opener.location.replace 更改源页面的链接，这样就很有可能实现钓鱼的目的
```
// 源页面 https://a.com
window.open('https://b.com')

// 新页面（可能是个外部广告页） https://b.com
window.opener.location.replace('https://aa.com') // 直接把源页面地址悄悄替换成一个高仿钓鱼网站
```

另外由于这个opener，浏览器会把新窗口和源窗口放同一个进程上，从而新窗口会影响到源窗口的性能

可以通过跨站隔离来解决：

（1）通过 a 标签target="_blank"，我们可以再为其加上rel="noopener"（低版本 Firefox 仅支持rel="noreferrer"）的属性来隔绝opener
```html
<a href="<URL>" target="_blank" rel="noopener noreferrer">Click me!</a>
```

(2)对于window.open
```
// 较高版本
window.open('<URL>', 'windowName', 'noopener')

// 较低版本
const win = window.open()
win.opener = null
win.location = '<URL>'
```

## tips

1.void 后面你随便跟上一个表达式，返回的都是 undefined， 且比 undefined 占用的字节少， 并且不能被重写；类似的还有 ```0.._```

2.判断是不是数组

```js
function isArray(a) {
  return Array.isArray ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
}
```

3.判断是否为Dom元素

```js
function(obj) {
  // 确保 obj 不是 null 
  // 并且 obj.nodeType === 1
  return !!(obj && obj.nodeType === 1);
}
```