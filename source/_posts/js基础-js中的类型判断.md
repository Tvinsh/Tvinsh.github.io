---
title: '[js基础] js中的类型判断'
date: 2017-10-12 21:55:15
photo: /img/js.jpg
tags: javascript
excerpts: '类型判断在 web 开发中有非常广泛的应用'
---
博客搭了很久也没有怎么动过，今天开始坚持写一点东西。许多东西都是网上看来的，也有自己的一些总结，就当日后复习的笔记。

### 正文前

类型判断在 web 开发中有非常广泛的应用，简单的有判断数字还是字符串，进阶一点的有判断数组还是对象，再进阶一点的有判断日期、正则、错误类型，再再进阶一点还有比如判断 plainObject、空对象、Window 对象等等。下面逐一介绍一下。

### typeof

我们最常用的应该就是 `typeof` 了, `typeof` 是一个正宗的运
算符，就跟加减乘除一样，在 ES6 前，JavaScript 共六种数据类型，分别是：

Undefined、Null、Boolean、Number、String、Object

然而当我们使用 typeof 对这些数据类型的值进行操作的时候，返回的结果却不是一一对应，分别是：

undefined、object、boolean、number、string、object

注意以上都是小写的字符串。Null 和 Object 类型都返回了 object 字符串。

尽管不能一一对应，但是 typeof 却能检测出函数类型：

```javascript
    function a() {}
    console.log(typeof a); // function
```

所以 typeof 能检测出六种类型的值，但是，除此之外 Object 下还有很多细分的类型呐，如 Array、Function、Date、RegExp、Error 等,所以 typeof 并不能判断出这些类型。

```javascript
    var date = new Date();
    var error = new Error();
    console.log(typeof date); // object
    console.log(typeof error); // object
```

### Obejct.prototype.toString

ES5对于toString的说明是，当 toString 方法被调用的时候，下面的步骤会被执行：

> 如果 this 值是 undefined，就返回 [object Undefined]
如果 this 的值是 null，就返回 [object Null]
让 O 成为 ToObject(this) 的结果
让 class 成为 O 的内部属性 [[Class]] 的值
最后返回由 "[object " 和 class 和 "]" 三个部分组成的字符串

通过规范，我们至少知道了调用 Object.prototype.toString 会返回一个由 "[object " 和 class 和 "]" 组成的字符串，而 class 是要判断的对象的内部属性。

看几个demo：
```javascript
    console.log(Object.prototype.toString.call(undefined)) // [object Undefined]
    console.log(Object.prototype.toString.call(null)) // [object Null]
    var date = new Date();
    console.log(Object.prototype.toString.call(date)) // [object Date]
```

由此我们可以看到这个 class 值就是识别对象类型的关键！

正是因为这种特性，我们可以用 Object.prototype.toString 方法识别出更多类型！

一共可以识别至少 14 种类型，具体看以下demo：
```javascript
    var number = 1;          // [object Number]
    var string = '123';      // [object String]
    var boolean = true;      // [object Boolean]
    var und = undefined;     // [object Undefined]
    var nul = null;          // [object Null]
    var obj = {a: 1}         // [object Object]
    var array = [1, 2, 3];   // [object Array]
    var date = new Date();   // [object Date]
    var error = new Error(); // [object Error]
    var reg = /a/g;          // [object RegExp]
    var func = function a(){}; // [object Function]

    console.log(Object.prototype.toString.call(Math)); // [object Math]
    console.log(Object.prototype.toString.call(JSON)); // [object JSON]

    function a() {
        console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
    }
    a();

    function checkType() {
        for (var i = 0; i < arguments.length; i++) {
            console.log(Object.prototype.toString.call(arguments[i]))
        }
    }

    checkType(number, string, boolean, und, nul, obj ,array, date, error, reg, func)
```

### 自己封装

既然有了 Object.prototype.toString 这个神器！那就让我们写个 type 函数帮助我们以后识别各种类型的值吧！

写一个 type 函数能检测各种类型的值，如果是基本类型，就使用 typeof，引用类型就使用 toString。此外鉴于 typeof 的结果是小写，我也希望所有的结果都是小写。

考虑到实际情况下并不会检测 Math 和 JSON，所以去掉这两个类型的检测。

我们来写一版代码：

```javascript
    // 第一版
    var class2type = {};

    // 生成class2type映射
    "Boolean Number String Function Array Date RegExp Object Error Null Undefined".split(" ").map(function(item, index) {
        class2type["[object " + item + "]"] = item.toLowerCase();
    })

    function type(obj) {
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[Object.prototype.toString.call(obj)] || "object" :
            typeof obj;
    }
```

