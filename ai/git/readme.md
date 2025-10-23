# git 分布式版本控制软件

- lesson_zp 本地项目仓库
- 远程仓库
  gitee 码云
- git init
- git 全局设置
  git config --global user.name "Chen0902"
  git config --global user.email "1094536408@qq.com"
- 创建 git 仓库
  mkdir lesson_zp
  cd lesson_zp
  git init
  touch README.md
  git add README.md
  git commit -m "first commit"
  git remote add origin https://gitee.com/chen090299/lesson_zp.git
  git push -u origin "master"
- 已有仓库
  cd existing_git_repo
  git remote add origin https://gitee.com/chen090299/lesson_zp.git
  git push -u origin "master"

- git add. // 添加所有的修改到暂存区
- git commit -m 'message' //确认提交
- git remote add origin https://gitee.com/chen090299/lesson_zp.git
- git push origin master 本地代码提交到远程仓库
