# 手写zustand

代码能力

- zustand 状态管理
- 为什么需要它？
  组件通信 层次，传递复杂，中央管理共享状态
  管好状态(财务) 状态共享
  简单
  非常流行 star 数比较多

- redux 老牌的react状态管理库
  复杂

- 读过源码，手写
- 核心内容
  - 以store 提供状态
  - 修改状态
  - 状态改变，响应更新
  - 设计模式 订阅发布者
  - 自定义hook

- 手写要实现以下功能
  - 实现create(高阶函数)方法,接收一个函数(set,get,store)，
    返回一个状态对象(完成了状态的初始化),包含状态、修改状态的方法、
    返回一个store hook函数 useXXXStore
  - useXXXStore 可以接收一个函数 返回某一些状态或方法，
    为空，就整体返回
  - subscribe方法
    添加一个订阅者
    状态发生改变的时候执行 响应式

## 开始实现

- 实现一个最简单的 Store
  存储以及管理状态，怎么存，怎么取，怎么改
- 加入订阅机制
  抖音的网红(store 发布者)和订阅者 (订阅关系)
  以后发布者发布内容(状态未改变)
  - store 对象 subscribe 方法
    接收一个函数
  - state 改变的时候 执行这个函数

- 支持setState接收函数，会将之前的状态给它
- 支持状态的合并
  Object.assign()
- create 比createStore 更好理解,减少学习成本
- 为什么要学习源码？
  - 提升自己的代码能力，学到高级的写法
  - 了解框架的细节，用好它
    zustand 性能，useXxxStore 制定需要的状态

## 个人理解

- createState:用于创建状态的一个函数，比如在使用zustand时， set(state)=>(count:sate.count+1)

- createStore:是zustand中状态的仓库，内部集成get,set,subscribe,destory方法，并最后暴露给外部使用

- selector：zustand可以通过制定这个参数，减少重渲染，只关注我们想关注的数据，只更新渲染指定数据改变的组件，减少重渲染带来的性能损耗

- useStroe：selector减少重渲染的关键，内部通过useState和useEffect两个hook函数，响应式数据，只关心useState的setState功能，通过newObj!==oldObj，判断前后数据改变引用是都相同，再用useEffect进行重渲染

1. 第一版，实现最简单的store
   存储以及管理数据 get,set,let,state={count:0}

2. 第二版，实现subscribe函数，
   订阅发布者模式,newSet()去重

3. 实现函数式更新和对象合并策略
   partial =='funciton'
   newState !=='Object'
   为什么要用 Object.assign({}, state, nextState) 而不是直接修改？
   这是面试中非常重要的响应式原理：
   不可变性 (Immutability)： 在 React 和现代状态管理库中，我们追求“不可变数据”。如果我们直接写 state.count = 2，虽然值变了，但内存地址（引用）没变。React 的对比机制（如 React.memo 或 Zustand 的 selector）会因为引用相同而认为状态没变，导致组件不触发更新。
