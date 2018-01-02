---
title: webpack2.0基础配置介绍
date: 2017-05-20 22:30:10
photo: /img/webpack.png
tags: webpack
excerpts: '今天简单介绍下webpack2.0的一些基础配置。'
---
今天简单介绍下webpack2.0的一些基础配置。

介绍
=============

> 什么是webpack？

Webpack 原本是一个针对 JavaScript 代码的模块打包工具，后来演变成了一个针对所有前端代码的管理工具。

![webpack官网图片](/img/webpack.png)

上图是webpack的官网图片，可以理解为：
* **左侧**
    1.代表前端各种资源之间的依赖关系，每种类型的资源都可以被认作是一个模块，并可以相互引用。

* **右侧**
    1.可以将左侧不同资源统一生成浏览器可识别的、静态的、普遍的css、html、js、png等资源；
    2.通过webpack构建之后，资源模块的总数变少了，其中包括隐藏了一些依赖关系，压缩合并了一些资源模块。

> 准备工作

使用 npm 或者 yarn 将webpack2的包添加到全局环境和本地项目里面，然后在项目根目录新建一个webpack.config.js。
准备工作完成后，开始介绍基础配置。

> 配置

![配置图片](/img/peizhi.png)

上图是通过webpack将 app.js 打包成 app.bundle.js， 当执行了 **webpack -p** (p表示生产环境，webpack会压缩丑化代码)  其中webpack做了以下事情：

1.从context 指定的目录开始查找入口文件；

2.entry指定入口文件，webpack读取入口文件内容，在解析代码时，每一个引入的依赖都会被打包到最终的构建结果当中。它会接着搜索那些依赖，以及那些依赖的依赖，直到“依赖树”的叶子节点。

3.output指定出口文件，webpack 将所有东西打包到 output.path 对应的文件夹里，使用 output.filename 对应的命名模板来命名（[name] 被 entry 里的对象键值所替代）

> 入口(entry) 和 出口(output)

* 入口entry 的类型可以是 String ｜ Array | Object , 也可以是动态入口

