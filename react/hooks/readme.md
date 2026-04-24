# React Hooks

以 use 开头的函数，都是 React Hooks

- react api 最新语法
- 函数 react 风格比较原生 JS

## react 内置的

- useState
  - 初始化传入一个纯函数
    如果我想在初始化时异步请求数据怎么办？
  - setState 也可以传入一个函数，参数是上一次的 state
- useEffect
  effect 副作用
  - 对里面是纯函数  
    对组件来说，输入参数，输出 jsx
    userEffect 异步请求数据 并修改状态
  - 请求数据 副作用
  - 第二个参数 [] 依赖项
  - 三种情况
    - onMounted 挂载时一定执行 [] 只执行一次
    - 根据依赖项，[state,state2] 更新
    - return 函数, 闭包 在下一次执行 effect 前调用 或 组件卸载时调用

## 自定义的
