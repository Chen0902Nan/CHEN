import { useState, useRef } from "react";
export default function App() {
  // 受控组件 组件里有被状态控制的表单元素
  // 单向数据流
  // 状态绑定输入框 输入框被状态控制了
  // 状态控制 输入框的值
  const [value, setValue] = useState("111");
  const inputRef = useRef(null);
  const doLogin = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
  };
  return (
    <form onSubmit={doLogin}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <input type="text" ref={inputRef} />
      <button type="submit">登录</button>
    </form>
  );
}
