# 受控组件和非受控组件

- 二者的核心区别就是数据来源

## 受控组件

表单元素的状态完全由React的state控制

1. 原理

- 表单元素的值永远读取自React的state
- 当用户输入时，触发onChange事件，在回调函数中通过setState更新数据
- 数据流向 state -> view -> onChange ->state

2. 代码示例

```Jsx
function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

3. 优点

- 实时校验：输入时可以立刻校验(如：实时判断密码是否符合规范)
- 动态控制：可以根据输入实时修改UI(输入框变红，禁止提交按钮)
- 强制格式化：可以强行改变用户的输入内容(强制转大写，或者限制只能输入数字)
- 使用场景：大多数复杂表单、实时校验
- 每次数据改变都会触发重新渲染

## 非受控组件

- 表单元素的数据存储在DOM内部，由DOM自己维护，React不主动干预

1. 原理

- React通过 useRef获取该DOM节点的引用
- 只有当你“需要”数据的时候，(比如点击提交按钮时)，才去DOM里手动获取
- 数据流向：DOM本身维护状态

2. 代码示例

```Jsx
function UnControlledComponent(){
  const inputRef=useRef(null)

  const handleSubmit=()=>{
    alter(inputRef.current.value) 在需要时手动读取
  }

  return (
    <>
    <input ref={inputRef}/>
    <button onClick={handleSubmit}>提交</button>
    </>
  )
}
```

3. 优点

- 性能更好：不需要每次输入都触发React的重渲染(re-render)
- 集成简单：非常方便与非React代码(如某些老的JQuery插件)集成
- 代码简洁：处理简单的表单时，不需要写大量的onChange处理函数
- useRef.current改变不触发重新渲染
- 使用场景：简单的表单、文件上传、


## 总结
在实际开发中，推荐优先使用受控组件，因为它符合React的数据驱动视图的理念，数据流单向且可预测
但是不是所有场景都需要受控组件，对于文件上传(<input type="file"/>)这种只能从DOM获取数据的元素，或者在处理高性能的大型表格输入时，非受控组件反而能通过减少不必要的setState来优化渲染性能