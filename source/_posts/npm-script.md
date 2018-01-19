---
title: npm scripts 不完全总结
photo: http://ww2.sinaimg.cn/mw1024/a15b4afely1fjbzuwk8ifg21400k0jrp
date: 2018-01-19 18:50:19
excerpts: npm scripts 不完全总结
tags: 'js'
---

![图片内容](http://ww2.sinaimg.cn/mw1024/a15b4afely1fjbzuwk8ifg21400k0jrp)

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

做法就是，创建 scripts 目录，在目录中创建与命令名字对应的执行脚本，命令中有```:```的则通过子文件夹的形式创建，然后在 package.json 中将命令脚本统一换成```scripty```

如下，比如
```json
"scripts": {
  "build:dev": "scripty"
}
```
则需要在 scripts 目录下的 build 目录中创建名称为 dev 的执行脚本，路径为 scripts/build/dev