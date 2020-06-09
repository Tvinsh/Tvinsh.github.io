---
title: git使用中的撤销
date: 2018-08-08 11:50:20
photo: /img/git.png
excerpts: 平时工作中使用git比较多，但是基本上都是使用主要的几个命令，其实git中有很多命令。 
tags: git
---

![图片内容](/img/git.png)

# git使用之撤销更改

平时工作中使用git比较多，但是基本上都是使用主要的几个命令，其实git中有很多命令，有些可以让我们的工作更加便利，这次主要列举一些撤销更改的方法。

### 基本概念

为了描述方便，先简单介绍下一些git中的基本概念:

> 有4个区，依次是：

    1. 工作区( WorkingArea)
    2. 暂存区( Stage)
    3. 本地仓库( LocalRepository)
    4. 远程仓库( RemoteRepository)

> 有5种状态，分别是：

    1. 未修改( Origin)
    2. 已修改( Modified)
    3. 已暂存( Staged)
    4. 已提交( Committed)
    5. 已推送( Pushed)

> 3个主要的基本操作

    1. git add -> 将工作区的文件提交到暂存区，状态也从已修改变成了已暂存
    2. git commit -> 将暂存区的文件提交到本地仓库，状态从已暂存变成已提交
    3. git push -> 将本地仓库推送到远程仓库，状态从已提交变成已推送

### 检查修改

git diff 可以查看文件修改前后的对比，在不同的阶段，需要带上不同的参数。

| 阶段      | 所在区    | 状态      | diff方法   |
|---------- |-------- |---------- |---------------- |
| 尚未add   | 工作区 | 已修改  | git diff   |
| 已add，尚未commit |  暂存区  | 已暂存 | git diff --cached |
| 已commit，尚未push   | 本地仓库 | 已提交  | git diff 本地仓库 远程仓库   |

```git diff --cached``` 这个命令表示已经add 尚未commit的内容和最后一次commit的内容的对比；

```git diff --cached [<commit>]``` 这个命令表示已经add 尚未commit的内容和指定commit的对比；

```git diff <commit> <commit>``` 这个命令表示任意两个commit之间的对比


### 撤销修改

通过以上方法查看到修改之后，下面来对相应阶段的修改进行撤销操作。

| 阶段      | 撤销方法   |
|---------- |---------------- |
| 尚未add   |  git checkout . 或 git reset --hard   |
| 已add，尚未commit | git reset --> git checkout . 或 git reset --hard |
| 已commit，尚未push   | git reset --hard 远程仓库   |
| 已push   | git reset --hard HEAD^ --> git push -f  |

以上的撤销方法中， 

```git checkout .``` 是把工作区已经修改的内容撤回到修改之前的状态；

```git reset``` 将添加到 暂存区的内容 退回到 工作区，但是工作区的修改并没有撤销，所以在已经add的情况下想撤销修改，需要先reset 然后再 checkout；

上面1，2种情况都可以用 ```git reset --hard``` 命令完成，可以一步退回到未更改的状态,reset是指将当前head的内容重置，不会留任何痕迹；

已经commit之后，已经污染了本地仓库，需要在 ```git reset --hard``` 后面再加个远程仓库作为参数，把远程仓库代码取回来覆盖掉本地仓库；

如果已经push了，需要先将本地仓库恢复到修改之前的状态，然后```git push -f```,通过--force对远程仓库进行强制覆盖。

顺便看下 HEAD 参数，```HEAD``` 指向的是 本地仓库中最新提交的版本，```HEAD^``` 指向的是最新提交的前一次commit， ```HEAD~2``` 指向前一次的前一次，依此类推, 举例 ```git reset --hard HEAD~3``` ,即删除最近的三个commit（删除HEAD, HEAD^, HEAD~2），将HEAD指向HEAD~3。

![git-HEAD](/img/git-HEAD.png)