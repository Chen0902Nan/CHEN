# cron job Agent

- openclaw 自动化任务
  每天早上9点将最新的AI新闻发送到我的邮箱

- mysql
  psql 激进 配置 支持 vector 存储
  关系型数据库 mysql oracle

  create database hello

- ORM
  Object Relational Mapping 对象关系映射
  - Prisma
  - TypeORM

- 创建项目
  nest new jobName
  pnpm i @nestjs/typeorm typeorm mysql2
  mysql2 数据库驱动程序
  typeorm + @nestjs/typeorm orm typeorm 作为nestjs 插件启动
  - 创建users模块
    nest g resource users --no-spec
     nest g resource ai --no-spec

  ## 定时任务
  cron job
  定时任务就是指定一个时间，到时会执行某个任务

  cron 一个表达式

  7 12 13 10 * ？ 
  秒 分 时 日 月 星期(1-7)
  *任意一个月份 每个月
  ？ 忽略 星期几都可以

  有多种类型的cron job openclaw 自动化 定时任务非常有需要