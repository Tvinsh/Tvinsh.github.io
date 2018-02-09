---
title: git从其他分支merge个别文件
photo: /img/git.png
date: 2018-02-09 19:50:19
excerpts: 简单介绍下git如何从其他分支merge个别文件或文件夹
tags: 'git'
---

![git](/img/git.png)

# git从其他分支merge个别文件

------

### 简介

git 使用的过程中，有时候我们可能会有这样的需求， 别的分支上有部分文件是我们当前分支需要的，但是如果使用常规的merge，就会将别的分支的内容全部合并过来，这不是我们想要的，下面简单介绍一个小技巧可以实现只合并指定的文件。

### 场景一

目前有master 和 develop 两个分支，develop上开发了三个功能，分别是 function1.js , function2.js , function3.js 实现的, master上是没有这些功能的，也就没有这三个文件，由于某些原因，现在需要将 function1.js 这个功能先上线，于是我们需要将 function1.js merge到 master 上，但是 function2.js 和 function3.js 不能一起 merge 过来。

### 实现

```git
    git checkout source_branch <path>...
```
我们先切换到 master 分支上，也就是要将资源合并过来的分支，然后执行 ```git checkout develop function1.js```,此时我们会发现 master 上已经有了 funciton1.js 了，也就将指定文件合并过来了。

具体步骤：
```js
git checkout master  // 先切换到master分支

git checkout develop function1.js // 合并develop上的function1.js
```

但是有一点要注意，如果当前 master 上已经有了 function1.js 文件，并且开发了一些其他功能，当用以上方法把 develop 上的 function1.js 合并过来的时候，master 上原有的同名文件会被完全覆盖，而不是合并，这肯定是不行的，也就是以下场景。

### 场景二

master 和 develop 上针对 function1 功能开发了不同的模块，develop 上独立开发了 function2 和 function3 功能，现在需要先上掉 function1 和 function2，也就将两个分支上的 function1.js 合并，并且将 develop 上的 function2.js 合并到 master 上。

### 实现

从 master 上切出一个临时分支，将 develop merge 到临时分支，然后切换到 master 上，用上面的 ```git checkout source_branch <path>``` 方法将临时分支上的相关文件合并到 master 上。

具体步骤： 
```js
git checkout master  // 先切换到master分支

git checkout -b master_temp // 从master切一个新的分支

git merge develop // 在 master_temp 上 merge develop 分支, 如果有冲突，解决下冲突，然后 commit 掉

git checkout master // 切回master

git checkout master_temp function1.js function2.js // 合并临时分支上的 function1.js, function2.js

``` 

完成～ 在正常开发中，这样的场景可能并不多见，都是做好准备并且根据规范来开发的，既然可能会有这样的场景，还是先记着这个小技巧。