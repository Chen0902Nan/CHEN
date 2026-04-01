## HTTP和HTTPS的区别

- Https 就是 Http + SSL/TLS协议，HTTP是明文传输的，而HTTPS是加密传输的，并且增加了一层身份验证

- 安全性

1. HTTP数据在网络上的传输是明文的，如果在公共网络上浏览网页，攻击者可以通过抓包工具获取到你的用户名、密码、Cookie等隐私数据
2. HTTPS数据传输前会经过TLS/SSL加密，即使攻击者截获了数据包，看到的也是一串乱码，必须拥有对应的秘钥才能解密，这一点可以提升数据传输的安全性

- 身份认证

1. HTTP没有身份校验机制，谁都能仿造某个官网搭建一个虚假的网站，用户难以辨别访问到的网站是不是真正的网站
2. HTTPS 需要向数字认证机构申请证书，浏览器在访问时会验证这个证书是否由权威机构颁发，域名是否匹配，证书是否过期，如果校验失败，浏览器会给用户警告

- 数据完整性

1. HTTP：攻击者可以在数据传输过程中注入恶意代码，比如页面插入广告，病毒， 这里指的不是xss，xss发生在应用层(前端)，这个代码注入发生在传输层/网络链路
2. HTTPS:使用了摘要算法来校验数据完整性，如果过程中有人改动了一个字节，加密校验就会失败，通信会被强制中断，保证了页面代码不会被恶意注入

- HTTP和HTTPS都存在TCP，但是HTTPS多一个TLS，


## GET 和 POST 的区别，以及一次HTTP请求包含哪些信息

- 核心区别
  从Restful HTTP语义上来说，GET是获取资源，POST是提交数据，新增资源
- 数据传输方式
  GET的参数一般放在URL的 QueryString里，
  /api/user?id=1&name=andrew 长度受限 2kb-8kb左右
  POST 数据一般放在Request Body
  GET 不是不可以发送请求 只是服务器和浏览器约定不用

- 安全性
  GET/POST 都是明文传输，POST相对安全一点，安全性是来自于HTTPS
- 幂等性
  HTTP 是无状态的
  GET 多次请求不会改变数据
  POST 不一样的
- 缓存
  GET会缓存，
  POST一般不缓存

- 包含信息
  - 请求行 请求方法 GET/POST/PUT/PAT/PATH/DELETE/OPTIONS/HEAD等 请求路径、HTTP版本
  - 请求头
    Authorization :Token
    Cookie
    ContentType
  - 请求体
    一般出现在 POST，PUT,PATCH请求中
- 为什么TCP需要三次握手
  确认双方发送和接收能力
  SYN + ACK
  开始的接受方在发送应答ACK消息的同时，可以发送SYN消息