* 出口output 包括了一组选项，指示 webpack 如何去输出、以及在哪里输出你的构建结果，列举几个常用的选项
    1.**path: path.resolve(__dirname, "dist")** path指定输出文件的目标路径，必须是绝对路径
    2.**filename** 指定入口文件构建之后输出的文件名：

    ```
    filename: "bundle.js"  固定输出的文件名

    filename: "[name].js"  模版写法，多个入口的时候会对应生成多个出口文件  

    filename: "[chunkhash].js"  用于长效缓存 
    ```
    （关于为什么可以缓存以及chunkhash和hash的区别，可以看*[这篇文章](https://zhuanlan.zhihu.com/p/23595975)*）

    3.**publicPath** 输出解析文件的目录，url 相对于 HTML 页面，可以在这里配置cdn的路径
    4.**library** 导出库的名称 也就是当使用require时需要引入的文件名，也可以通过配置library全局命名空间里使用某些自己的方法
    5.**chunkFilename** 附加或者公用模块的文件名



* **entry-output例子**

1. 多个文件打包到一起

![多个文件打包在一起](/img/entry1.png)

上图中，入口是数组形式的，执行 webpack -p 之后，所有文件会按数组顺序一起打包到 dist/app.bundle.js 一个文件当中，app对应入口的键名。

  2.多个文件，多个输出

![多个文件多个输出](/img/entry2.png)

上图中，所有文件依次打包为键名对应的文件

> 模块 module

模块中的**rules** 定义模块规则（配置 loader、解析器等选项），其中常用的配置项有：

1.**test: /\.js?$/** 定义匹配条件
2.**include** 定义必须匹配项
3.**exclude** 必不匹配选项（优先于 test 和 include）
4.**loader** 配置相关文件的loader，相对于上下文进行解析，如解析 sass 需使用sass-loader, 与1.0不同的是，"-loader" 后缀在 2.0 中不再是可选的

> 解析 resolve

resolve 的选项能设置模块如何被解析， 列举一些常用的选项：

1.**modules** 数组形式，告诉 webpack 解析模块时应该搜索的目录
2.**extensions** 拓展名，自动解析确定的拓展，默认值为[.js,.json],使用require引入模块时可以不用添加 .js
3.**alias** 创建 import 或 require 的别名，来确保模块引入变得更简单，可以是数组或对象形式，
4.**moduleExtensions** 在解析模块（例如，loader）时尝试使用的扩展，如果想不带 -loader 后缀使用 loader，需在这里的数组中加上 -loader
5.**plugins** 应该使用的额外的解析插件列表

> 插件 plugins

数组形式，附加插件列表，使用时，需先导入非 webpack 默认自带插件，通过new 来使用插件，如 使用HMR插件，需在plugins数组中加上new webpack.HotModuleReplacementPlugin()；

> externals

可以是数组，字符串以及正则形式，如 externals: ["vue", /^@angular\//],告诉webpack不要打包这些模块，而是在运行时从环境中请求他们

> 开发中 devServer

webpack 有它自己的开发服务器， webpack-dev-server 能够用于快速开发应用程序，列举一些常用的选项：

1.**contentBase** 告诉服务器从哪里提供内容，默认情况下，将使用当前工作目录作为提供内容的目录
2.**compress** 所有来自contentBase的文件都做 gzip 压缩
3.**host** 指定host， 默认是localhost
4.**hot** bollen 是否启用webpack 热替换
5.**noInfo** 启动时和每次保存之后，那些显示的 webpack 包(bundle)信息的消息将被隐藏，错误和警告仍然会显示。
5.**port** 端口号


一些综合例子
============= 

## 分离第三方库代码

![library](/img/library.png)

CommonsChunkPlugin从不同的 bundle 中提取所有的公共模块，并且将他们加入公共 bundle 中。

如果没有加上 manifest 那一行配置， 执行webpack的时候也会将vender 分离出来，但当我们改变应用的代码并且再次运行 webpack，可以看到 vendor 文件的 hash 改变了，这样就不能利用浏览器缓存了，分离代码就没有意义了。

原因在于，每次构建时，webpack 生成了一些 webpack runtime 代码，用来帮助 webpack 完成其工作，如果存在公共模块，运行时代码会被提取到公共模块中，所以我们需要将运行时代码提取到一个单独的 manifest 文件中。

## 分离css

![css](/img/css.png)

如图，如果不使用 'extract-text-webpack-plugin'， 只用注释掉的那行use，这样 CSS 会跟 JavaScript 打包在一起，并且在初始加载后，通过一个 style 标签注入样式，这样的话浏览器不能去异步且并行去加载 CSS， 页面需要等待整个 JavaScript 文件加载完，才能进行样式渲染。而 'extract-text-webpack-plugin' 可以将css 单独 打包以解决这个问题。

上图中的 'html-webpack-plugin' 插件会自动生成 html文件，且引入打包生成的相关js  和 css 文件

上图中的 devServer 为 webpack 服务器配置， 在命令行执行 webpack-dev-server 可以在 localhost：9000 直接访问页面，在目标文件夹中是看不到编译后的文件的,实时编译后的文件都保存到了内存当中， 需要注意的是，在输出文件夹中，需要有一个html文件，供服务器访问，所以如果需要使用 webpack-dev-server， 需要将HtmlWebpackPlugin 中的filename 的值 改成 './index.html'， 即将index.html生成在 输出文件夹中。

## 如何编写一个插件

在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。

* **compiler** 对象代表了完整的 webpack 环境配置。
* **compilation** 对象代表了一次单一的版本构建和生成资源。

插件都是被实例化的带有 apply 原型方法的对象。这个 apply 方法在安装插件时将被 webpack 编译器调用一次。apply 方法提供了一个对应的编译器对象的引用，从而可以访问到相关的编译器回调。


## 一些常用的插件

下表列出了比较常用的一些插件，更多插件可以看[官方github上的列表](https://github.com/webpack-contrib/awesome-webpack#webpack-plugins)

|名称|描述|
|:-:|--|
|CommonsChunkPlugin  |  将多个入口起点之间共享的公共模块，生成为一些 chunk，并且分离到单独的 bundle 中，例如，vendor.bundle.js 和 app.bundle.js|
|DefinePlugin  |  允许在编译时(compile time)配置的全局常量，用于允许「开发/发布」构建之间的不同行为|
|DllPlugin  |  提供分离打包的方式，可以极大提高构建时间性能  *[这是关于dll比较详细的介绍](https://segmentfault.com/a/1190000005969643)*|
|ExtractTextWebpackPlugin  |  从 bundle 中提取文本（CSS）到分离的文件（app.bundle.css）|
|HtmlWebpackPlugin  |  用于简化 HTML 文件（index.html）的创建|
|UglifyJSPlugin  |  代码丑化和压缩|