但是注意，在 IE6 中(虽然现在已经没有ie6了)，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]！

我去，竟然还有这个兼容性！有什么简单的方法可以解决吗？那我们再改写一版，绝对让你惊艳！

```javascript
    // 第二版
    var class2type = {};

    // 生成class2type映射
    "Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
        class2type["[object " + item + "]"] = item.toLowerCase();
    })

    function type(obj) {
        // 一箭双雕
        if (obj == null) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[Object.prototype.toString.call(obj)] || "object" :
            typeof obj;
    }
```

### plainObject

下面我们尝试着进阶一点，plainObject 来自于 jQuery，可以翻译成纯粹的对象，所谓"纯粹的对象"，就是该对象是通过 "{}" 或 "new Object" 创建的，该对象含有零个或者多个键值对。

jQuery提供了 isPlainObject 方法进行判断，先让我们看看使用的效果：
```javascript
    function Person(name) {
        this.name = name;
    }

    console.log($.isPlainObject({})) // true

    console.log($.isPlainObject(new Object)) // true

    console.log($.isPlainObject(Object.create(null))); // true

    console.log($.isPlainObject(Object.assign({a: 1}, {b: 2}))); // true

    console.log($.isPlainObject(new Person('yayu'))); // false

    console.log($.isPlainObject(Object.create({}))); // false
```

由此我们可以看到，除了 {} 和 new Object 创建的之外，jQuery 认为一个没有原型的对象也是一个纯粹的对象。

我们看下isPlainObject的源码：
```javascript
    // 上节中写 type 函数时，用来存放 toString 映射结果的对象
    var class2type = {};

    // 相当于 Object.prototype.toString
    var toString = class2type.toString;

    // 相当于 Object.prototype.hasOwnProperty
    var hasOwn = class2type.hasOwnProperty;

    function isPlainObject(obj) {
        var proto, Ctor;

        // 排除掉明显不是obj的以及一些宿主对象如Window
        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }

        /**
        * getPrototypeOf es5 方法，获取 obj 的原型
        * 以 new Object 创建的对象为例的话
        * obj.__proto__ === Object.prototype
        */
        proto = Object.getPrototypeOf(obj);

        // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
        if (!proto) {
            return true;
        }

        /**
        * 以下判断通过 new Object 方式创建的对象
        * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
        * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
        */
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;

        // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
        return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
    }
```

注意：我们判断 Ctor 构造函数是不是 Object 构造函数，用的是 hasOwn.toString.call(Ctor)，这个方法可不是 Object.prototype.toString,请看以下例子：
```javascript
    console.log(hasOwn.toString.call(Ctor)); // function Object() { [native code] }
    console.log(Object.prototype.toString.call(Ctor)); // [object Function]
```

发现返回的值并不一样，这是因为 hasOwn.toString 调用的其实是 Function.prototype.toString，毕竟 hasOwnProperty 可是一个函数！

而且 Function 对象覆盖了从 Object 继承来的 Object.prototype.toString 方法。函数的 toString 方法会返回一个表示函数源代码的字符串。具体来说，包括 function关键字，形参列表，大括号，以及函数体中的内容。

### EmptyObject

jQuery提供了 isEmptyObject 方法来判断是否是空对象，代码简单，我们直接看源码：

```javascript
    function isEmptyObject( obj ) {

        var name;

        for ( name in obj ) {
            return false;
        }

        return true;
    }
```

其实所谓的 isEmptyObject 就是判断是否有属性，for 循环一旦执行，就说明有属性，有属性就会返回 false。

但是根据这个源码我们可以看出isEmptyObject实际上判断的并不仅仅是空对象。

举个栗子：
```javascript
    console.log(isEmptyObject({})); // true
    console.log(isEmptyObject([])); // true
    console.log(isEmptyObject(null)); // true
    console.log(isEmptyObject(undefined)); // true
    console.log(isEmptyObject(1)); // true
    console.log(isEmptyObject('')); // true
    console.log(isEmptyObject(true)); // true
```

### Window对象

Window 对象作为客户端 JavaScript 的全局对象，它有一个 window 属性指向自身,我们可以利用这个特性来判断。

```javascript
    function isWindow( obj ) {
        return obj != null && obj === obj.window;
    }
```

### isElement

判断是不是dom元素
```javascript
    isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
    };
```

### 结语

这一篇就暂时写到这里，还有很多具体的判断，需要有特定的场景才能更好的应用，如果后续想到了，再添加进来，这一篇也是看了网大神博客总结之后得出的，[感谢大神！](https://github.com/mqyqingfeng/Blog)