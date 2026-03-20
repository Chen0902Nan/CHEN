- Promise 是 ES6推出的一个对象，在Promise之前，处理异步任务都是采用回调函数，当异步任务过多时，就会出现回调函数的嵌套，也就是回调地狱，代码层层嵌套，成金字塔形，难以阅读和维护，同时错误处理十分复杂

- Promise的推出解决了最核心的两个问题：

1. 扁平化代码结构：Promise通过.then()链式调用，将嵌套结构变成了链式结构
2. 统一错误处理：通过.catch()统一错误处理，可以捕获链路中任何一个环节的错误

- Promise的生命周期

1. Promise 有三个状态 pendding,fulfiled,rejected
2. 初始状态为pendding，当状态变为fulfiled时，会执行resolve()后的回调，执行.then微任务
3. 状态变为rejected ，会执行reject()后的回调，
4. Promise 的生命周期不可逆

- Promise还有几个常用的静态方法
1. Promise.all([p1,p2,p3]):场景需要并发处理多个异步任务，需要所有任务都成功才算成功。比如rag中对切割完的chunks向量化存储到数据库中。
2. Promise.race([p1,p2,p3])：多个任务谁先完成就用谁。比如请求接口超时的设置，如果接口先返回数据，就用接口请求返回数据，如果定时器先完成就判断超时报错
3. Promise.allSettle([p1,p2,p3]):等待所有任务完成，不管成功还是失败。比如上传图片，上传完图片后需要知道每张图片上传的状态

- Promise的局限

1. 中间变量在.then()之间传递过于繁琐
2. 无法使用传统的try/catch 捕获错误，除非在每个.then()中都写
3. 链式调用依然不是真正的同步代码写法，逻辑还是割裂的

- ES2017 引入了async/await

1. async 写在函数声明之前，表述函数内部有异步任务需要执行
2. async 返回一个Promise，如果返回的是普通值，会自动包装成Promise.resolve(value)
