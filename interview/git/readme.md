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
