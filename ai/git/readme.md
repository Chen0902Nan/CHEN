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

- # learn git
- 同一个项目中不能有多个 git 仓库
  管理代码，不能有多个仓库
- git 加入前

  - 开发目录
  - 代码仓库 git init
    会添加一个 .git 隐藏目录仓库
    默认创建一个 master 分支
    管理文件的不同版本
    大型项目、多人协作开发

- git status //查看仓库状态
  非常基础且重要的命令，在任何决定前，建议都用这行命令了解仓库状态
  尚未提交，不在仓库
  未跟踪的文件 不在暂存区
- git add readme.txt //添加到暂存区(stage)
- git commit -m 'wrote a readme file' 提交到仓库 一定要根据功能来写提交
  多次 add 少量 commit 当完成了具有一定意义的工作时，再 commit

  - 提交到仓库的当前（master）分支，有一个唯一的 ID（sha 算法，唯一的长窜）
    为什么不用自增 ID？（面试）
    git 仓库是多人协作的 自增 ID 容易出问题（多人协作时，下一个自增 ID 到底分配给谁？） hashID 唯一的
  - 2 insertions 2 行新增
    提交的是仓库的是文件的修改，存放的是文件的新的版本

- git diff filename //查看代码和仓库的差异
  重大提交前，先 diff 再提交 进行对比确认
- git log
  //这会显示当前分支的提交历史，按时间顺序倒序排列（即最新的提交在最上面）。

- git log --oneline
  //每个提交在一行显示
  (HEAD -> master) append GPL
  移动指针去穿越
  - 操作指针 -> 版本回退
    git reset --hard HEAD^ //回到上一个版本，HEAD 代表当前指针，^代表向前回退一个版本，^2 回退两个版本
  - 操作指针 -> 跳转版本
    git reset --hard + hashID
- git reflog //查看 HEAD 指针的移动历史
- git checkout -- filename
  会将我们的 file 在工作区的修改，全部撤销
