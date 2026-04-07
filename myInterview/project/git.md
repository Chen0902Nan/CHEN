## git 版本控制

- 日常使用中，要理解git的四个区域 工作区、暂存区、本地仓库、远程仓库
  - git add file 将工作区文件修改存入暂存区
  - git commit -m 'xxx' 将暂存区内容提交到本地仓库
  - git status 查看当前状态
  - git diff 查看暂存区和工作区的差异 git diff --cached 查看暂存区与仓库之间的差异

### 分支与合并

- 创建分支
  git branck 分支名
- 切换分支
  git switch 分支名
  git checkout 分支名
- 创建并切换
  git switch -c 分支名
  git checkout -b 分支名
- 基于远程分支创建本地分支
  git switch 分支名 // 远程有一个同事创建的分支

- 合并
  不同分支上开发的代码最后都要合并到主分支
  - git merge
    创建一个新的合并提交，保留了完整的历史轨迹，但是如果分支交错很多的话，历史线会很混乱
  - git rebase(变基)
    将当前分支的修改在目标分支的基础上“重写”一遍
    会使提交历史保持线性，一条直线看起来很整洁
    不要在公共分支上(main/master)用rebase，它会改写历史，导致团队替他人的代码合并冲突

### Angular代码提交规范

<类型>(<范围>):<描述>

- 类型
  feat：新增功能
  fix：修复bug
  docs：文档修改
  style：代码格式调整
  refactor：代码重构
  test：测试相关的修改
  chore：构建过程或辅助工具的变动
- 范围
  组件名、模块、文件名
- 描述
  对于本次提交的剪短描述
