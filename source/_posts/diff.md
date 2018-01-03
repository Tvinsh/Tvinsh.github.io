---
title: virtual dom 和 diff
photo: /img/dom.jpg
excerpts: 简单介绍下git的diff 过程 
tags: vue
---

![图片内容](/img/dom.jpg)

react中使用了Virtual Dom，使得我们在更改数据状态的时候，通过其diff算法，降低了对性能的损耗，在实际开发中，我们并不需要接触到其中的diff算法，但是适当了解其中的工作原理，肯定有利于我们理解整个框架。vue2.0 开始也引入了Virtual dom，可见virtual dom确实收到了大家的认可，vue和react实现的virtual dom基本上是类似的。

### virtual Dom

至于为什么要选择virtual dom是因为 dom操作很慢，但是javascript很快，用javascript替代直接操作dom是一个比较好的选择；

virtual dom实际上是一个javascript对象，用来描述一个和dom树类似的virtual dom树，当有数据变动时，diff算法会比较变化前后的dom树，找出不一样的地方，然后视图更新的时候，只更新有数据变动的地方，这样就很大地降低了性能消耗。

以下是vue源码中[vnode.js](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js)中的一段：

```js
    export default class VNode {
        tag: string | void;
        data: VNodeData | void;
        children: ?Array<VNode>;
        text: string | void;
        elm: Node | void;
        ns: string | void;
        context: Component | void; // rendered in this component's scope
        functionalContext: Component | void; // only for functional component root nodes
        key: string | number | void;
        componentOptions: VNodeComponentOptions | void;
        componentInstance: Component | void; // component instance
        parent: VNode | void; // component placeholder node
        raw: boolean; // contains raw HTML? (server only)
        isStatic: boolean; // hoisted static node
        isRootInsert: boolean; // necessary for enter transition check
        isComment: boolean; // empty comment placeholder?
        isCloned: boolean; // is a cloned node?
        isOnce: boolean; // is a v-once node?

        constructor (
            tag?: string,
            data?: VNodeData,
            children?: ?Array<VNode>,
            text?: string,
            elm?: Node,
            context?: Component,
            componentOptions?: VNodeComponentOptions
        ) {
            /*当前节点的标签名*/
            this.tag = tag
            /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
            this.data = data
            /*当前节点的子节点，是一个数组*/
            this.children = children
            /*当前节点的文本*/
            this.text = text
            /*当前虚拟节点对应的真实dom节点*/
            this.elm = elm
            /*当前节点的命名空间*/
            this.ns = undefined
            /*编译作用域*/
            this.context = context
            /*函数化组件作用域*/
            this.functionalContext = undefined
            /*节点的key属性，被当作节点的标志，用以优化*/
            this.key = data && data.key
            /*组件的option选项*/
            this.componentOptions = componentOptions
            /*当前节点对应的组件的实例*/
            this.componentInstance = undefined
            /*当前节点的父节点*/
            this.parent = undefined
            /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
            this.raw = false
            /*静态节点标志*/
            this.isStatic = false
            /*是否作为跟节点插入*/
            this.isRootInsert = true
            /*是否为注释节点*/
            this.isComment = false
            /*是否为克隆节点*/
            this.isCloned = false
            /*是否有v-once指令*/
            this.isOnce = false
        }

        // DEPRECATED: alias for componentInstance for backwards compat.
        /* istanbul ignore next */
        get child (): Component | void {
            return this.componentInstance
        }
    }
```

从中可以看到，vue定义了一个vnode对象，用来描述dom节点，对象中定义了很多字段，表示节点的各个属性。

举个例子：

example:
```js
    {
        tag: 'div'
        data: {
            class: 'wrapper'
        },
        children: [
            {
                tag: 'p',
                data: {
                    class: 'demo'
                }
                text: 'hello,VNode'
            }
        ]
    }
```
渲染成为

```html
    <div class="wrapper">
        <p class="demo">hello,VNode</p>
    </div>
```

了解了virtual dom之后，我们知道在数据改变后，需要重新渲染视图，此时会通过相应的diff方法，先比对virtual dom树的前后差异，然后通过patch方法最小化的局部更新视图。下面简单了解以下其中的diff算法。

### diff

看一些文章介绍diff的时候，都会提到时间复杂度，我们先看看时间复杂度是指什么的。

