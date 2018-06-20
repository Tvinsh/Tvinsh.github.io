---
title: 前端乱炖
photo: /img/css3.png
excerpts: 记录一些前端笔记，不定时更新
tags: js
---

![图片内容](/img/css3.png)

# 前端乱炖，不定时更新

------

#### 怎么画一条0.5px的边

参考[人人博客](https://fed.renren.com/2018/03/24/half-of-one-px/)，万能方法，能完美兼容ios和安卓，如下

```css
.hr.scale-half {
    height: 1px;
    transform: scaleY(0.5);
    transform-origin: 50% 100%;
}
```

1. 直接设置0.5px，在不同的浏览器会有不同的表现
- IOS的Chrome会画出0.5px的边，而安卓(5.0)原生浏览器是不行的

2. 线性渐变linear-gradient
```css
.hr.gradient {
    height: 1px;
    background: linear-gradient(0deg, #fff, #000);
}
```
- 这个效果和scale 0.5的差不多，都是通过虚化线，让人觉得变细了

3. boxshadow
```css
.hr.boxshadow {
    height: 1px;
    background: none;
    box-shadow: 0 0.5px 0 #000;
}
```
- 在Chrome和Firefox都非常完美，但是Safari不支持小于1px的boxshadow

4. svg
```css
.hr.svg {
    background: none;
    height: 1px;
    background: url("data:image/svg+xml;utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='1px'><line x1='0' y1='0' x2='100%' y2='0' stroke='#000'></line></svg>");
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzFweCc+PGxpbmUgeDE9JzAnIHkxPScwJyB4Mj0nMTAwJScgeTI9JzAnIHN0cm9rZT0nIzAwMCc+PC9saW5lPjwvc3ZnPg==");
}
```
也能完美适用于ios和安卓。

#### 圆环放大的动画

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