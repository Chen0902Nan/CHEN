# GIT

## 初始化并绑定远程

- git init
- git remote add origin url
- git branch -M main
- git push -u origin main
  -u：--set-upstream 将本地的main分支与远程的origin/main分支建立关联

## git pull 和 git fetch

- 分支 branch
  独立开发的时候，一人一个默认主分支
  master/main 线上代码，正确可运行的
  dev 分支 开发新功能
  多人协作 都会有自己的分支
  同一个文件，多人开发，不会相互影响
  切换到相应的分支，合并内容 git merge
  改bug 紧急
  git checkout -b fz-bug-fixed
  feature 分支
  删除分支
  git diff

### git pull

不只是拉取远程更新，会立即自动merge

### git fetch

只拉取远程更新，安全又不影响当前分支,会将远程的main，拉取到本地的origin/main
再 git diff main origin/main 比较一下远程和本地代码有什么区别，确认是否需要合并本地哪些资源的标总和你的
git merge origin/main
本地有自己的修改 不想立马合并
git stash 先进行一次暂存，这是一个栈结构
暂存后可以切换到其他分支，进行修改
当再次切换回stash的分支后，可能会发生bug丢失原分支的内容，可以通过git stash pop 弹出上一次的暂存，找到丢失前的代码

## git merge 和 git rebase

merge 合并 缺点：让更新历史变复杂，后期排查问题会很乱
rebase 变基 优点：改变提交的基点，让提交历史变成一条干净的时间线

## 排错回滚

- 撤销操作

1. 工作区回滚：git checkout --file 或者 git restore file
2. 暂存区回退：git reset HEAD file 将修改从暂存区撤回工作区
3. 版本回退：git reset --hard <commit-id>
   --hard会丢弃未提交的修改 --soft会保留修改在暂存区

- 修改最后一次提交
  git commit --amend：修正刚刚的提交而不产生新的commit

- 临时保存工作
  git stash：暂存，比如在开发中，突然要去别的分支修改bug，就先将当前进度存入堆栈中，再切换分支
  git stash pop:弹出一次保存在堆栈的暂存内容

## 拉取远程仓库代码

- git fetch
  拉取远程仓库的代码，但是不会改变本地的任何工作文件
  它会将远程分支的最新提交更新到本地的origin/xxx(master)分支

- git pull
  拉取远程仓库的代码，并做一次git merge操作,将远程分支的修改强行合并到当前分支
