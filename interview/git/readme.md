# GIT

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