维基百科上对于[时间复杂度](https://zh.wikipedia.org/wiki/%E6%97%B6%E9%97%B4%E5%A4%8D%E6%9D%82%E5%BA%A6)的解释：

> 在计算机科学中，算法的时间复杂度是一个函数，它定量描述了该算法的运行时间。这是一个代表算法输入值的字符串的长度的函数。时间复杂度常用大O符号表述，不包括这个函数的低阶项和首项系数。使用这种方式时，时间复杂度可被称为是渐近的，亦即考察输入值大小趋近无穷时的情况。例如，如果一个算法对于任何大小为 n （必须比 n0 大）的输入，它至多需要 5n3 + 3n 的时间运行完毕，那么它的渐近时间复杂度是 O(n3)。

时间复杂度举例：

例1: 

```js
    for ( var i = 0; i < n; i++ ) {
        fn()
    }
```    
这段代码的语句频度为：2n，其时间复杂度为：O(n) ，即为【线性阶】

```js
    for ( var i = 0; i < n; i++ ) {
        for (var j=0; j < m; j++ ) {
            fn()
        }
    }
```
语句频度为：n * n * 2 = 2n2 ，其时间复杂度为：O(n2) ，即为【平方阶】

![矩阵乘法](/img/jz.png)

一个m×n，n×p的矩阵相乘，其时间复杂度为O(mnp)，朴素算法近似为O(n3)，即为【立方阶】

如果用传统的diff算法对Virtual Dom进行diff，通过循环递归对节点进行依次对比，时间复杂度为O(n3)；

然而这种深度遍历，能够定位每个节点的改变，虽然更精确一点，但是计算时间以及对性能的消耗也会更多，在virtual dom的diff 算法中，采取的是对于两棵树进行逐层比较。

![diff](/img/df4.png)

virtual dom采取这种逐层比较的diff算法，使得其时间复杂度变成O(n)；

举个例子：

移动节点：

![diff](/img/df1.png)

如上图,将父节点 R 的 A 子节点移动到 B 子节点的下面，如果按照常规理解的diff方法，因为 A 节点的内容没有变，应该是直接将A移动到B的下面，但是在 virtual Dom中，它会先对比 R 的子节点那一层，发现 A 被移除了，那直接将 A 销毁，然后对比 R 的子节点的子节点那一层，发现 B 的子节点多了一个 A，于是重新创建一个 A 节点。

标签更改：

![diff](/img/df5.png)

如上图，将 R 的子节点中的标签 div 换成了 p 标签，那么会移除div 包括其子节点，然后重新创建 p 节点以及 B C 子节点，即使B C一直都没有变化，只要父节点被移除，其子节点就不用在进行diff 操作了，直接被移除掉。


列表节点：(key的重要性)

![diff](/img/df3.png)

在动态渲染一些列表节点的时候，diff 操作也是逐层对比，另外virtual dom 是记不住这些节点的，如果 B 节点移动了，那么就会先移除 B 节点然后重新创建；

如图，父节点 R 有 ABC 三个子节点，这些子节点的类型是一样的，比如都是li，然后在这些子节点中插入了一个 X 节点，这个时候就需要开发人员帮助 diff 方法去完成diff 操作，就是给每个子节点加上相应的 key 值，如果不加key值，那么 diff算法会先对比 A 节点，A节点没有变化，然后对比 B 节点，发现 B 节点变成了 X 节点，于是 删除 B 节点，创建 X 节点，然后对比 C 节点，发现 C 节点变成了 B 节点，于是删除 C 节点创建 B 节点，然后发现多了一个 C 节点，于是创建 C 节点，整个 diff 过程看下来，发现这样处理很浪费资源。   当加上了 key 之后，virtual dom就认识了 ABC 节点，当加了 X 节点之后，它不会对其他没有变化的子节点进行操作，只是创建出 X 节点。

通过列表节点的diff机制，我们可以看出在写列表渲染时，key的重要性，key必须是唯一且稳定的。唯一是指在所有的子节点中，不能出现重复的key，如果出现了重复的key，diff方法就晕菜了，不知道怎么操作了；稳定性是指不管渲染几次，key的值都是一样的，所以key不能用数组的下标来表示，这样虽然唯一了，但是不稳定，比如上图中数组中间插入了一个节点，就会导致后面节点的key都变了。

简单概括下，diff 过程就是逐层对比 dom 层级，如果相同层级的同一个节点有修改，则进行相应的patch 操作，否则就是粗暴地直接删除节点或创建节点。vue和react中都是类似的对比方法，比如vue中的对比方法如下：

 对比 oldVnode 和 vnode，如果 oldVnode未定义，直接创建一个新节点。如果是同一个节点，则进行 patch 修改现有的节点。

判断两个VNode节点是否是同一个节点，需要满足以下条件：

> key相同
tag（当前节点的标签名）相同
是否data（当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息）都有定义
当标签是 input 的时候，type必须相同 因为某些浏览器不支持动态修改 input 类型，所以他们被视为不同类型

