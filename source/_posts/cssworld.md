---
title: css world 读后总结
photo: /img/css3.png
date: 2018-06-18 19:50:19
excerpts: css world 读后总结
tags: 'css'
---

![图片内容](/img/css3.png)

# css world 读后总结

------

张老师新书刚出来，就赶紧买了本让张老师签了名～也很快就读完了，今天突然翻到，就想着把书上临时做的笔记整理下，没有系统地整理，可能会有些乱。

### 概念

> 1.为什么 list-item 会出现项目符号,因为除了块级盒子外还生成了一个附加的盒子，学名“标记盒子”，专门用来放圆点，数字这些项目符号;

<p></p>

> 2.绝对定位元素的宽高百分比是相对于 padding box 的，非绝对定位元素则是相对于 content box 的;

<p></p>

> 3.max-width 会覆盖width，即使width用了!important;

<p></p>

> 4.“幽灵空白节点”：HTML5文档声明中，内联元素的所有解析和渲染表现就如同每个行框盒子（每一行就是一个行框盒子）的前面有一个空白节点一样。

<p></p>

> 5.margin, padding的百分比值无论是水平方向还是垂直方向均是相对于宽度计算的；可以利用padding进行一些大小屏的适配；

<p></p>

> 6.margin:auto;如果一侧定值，一侧auto，则auto为剩余空间的大小；所以右对齐可以通过margin-left: auto实现；

<p></p>

> 7.ex是css中的一个相对单位，指的是小写字母x的高度，即x-height，可以利用这个实现内联元素的垂直居中对齐

<p></p>

> 8.一个inline-block的元素，如果里面没有内联元素，或者overflow不是visible，则该元素的基线就是其margin底边线

<p></p>

> 9.PC端，默认滚动条均来自html，而不是body，一个让页面滚动条不发生晃动的小技巧

```css
html {
    overflow-y: scroll; // for ie8
}
:root {
    overflow-y: auto;
    overflow-x: hidden;
}
:root body {
    position: absolute;
}
body {
    width: 100vw;
    overflow: hidden;
}
```

```css
.icon-arrow {
    display: inline-block;
    width: 20px;
    height: 1ex; // 实现
    background: url(/images/5/arrow.png) no-repeat center;
}
```

> 10.absolute 是非常独立的css属性值，其样式和行为表现不依赖其他任何css属性就可以完成;

<p></p>

> 11.如果overflow不是定位元素，同时绝对定位元素和overflow容器之间没有定位元素，则overflow无法对absolute元素进行裁剪；

<p></p>

> 12.尽量不使用relative，尝试使用“无依赖的绝对定位”，如果一定要用，要最小化使用

<p></p>

> 13.字体分为衬线字体和无衬线字体，font-family的属性值，serif表示衬线，sans-serif表示无衬线

<p></p>

> 14.text-transform 字符大小写，设置uppercase或lowercase后，显示的永远是大写或小写

<p></p>

> 15.background position的计算公式：
positionX = （容器宽度-图片宽度）* percentX；
positionY = （容器高度-图片高度）*perventY；

### 实例

1.某模块，文字少的时候居中显示，多于一行的时候居左显示；

{% iframe https://codepen.io/Tvinsh/embed/NyKPQv/ 100% 300 %}

2.利用 max-height实现展开收起,其中 max-height的值要比展开的内容高度大，因为max-height值比height计算值大的时候，元素高度就是height的计算高度，但是也不能太大，否则会感觉动画延迟了；

{% iframe https://codepen.io/Tvinsh/embed/GGGOmv/ 100% 300 %}

3.图片没加载时显示alt信息，当图片有了src属性后，就从普通元素变成了替换元素，此时 ::before, ::after 就都不支持了；

{% iframe https://codepen.io/Tvinsh/embed/gKKXBe/ 100% 300 %}

4.可以通过content属性给img设置图片，也可使普通元素变成替换元素,甚至可以给非img标签添加图片内容，比较实用的场景是logo，我们一般使用h1标签加背景图，现在可以用这个方法试试了,虽然表面上文字被替换了，实际上搜索引擎抓取的还是原始的文字信息;

{% iframe https://codepen.io/Tvinsh/embed/ERRbzy/ 100% 300 %}

5.伪元素辅助实现两端对齐，原理是:before辅助实现底对齐，:after辅助实现两端对齐,缺点是写的时候，有些地方不能换行或空格；

{% iframe https://codepen.io/Tvinsh/embed/vrrpGj/ 100% 300 %}

6.动态加载中的效果，需要使用::before 加上 display 为 block，为了在高版本浏览器下将原来的3个点推到最下面

{% iframe https://codepen.io/Tvinsh/embed/OEEzWd/ 100% 300 %}

7.content 计数器，其中：counter-reset设置计数器的名字并设置从哪个数开始计数，默认是0；counter-increment计数器递增,counter()方法，显示计数；

{% iframe https://codepen.io/Tvinsh/embed/YvvjwW/ 100% 300 %}

8.利用温和的padding，内联元素的padding尺寸有效，但是对布局没有产生影响，我们可以用来增加点击区域的大小，提升用户体验；也可以制作分隔线；

{% iframe https://codepen.io/Tvinsh/embed/mKKjrW/ 100% 300 %}

9.列表块两端对齐，一行显示3个，中间有2个20像素的间隙，可以使用css3:
```css
li {
    float: left;
    width: 100px;
    margin-right: 20px;
}
li:nth-of-type(3n) {
    margin-right: 0;
}
```
或者，我们可以通过增加容器宽度,此时ul的宽度就相当于 100% + 20px：
```css
ul {
    margin-right: -20px;
}
ul li {
    float: left;
    width: 100px;
    margin-right: 20px;
}
```

10.绝对或固定定位和text-align实现主窗体右侧的返回顶部

{% iframe https://codepen.io/Tvinsh/embed/ERRdrr/ 100% 300 %}

11.text-align:justify实现两端对齐，需要有分隔点，还要超过一行，此时非最后一行会两端对齐,此时可以利用空标签进行占位，使得有效标签非最后一行

{% iframe https://codepen.io/Tvinsh/embed/QxxYQg/
100% 300 %}




