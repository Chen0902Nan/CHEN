# React

MVVM 现代前端框架
组件化、响应式、JSX、虚拟DOM、Fiber机制....

- React 底层原理
  最好的方式是手写Mini React
  React 框架名字， Didact, 统一的命名空间

- 搭建源码开发项目
  - react-scripts 类似 vite
- JSX
  JSX 是在JavaScript里面直接写HTML标签的语法糖。
  - 优势
  1. 直观且声明式 表达UI
     .vue 三段式
     函数， JSX 和数据逻辑在一起
     通过JSX 直接看到最终输出的DOM 结构

  ```
  let user = (<div>
      <h2>用户列表</h2>
      {users.map(user => <p key={user.id}>{user.name}</p>)}
  </div>)

  ```

## 源码分析第一阶段 The CreateElement Function

- jsx 由babel 转译成 React.createElment
- React.createElment会接收到 type props children
  三个参数
- createElement 函数 返回构成VDOM的 elment
- 递归 叶子结点 文本节点 为了统一处理（render）
  也返回 VDOM
  得到VDOM
  {
  type: 'TEXT_ELEMENT|NodeName|ComponentFunction',
  props: {
  ...props
  children:[]
  }
  }
  开发者只需关注数据业务，dom 打理由react 帮我们做了（重绘重排）

## 源码分析第二阶段 render

- 接收 VDOM 的element container
- 创建节点 Node | TextNode
- isProperty 判断 children 之外的都是,children再递归
- 添加属性
- 挂载

## 源码分析第三个阶段

### 递归render的性能问题

- VDOM 树比较大 -> 电商详情页的复杂组件树结构
- 一旦开始 不能中断 render完成为止
- JS 是单线程的 一直占据
  用户想要交互 动画 滚动条 -> 卡顿、掉帧

### Fiber -> React的工作机制

1. Fiber 是 React 内部用来组织、调度、执行组件树渲染/更新的工作单元和工作方式
2. 每一个 React element（无论是原生标签还是函数组件/类组件）在运行时都会对应一个 Fiber 节点
3. Fiber 让 React 拥有了可中断的、增量式的、可优先级的渲染能力

VDOM 树 -> Fiber Tree -> render

- 浏览器不忙的时候
  中断、调度
  fiber 节点是 element render 的工作单元 work unit
  下一个 work unit 指针

## 消息队列 和 事件循环

### Event Loop 事件循环机制

1. 每个页面都有一个渲染进程，启动一个主线程，负责的任务特别多，而且还是单线程
   V8 JS 引擎 和 渲染引擎(进程内部) 这两个都在渲染进程这个主进程之中 多进程通信(网络进程...) 消息的方式

2. 多少事要做

- 处理DOM 解析HTML 生成DOM 树
- 计算样式合并css规则与元素默认样式，确定每个DOM 节点最终的可视化样式属性值，CSSOM 树
- DOM Tree 和 CSSOM Tree 树 结合 渲染树 render Tree
- 处理布局，盒模型、BFC(弹性、浮动、定位)，Layout Tree DOM 节点在屏幕的精确位置，尺寸等几何布局信息
- 合并图层
- 交给渲染引擎 绘制
- JS 的执行 开始于一个script标签
  <script src="" type="module">
  
  </script>

  将里面的内容分成 同步代码(尽快允许结束) 异步代码(耗时的，未来的，事件的promise async await setTimeout setInterval,addEventListener,...)
  - 通过消息机制 进行轮训
  - Event Loop
    第一个宏任务 script
    同步代码全部执行完，碰到异步任务就放入宏任务(setTimeout...,队列 每次只会取一个宏任务执行)或者微任务队列(promise 先进先出 一次清空所有的微任务)

## 程序的运行模型

- 主(单)线程模型
  顺序执行的，执行完，线程会自动退出
  简单，高效，阻塞 (用异步来解决这个问题)

- 在主线程过程中处理新的任务(优先)
  I/O，读写文件，点击事件，键盘事件，就要采用事件循环机制
  单线程机制下，要去响应众多任务，设计出来的执行机制。

//GetInput
//等待用户从键盘输入一个数字，并返回该输入的数字
int GetInput(){
int input_number = 0;
cout<<"请输入一个数:"; // 会让主线程一直阻塞在输入等待状态
cin>>input_number;
return input_number;
}

//主线程(Main Thread)
void MainThread(){
for(;;){
int first_num = GetInput()；
int second_num = GetInput()；
result_num = first_num + second_num;
print("最终计算的值为:%d",result_num)；
}
}

- 相对于之前的单线程有两个改变
  - 循环机制 一直检测
  - 引入了事件
    Event + Loop =EventLoop 线程是活的

  - 处理其他线程发送过来的任务
    网络进程 消息机制 + Event Loop(JS执行机制)

渲染主线程会频繁接收到来自于 IO 线程的一些任务，接收到这些任务之后，渲染进程就需要着手处理，比如接收到资源加载完成的消息后，渲染进程就要着手进行 DOM 解析了；接收到鼠标点击的消息后，渲染主线程就要开始执行相应的 JavaScript 脚本来处理该点击事件。

优先级别 -> 队列搞定
跨任务队列过来(IO 消息机制)
宏任务队列 一次只会执行一个
微任务队列 一次群清空
