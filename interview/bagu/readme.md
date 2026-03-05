# 春招八股

- 从URL 输入到页面展示 中间经历了什么
  - 经典考题 80%
  - 前端渲染
  - 计算机网络
  - 操作系统 进程间的通信
  - 专业 + 专业课

- 回答策略
  不要蹦知识点，要按知识体系，清晰的组织表达逻辑

## 架构图

- 操作系统考点
  分配资源的最小单位 -> 进程 process
  执行的最小单位 -> 线程 thread
  - 浏览器是一个多进程架构,整个进程需要各个进程之间的配合，
    - 1. 浏览器主进程
    - 提供用户的操作反馈
      location 输入
    - 浏览历史入栈新的记录
    - 请求状态 loading的显示
      网络请求开始，显示loading图标
      请求完成 loading图标隐藏
      请求的资源交给渲染进程
    - 管理子进程
      进程之间的通信 ipc -> inter-process communication
    - 当前页面已经显示或者重新刷新
      beforeunload 事件
      浏览器主进程负责用户交互，子进程负责管理和文件存储(缓存、cookie、localStorage)

    - 2. 网络进程
      - 是面相渲染进程和浏览器进程的提供网络下载功能的进程

1. 首先，浏览器进程接收到用户输入的URL请求，浏览器进程将该URL转发给网络进程

- URL 补全标准URL 带上http(s)://www
- 如果是搜索关键词 去向默认搜索引擎URL带上关键词
- 网址 英文、中文 可读性 DNS Domain Name System
  OSI 七层模型 IP 地址来通讯
  拿着域名(domain) 去查询出IP地址
  key:value DNS 是一个分布式的数据库
  - 本地 DNS 缓存查找
  - 局域网查找
  - 抚州电信
  - 中国根服务器(海底光缆)
  - 美国服务器(顶级服务器)

- 如果本地有缓存
  text/css image/png
  不用请求，直接使用缓存
- 三次握手 确保双方都具有请求发送的能力
- 发送请求行和请求头
  GET URL http 版本
  请求头 jwt token Authorization: Bearer <token>
  cookie

- 发送响应头 解析响应头数据 并数据转发给浏览器进程
  根据 Content-Type 浏览器做出不一样的响应
  text/html -> 渲染进程准备接受
  text/css image -> 下载
  doc mp3
  状态码
  - 浏览器接收到”提交导航“的消息后 便开始准备接受HTML数据 接受数据的方式
    是直接和网络进程建立数据管道
  - 最后渲染进程会像浏览器进程“确认提交”，已经准备好接受和解析页面数据
  - 浏览器进程接收到渲染进程“提交文档”消息后，便开始移除之前旧的文档，然后更新浏览器进程中的页面状态进入loading状态

  用户发出URL请求 到页面开始解析的整个过程 就叫导航

- time.geekbang.org
  补全

- http://time.geekbang.org/
  跳转 用户的习惯，服务器帮忙转发
  服务器返回301/302 重定向
  跳转 Location:https://time.geekbang.org/
  https://浏览器强制

- DNS深入
  - 浏览器DNS缓存
    chrome://net-internals/#dns
    ip 数组
    分布式 **服务器集群**
    返回的IP地址是 nginx代理服务器IP地址
    背后反向代理 有成百上千台服务器 媒婆举例
    负载均衡
    代理服务器背后轮训 服务器的负载怎么样?
    地域特性的机房
    离你最近的地方安排服务器集群 一个域名对应多个IP地址，选择最近最好的IP地址访问
  - 本地操作系统dns 缓存
    一台电脑 多个浏览器
    host 文件
    有用的系统配置文件
    本地 域名 和IP指向的配置文件
    douyin.com
    douyin 开发者 本地有着douyin 官网的website代码 本地测试带域名是什么效果
    localhost doutin.com
    cookie token
    C://windows/System32/drivers/etc/hosts
    notepad C:\Windows\System32\drivers\etc\hosts
    127.0.0.1 www.baidu.com
    npx http-server -p 80
    http:/www.baidu.com
    - localhost 等一些特殊域名 是不需要解析的
      127.0.0.1 www.baidu.com

- 200 + Content-Type text/html
  下载内容1
  - 开始传输 transport
    - 建立传输通道 三次握手

  - OSI 七层协议
    http 是一个应用层协议
    - 物理层 0和1 物理介质
    - 数据链路层 mac地址(上网设备的唯一ID) + 数据
    - 网络层 IP地址 + mac地址 + 数据
    - 传输层 规则
      UDP 数据暴协议 一般用于视频 游戏 音频 保证**快速**
      有效的传输
      - 数据包 大小上限的
      - 一个文件会被分成好多个数据包 分批次 分通道并发传输
      - 数据包会丢失 重发TCP/IP
      - 排序
        TCP(序号...) + IP地址 + mac地址 + 数据
    - 三次握手
