# 大文件上传

## 上传

post input[type=file] blob
写入服务器相应文件夹 upload/

## 大文件

- http 2.0/3.0 多路复用
  太慢了，blob 切片 并发请求
- 用户体验
  移动端 网络不稳定
  大文件上传容易失败 用户长时间再失败，体验差
- 断点续传
  file id-chunk-i
- 秒传
  之前上传过

需解决网络不稳定与内存溢出痛点。核心采用切片上传降低单次负载，配合断点续传确保失败可恢复，利用并发控制提升速度，并通过秒传机制避免冗余传输。

### Web Worker

html5的一个新特性，js的多线程 用于耗时计算，游戏相关
worker线程，js有些不擅长的工作，
js擅长的是描述性，dom操作，不擅长计算(Number)
hash计算 耗费大量时间，js是单线程，
耗时性的任务会放在worker线程中去做，
js通过消息机制

- self 表示worker线程自己
  self.onmessage
  self.postMessage 消息机制
