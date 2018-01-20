---
title: npm scripts 不完全总结
photo: /img/npm.png
date: 2018-01-19 18:50:19
excerpts: npm 允许在package.json文件里面，使用scripts字段定义脚本命令。
tags: 'js'
---

![图片内容](/img/npm.png)

# npm scripts 不完全总结

------

### 简介

npm 允许在package.json文件里面，使用scripts字段定义脚本命令。

好处： 

> 1. 项目的相关脚本，可以集中在一个地方
> 2. 不同项目的脚本命令，只要功能相同，就可以有同样的对外接口，默认会形成一些规范(eg:npm run dev; npm run build)
> 3. 可以利用 npm 提供的很多辅助功能


### 原理

npm 脚本的原理非常简单。每当执行npm run，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 npm 脚本里面。

比较特别的是，npm run新建的这个 Shell，会将当前目录的node_modules/.bin子目录加入PATH变量，执行结束后，再将PATH变量恢复原样。详细信息可以看这篇文章 [shell脚本执行的几种方式](http://blog.csdn.net/jx_jy/article/details/45821017)

这意味着，当前目录的node_modules/.bin子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。

所以我们在 package.json 文件内的 scripts 字段内指定任务的时候一般无需指定脚本文件的路径，只需要将脚本放到 ./node_module/.bin/ 目录下即可，命令会在这个目录下自动寻找对应的脚本文件。

> Tips:
> 自己写 npm 包的时候，可以将执行脚本放在 bin 文件夹下，然后在 package.json 中增加 bin 字段，值为指向 bin 文件夹下脚本的路径

### npm init & npm run

这两个是比较基本也比较常用的命令

npm init 通过询问几个问题，可以快速创建一份简单的 package.json 文件, 问题如下：

```
package name: (hello-npm-script)
version: (0.1.0)
description: hellp npm script
entry point: (index.js)
test command:
git repository:
keywords: npm, script
license: (MIT)...
```

npm run 是 npm run-script 的缩写， 一般都使用 npm run, 直接运行 npm run 或 npm run-script，不加参数会列出 scripts 属性下所有可运行的命令极其命令内容。

### 多个 npm script 的串行和并行

一般的项目都会包含多个 script 命令，难免会有将相关命令串行或者并行的需求

#### 串行

比如我们在运行测试脚本前，可以先通过 lint 脚本将代码检查一遍，这也是比较常规的做法，实现起来比较简单，只需要用```&&```符号将多个命令依次拼接起来就可以了。

```json
    {
        "test": "npm run lint:js && npm run lint:css && mocha tests/"
    }
```

需要注意的是，串行执行的时候如果前序命令失败（通常进程退出码非0），后续全部命令都会终止。

#### 并行

让多个命令并行也很简单，只需要将```&&```符号改成```&```即可，多条命令并行跟 js 里面同时发起多个异步请求非常类似，它只负责触发多条命令，而不管结果的收集，如果并行的命令执行时间差异非常大，可能有的运行结果在进程退出之后才输出，解决这个问题，只需要在命令后面加上```& wait```就可以了。

```json
    {
        "test": "npm run lint:js & npm run lint:css & mocha tests/ & wait"
    }
```

加上 wait 的额外好处是，如果我们在任何子命令中启动了长时间运行的进程，比如启用了 mocha 的 --watch 配置，可以使用 ctrl + c 来结束进程，如果没加的话，你就没办法直接结束启动到后台的进程。

#### npm-run-all

npm-run-all 这个包可以帮助我们实现更轻量和简洁的多命令运行。

串行：

```json
    {
        "test": "npm-run-all lint:js lint:css mocha"
    }
```
也可以简写成： 

```json
    {
        "test": "npm-run-all lint:* mocha"
    }
```

并行只需要加上```--parallel```参数就可以了， 我们也不要在后面加上```& wait```，npm-run-all 默认已经给我们加上了。

### 给 npm script 传递参数和添加注释

在后面加上 ```--``` 分隔符, 后面再加上参数，就可以将参数传递给 script 命令了，比如 eslint 内置了代码风格自动修复模式，只需给它传入 --fix 参数即可，我们可以这样写

```json
    {
        "lint:js:fix": "npm run lint:js -- --fix"
    }
```
> Tips:
> 如果不想单独声明 lint:js:fix 命令，在需要的时候直接运行： npm run lint:js -- --fix 来实现同样的效果

如果 script 命令比较多，给一些比较复杂的命令加上注释是个不错的选择，但是 json 天然是不支持添加注释，常规做法是在 readme 中写清楚说明，另外有两种比较 hack 的方式：

一. package.json 中可以增加 // 为键的值，注释就可以写在对应的值里面，npm 会忽略这种键

```json
    {
        "//": "运行所有代码检查和单元测试",
        "test": "npm-run-all --parallel lint:* mocha"
    }
```
这种方式的明显不足是，npm run 列出来的命令列表不能把注释和实际命令对应上，如果你声明了多个，npm run 只会列出最后那个。

二. 直接在 script 声明中做手脚，因为命令的本质是 shell 命令（适用于 linux 平台），我们可以在命令前面加上注释

```json
    {
        "test": "# 运行所有代码检查和单元测试 \n    npm-run-all --parallel lint:* mocha"
    }
```

注意注释后面的换行符 \n 和多余的空格，换行符是用于将注释和命令分隔开，这样命令就相当于微型的 shell 脚本，多余的空格是为了控制缩进，也可以用制表符 \t 替代，这种方法明显不利于命令的阅读

### 控制日志输出

在命令后面加上```--silent``` 或 ```-s```, 只会有命令本身的输出，其他运行日志全部隐藏，即```没有消息是最好的消息```;

在命令后面加上```--verbose``` 或 ```-d```, 这样会详细打印出了每个步骤的参数、返回值

### npm script 钩子

npm 脚本有pre和post两个钩子。举例来说，build 脚本命令的钩子就是 prebuild 和 postbuild。

```json
    {
        "clean": "rimraf ./dist && mkdir dist",
        "prebuild": "npm run clean",
        "build": "cross-env NODE_ENV=production webpack",
        "postbuild": "echo build done!"
    }
```
运行 npm run build 的时候，会自动按照如下的顺序执行

```
npm run prebuild && npm run build && npm run postbuild
```

npm 默认提供如下这些钩子：

```
prepublish，postpublish
preinstall，postinstall
preuninstall，postuninstall
preversion，postversion
pretest，posttest
prestop，poststop
prestart，poststart
prerestart，postrestart
```

### 使用变量

npm 提供了很多变量，比如环境变量，路径，当前正在执行的命令、包的名称和版本号、日志输出的级别等，这些都是预定义变量，npm 也可以自定义变量并引用

首先看看预定义变量，通过运行 npm run env 就能拿到完整的变量列表，这个列表非常长，可以使用 npm run env | grep npm_package | sort 拿到部分排序后的预定义环境变量：

```
// 作者信息
npm_package_author_name=SmadeyZhang

// 依赖信息
npm_package_dependencies_y_server=0.0.3
npm_package_dependencies_y_server_load_plugins=0.0.1
npm_package_dependencies_y_server_plugin_ejs=0.0.2
npm_package_dependencies_y_server_plugin_error=0.0.4
npm_package_dependencies_y_server_plugin_mock=0.0.6
npm_package_dependencies_y_server_plugin_proxy=0.0.2
npm_package_dependencies_y_server_plugin_static=0.0.2
npm_package_dependencies_y_server_plugin_template=0.0.5
...

// 基本信息
npm_package_description=Qidian M Website
npm_package_gitHead=8a05f05eed3d4511b11d64320705d2f51512c218
npm_package_license=ISC
npm_package_name=qidian-m
npm_package_pre_commit_0=lint
npm_package_readmeFilename=README.md
npm_package_repository_type=git
npm_package_repository_url=git+http://git.code.oa.com/qidian_proj/qidian-m.git
npm_package_version=1.0.0-dev

// 各种 script 脚本
npm_package_scripts_build=cross-env NODE_ENV=production gulp --gulpfile build/gulpfile.js && yworkcli --publish --hash
npm_package_scripts_dev=gulp dev --gulpfile build/gulpfile.js
npm_package_scripts_env=env
npm_package_scripts_lint=eslint src/static * --ext .js
npm_package_scripts_publish=npm run build
npm_package_scripts_test=gulp test --gulpfile build/gulpfile.js
```

变量的使用遵循 shell 里面的语法，直接在 npm script 给想要引用的变量前面加上 $ 符号即可，比如将打包后的文件基于版本号保存在 dist 目录中

```json
    {
        "mkdir": "mkdir -p dist/$npm_package_version"
        "build": "npm run mkdir && node index.js > dist/$npm_package_version"
    }
```

自定义变量，也就是在 package.json 中自定义一些字段，引用方法和预定义变量是一样的。比如我们用 http-server 起一个服务的时候，可以在 package.json 中新加了一个端口 port 字段，就可以在后面的 script 中引入

```json
    {   
        ...
        "config": {
            "port": "4000"
        },
        "scripts": {
            "server": "http-server -p $npm_package_config_port"
        }
        ...
    }
```

### 自动补全

npm 自身提供了自动完成工具 completion，将其集成到 bash 或者 zsh 里也非常容易
```
npm completion >> ~/.bashrc
npm completion >> ~/.zshrc
```

具体原理大家可以查看下官方文档

如果是使用 zsh ，有一个比较好用的插件推荐下，[zsh-better-npm-completion](https://github.com/lukechilds/zsh-better-npm-completion)

引入方法有多种，具体看上面的链接，感受下它的便利：
![zsh-better-npm-completion](/img/demo.gif)

它有以下便利：

> 1. 在 npm install 时给出补全建议
> 2. 在 npm uninstall 时候根据 package.json 里面的声明给出补全建议
> 3. 在 npm run 时补全建议中列出命令细节

第三点如下图：
![zsh-better-npm-completion](/img/zsh.png)

### 将庞大的 npm script 拆分到独立文件中

当npm script非常多并且非常复杂的时候，将所有脚本全部放在 package.json 中就不是很合适，我们可以借助[scripty](https://github.com/testdouble/scripty)这个包将 npm script 剥离到单独的文件中。

做法就是，创建 scripts 目录，在目录中创建与命令名字对应的执行脚本，命令中有  ```:```  的则通过子文件夹的形式创建，然后在 package.json 中将命令脚本统一换成       ```scripty```

如下，比如
```json
"scripts": {
  "build:dev": "scripty"
}
```
则需要在 scripts 目录下的 build 目录中创建名称为 dev 的执行脚本，路径为 scripts/build/dev

### 文件变化时自动运行 npm script

我们都知道 gulp 中的 watch 在开发中非常实用，其实如果不借助 gulp， 在 npm script 也能实现文件变化后自动运行 npm 脚本

我们需要借助 onchange 这个包，onchange 可以方便地让我们在文件被修改、添加、删除时运行需要的命令。

```json
"scripts": {
  ...
  "watch:css": "onchange 'src/scss/*.scss' -- npm run build:css",
  "watch:js": "onchange 'src/js/*.js' -- npm run build:js",
}
```

onchange需要你传入想要监控的文件路径（字符串），这里我们传的是SCSS和JS源文件，我们想要运行的命令跟在 ```--``` 之后，这个命令当路径内的文件发生增删改的时候就会被立即执行。

### 在 git 钩子中执行 npm script

在项目中，我们可以通过 npm script 为本地仓库配置了 pre-commit、pre-push 钩子检查

当然，我们也可以利用 IDE 里的各种检查， 但是对于整个团队，提交之前设置一些检查还是比较稳妥的，有些同学习惯用```-n``` 来跳过本地检查， 所以更稳妥的做法是在远程仓库接收代码之前也做一次检查

npm 上一已经有很多相关的包了，[husky](https://github.com/typicode/husky)是其中比较好用的一个，husky主要的工作就是替换掉 ```.git/hooks``` 里面的一些钩子。

还有另外的问题，如果直接在 pre-commit 中 lint 所有的文件，每次提交前需要检查所有的代码，可能会比较慢；另外一点，如果是在老的项目中引入lint，或者是团队合作，有的同学直接用 ```-n``` 将代码提交了，你再提交的时候，可能会出现一片红，几百的错误都有可能，这时候估计大多数人内心是崩溃的

其实我们可以通过 [lint-staged](https://github.com/okonet/lint-staged)来缓解这个问题，这个包有个非常 666666 的功能，就是只 Lint 改动的

```json
"scripts": {
    "precommit": "lint-staged",
    "prepush": "npm run test",
    "lint": "npm-run-all --parallel lint:*"
},
"lint-staged": {
    "*.js": "eslint",
    "*.less": "stylelint"
}
```

lint-staged 还提供了自动修复错误的配置

```json
"scripts": {
    "precommit": "lint-staged"
},
"lint-staged": {
    "src/**/*.js": ["eslint --fix", "git add"]
}
```

以及自动格式化代码的配置

```json
"scripts": {
    "precommit": "lint-staged"
},
"lint-staged": {
    "src/**/*.js": ["prettier --write", "git add"]
}
```

### 实现构建工作流

一个简单项目中可能的依赖关系为
> 1. css、html 文件中引用了图片
> 2. html 文件中引用了 css、js

为了不出错，我们的构建过程大致如下：

> 1. 压缩图片
> 2. 编译 less、压缩 css
> 3. 编译、压缩 js
> 4. 给图片加版本号并替换 js、css 中的引用
> 5. 给 js、css 加版本号并替换 html 中的引用

这里忽略掉js之间的相互引用，以及一些combo的情景

这里会用到 shell 里面的管道操作符 | 和输出重定向 >，管道操作符 | 以流的形式依次执行命令，输出重定向 > 指将文件输出到指定文件夹中

流程大概是:

> 1. 用[imagemin-cli](https://github.com/imagemin/imagemin-cli)压缩图片
> 2. 用 lessc 编译 less，用 [cssmin](https://www.npmjs.com/package/cssmin)压缩
> 3. 用[uglifyjs](https://github.com/mishoo/UglifyJS2)压缩js
> 4. 用[hashmark](https://github.com/keithamus/hashmark)自动添加版本号，用[replaceinfiles](https://github.com/songkick/replaceinfiles)自动完成引用替换

大概如下：
```json
{
    "client:static-server": "http-server client/",
    "prebuild": "rm -rf dist && mkdir -p dist/{images,styles,scripts}",
    "build": "scripty",
    "build:images": "scripty",
    "build:scripts": "scripty",
    "build:styles": "scripty",
    "build:hash": "scripty"
}
```

本文只是大概介绍了 npm script 一些用法，其实还有很多比较强大和比较高级的用法待大家去发掘

本文是小书[用 npm script 打造超溜的前端工作流](https://juejin.im/book/5a1212bc51882531ea64df07)读后总结，更多内容可参考原书
