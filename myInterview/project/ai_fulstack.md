## JWT 双token机制

- 首先这是两个概念，JWT以及双Token

### JWT Json Web Token

- 首先要讲清楚为什么选择JWT而不采用传统的session进行鉴权。
  JWT和传统的session对比，是无状态的，不会像传统的session那样在服务端存储每个用户的会话。在用户登录后，服务端会颁发一个token给客户端，客户端在后续请求中自己携带，服务端只需要校验token的签名和有效期，就能识别用户身份。这和传统的session最大区别在于：JWT更偏向客户端自己带凭证，服务端进行校验，而session是客户端带sessionId,服务端会查存储的会话数据
  选择JWT而不是session是因为JWT更适合前后端分离以及移动端应用，JWT可以通过HTTP请求头方便地传递，不受限于浏览器的Cookie机制，并且服务器不需要为每个用户存储会话数据，节省了内存和存储资源，尤其在高并发场景下性能优势突出

- JWT 详情
  JWT分为三段：Header、Payload、Signature
  - Header：主要声明加密算法以及Token类型
  - Payload：存放具体数据，比如用户id，userName等，token过期时间，这里的是Base64编码，不是加密的，不能携带敏感信息
  - Signature：服务端使用秘钥将Header和Payload进行加密计算校验身份，秘钥存储在服务端。

- JWT 的优缺点 这是引入双Token的原因
  JWT是无状态的，在颁发的Token过期前，无法修改用户的状态。这样我们对JWT颁发的token的有效时间就很难设定，如果时间过短，用户频繁掉登录状态，体验感极差，如果token过期时间设置的过长，一但这个token被窃取了，用户账号就容易被劫持。

### 双Token

- 为了优化这个痛点，我采取了双Token机制

颁发两个token,一个短期的accessToken用于当用户的权限通行证，保障用户的使用体验,一个长期的refrshToken用于保证用户的安全性，以及对过期的accessToken进行重新颁发

- 双Token流程

1. 客户端登录成功后，服务端会生成两个token，并且将refeshToken存入数据库中
2. 客户端正常访问的时候，请求接口时会携带accessToken，后端通过JWT对accessToken进行校验，如果没有过期，就正常返回数据
3. 当accessToken过期时，前端请求接口的时候，后端会返回401 Unauthorized的报错，我们会在前端AXIOS拦截器中拦截请求，然后前端调用refreshToken的接口，携带refreshToken，后端校验refreshToken的合法性(检查refreshToken是否有效，且未被撤销)。当校验通过后，重新颁发refresToken和accessToken
4. 当我们退出登录的时候，后端会删除当前用户的refreshToken,即使accessToken还没过期，也会因为refreshToken撤销了，而强制下线

- 前端的无感刷新

1. 使用AXIOS拦截器拦截401响应
2. 开启一个锁定状态，将后续发出的请求先缓存到队列中
3. 发起刷新accessToken的请求，刷新成功后，再重发队列中的请求
4. 在前端 Axios 拦截器中增加一个**“请求队列”**：
   当第一个 401 发生时，设置一个 isRefreshing = true 标志。
   后续的请求如果发现 isRefreshing === true，就将请求存入一个数组 queue 中，挂起等待。
   第一个刷新接口请求成功后，执行 queue 中所有缓存的请求。
   这样无论有多少并发，只会触发一次刷新接口。
