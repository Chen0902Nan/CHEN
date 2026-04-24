# hooks

- 是一种函数编程思想
  use 开头 封装 vue/react 组件的状态和生命周期，呼之即来，用起来很方便
  - react 内置的
  - 自定义 hooks

## 案例

mousemove 事件 响应式的显示鼠标位置

- 内存泄漏
组件卸载时，需要清除事件监听/定时器 否则会导致内存泄漏
不会因为函数组件卸载自动销毁，useEffect return()=>{}