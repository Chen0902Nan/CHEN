# React Todos

- react + stylus + vite

- 父子组件通信
- 子父通信 通过父组件传递的自定义事件上报
修改 
- 兄弟组件**通信**
  间接通信 通过父组件 + 响应式
  TodoInput TodoList TodoStats
  todos[] useState
  父组件负责持有数据 管理数据
  props 传递给子组件
  父组件还可以将修改数据的方法传给子组件
  子组件不可以直接修改数据，要用父组件传递过来的方法修改数据 提交修改的请求

  统一，正确
