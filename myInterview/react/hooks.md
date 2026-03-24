## memo、useMemo、useCallback

- 三者都是为了react性能优化而设计的工具，三者核心逻辑一样，都是通过缓存来避免不必要的重新计算和或组件重渲染

- memo 高阶组件

1. 它会包裹组件，通过对组件的props进行浅比较，来决定是否需要重新渲染组件
2. 如果父组件重新渲染了，但是它传递给子组件的props没有发生改变，react就会跳过该组件及其子组件的渲染，直接复用上次的渲染结果
3. 缺点:memo只做浅比较，如果props里有复杂对象，且父组件每次渲染都会生成新的引用，memo就会失效，需要用useMemo和useCallback

- useMemo 用于缓存昂贵的计算结果，类似于Vue中的computed

1. 接收一个计算函数和依赖项数组，只有当依赖项发生变化时，才会重新运行计算函数，否则直接返回上次缓存的值
2. 当一个对象或者数组被作为props被传入子组件，且被memo包裹时，在父组件中用useMemo包裹对象或数组可以确保引用地址不变，避免子组件误触发渲染
3. 误区：useMemo只是缓存计算结果。其实创建对象,数组也是一种计算，引用地址就是计算结果

- useCallback 用于缓存函数本身

1. 它返回一个函数的memoized版本，当依赖项不变时，多次渲染中该函数引用地址完全一样
2. 和useMemo的区别：useMemo(()=>fn,[])等价于useCallback(fn,[])，实际上useCallback就是useMemo的语法糖

- 总结

1. memo是优化组件级别的渲染
2. useMemo是优化值，数据的计算
3. useCallback是优化函数的引用稳定性

- 使用事项

1.  不要为了用而用：很多简单的组件渲染开销远小于 React 进行浅比较的开销。
2.  Profile 是王道：我会先使用 React DevTools 的 Profiler 观察组件是否有不必要的渲染,再针对性地引入这些缓存工具。
3.  闭包陷阱：在使用 useMemo 和 useCallback 时，必须严格保证依赖项数组的完整性，否则会导致获取到 stale state（过期数据）的 Bug。
