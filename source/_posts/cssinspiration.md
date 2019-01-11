---
title: CSS灵感
photo: /img/css3.png
date: 2019-01-10 20:20:19
excerpts: CSS灵感
tags: 'css'
---

![图片内容](/img/css3.png)

# CSS灵感

------

本文总结自[chokcoco的分享](https://chokcoco.github.io/CSS-Inspiration/#/./init), 可能会加一些自己工作中遇到的灵感。

### 单侧投影

- 外 box-shadow 前四个参数：x 偏移值、y 偏移值 、模糊半径、扩张半径。
- 单侧投影的核心是第四个参数：扩张半径。这个参数会根据你指定的值去扩大或缩小投影尺寸，如果我们用一个负的扩张半径，而他的值刚好等于模糊半径，那么投影的尺寸就会与投影所属的元素尺寸完全一致，除非使用偏移量来移动他，否则我们将看不到任何投影。

{% iframe https://codepen.io/Tvinsh/embed/NeOvXy/ 100% 500 %}

<p></p>

### 立体投影

- 立体投影的关键点在于利用伪元素生成一个大小与父元素相近的元素，然后对其进行 rotate 以及定位到合适位置，再赋于阴影操作。
- 颜色的运用也很重要，阴影的颜色通常比本身颜色要更深，这里使用 hsl 表示颜色更容易操作，l 控制颜色的明暗度。

{% iframe https://codepen.io/Tvinsh/embed/NeOvEz/ 100% 500 %}

<p></p>

### 长阴影

- 借用了元素的两个伪元素
- 通过渐变色填充两个伪元素，再通过位移、变换放置在合适的位置

{% iframe https://codepen.io/Tvinsh/embed/VqEMZp/ 100% 500 %}

<p></p>

### 圆环进度条动画

- 圆环进度条的移动本质上是阴影顺序延时移动的结果。

{% iframe https://codepen.io/Tvinsh/embed/BvqwjP/ 100% 500 %}

<p></p>

### CSS 否定伪类

- :not(X)，是以一个简单的以选择器X为参数的功能性标记函数。它匹配不符合参数选择器X描述的元素
- 可以利用这个伪类提高规则的优先级。例如， #foo:not(#bar) 和 #foo 会匹配相同的元素。 但是前者的优先级更高
- :not(foo) 将匹配任何非foo元素，包括html和body
- 这个选择器只会应用在一个元素上，你无法用它排除所有父元素。比如， body :not(table) a 将依旧会应用在table内部的a 上, 因为 tr将会被 :not()这部分选择器匹配

{% iframe https://codepen.io/Tvinsh/embed/oJaGzW/ 100% 500 %}

<p></p>

### 伪元素 :focus-within 纯 CSS 方式实现掘金登陆特效

- :focus-within 伪类选择器，它表示一个元素获得焦点，或，该元素的后代元素获得焦点。划重点，它或它的后代获得焦点
- 这也就意味着，它或它的后代获得焦点，都可以触发 :focus-within

{% iframe https://codepen.io/Tvinsh/embed/YdJrNE/ 100% 500 %}

<p></p>

### :placeholder-shown

- :placeholder-shown: CSS 伪类 在 ```<input>``` 或 ```<textarea>``` 元素显示 placeholder text 时生效

{% iframe https://codepen.io/Tvinsh/embed/KbGXaj/ 100% 500 %}

<p></p>

### 伪元素+border实现气泡对话框

- 使用 border 生成三角形形状
- 使用 filter: drop-shadow 生成整体阴影

{% iframe https://codepen.io/Tvinsh/embed/MZPEOY/ 100% 500 %}

<p></p>

### 毛玻璃效果

- 毛玻璃效果的重点在于，需要虚化的底图部分是会随页面 resize 变换而变换的
- background-attachment：如果指定了 background-image ，那么 background-attachment 决定背景是在视口中固定的还是随着包含它的区块滚动的
- fixed 关键字表示背景相对于视口固定。即使一个元素拥有滚动机制，背景也不会随着元素的内容滚动

{% iframe https://codepen.io/Tvinsh/embed/WLaXBj/ 100% 500 %}

<p></p>

### mix-blend-mode 实现抖音 LOGO

- 混合模式最常见于 photoshop 中，是 PS 中十分强大的功能之一
- 主要借助伪元素实现了整体 J 结构，借助了 mix-blend-mode 实现融合效果
- 利用 mix-blend-mode: lighten 混合模式实现两个 J 形结构重叠部分为白色

{% iframe https://codepen.io/Tvinsh/embed/WLaXVO/ 100% 500 %}

<p></p>

### mix-blend-mode 实现图片任意颜色赋值

- [详情](https://www.cnblogs.com/coco1s/p/8080211.html)

{% iframe https://codepen.io/Tvinsh/embed/gZBobM/ 100% 500 %}

<p></p>

### transition-delay 实现按钮 border hover 时的动画效果

- 给容器每一边的 border 合理设置 transition-delay，可以延缓动画的发生，再连贯的拼凑在一起实现一些效果

{% iframe https://codepen.io/Tvinsh/embed/YdJYXP/ 100% 500 %}

<p></p>

### steps 实现点赞动画

- [steps详情](https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/)

{% iframe https://codepen.io/Tvinsh/embed/BvdXPY/ 100% 500 %}

<p></p>

### -webkit-text-stroke 文字描边

- [详情](https://www.zhangxinxu.com/wordpress/2017/06/webkit-text-stroke-css-text-shadow/)

{% iframe https://codepen.io/Tvinsh/embed/ebPyBP/ 100% 500 %}

<p></p>






































