// 根组件
// jsx
//组件树
// ? 函数  将JSX + 逻辑封装成了一个组件
// 组件是由js/css/html组合起来完成一个相对独立的功能
// JSX 负责UI

import "./App.css";
// state 数据状态 ref
import { useState, createElement } from "react";
function App() {
  // const name = "vue";
  // useState 返回一个数组，第一个元素是状态值，第二个是更新状态的函数
  const [name, setName] = useState("vue");
  const [todos, setTodos] = useState([
    {
      if: 1,
      title: "学习react",
      done: false,
    },
    {
      if: 2,
      title: "学习node",
      done: false,
    },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };
  // 语法糖，简化我们的模版开发，提升代码的可读性
  const element = <h2>JSX是React中用于描述用户界面的语法拓展</h2>;
  const element2 = createElement(
    "h2",
    null,
    "JSX是React中用于描述用户界面的语言"
  );
  setTimeout(() => {
    setName("react");
  }, 3000);
  // 组件的数据业务，交互等
  // JSX 还是在js里面 class 是js的关键字,不能用,用className
  return (
    // 文档碎片标签
    <>
      {element}
      {element2}
      <h1>
        Hello <span className="title">{name}</span>
      </h1>
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => {
            return <li key={todo.id}>{todo.title}</li>;
          })}
        </ul>
      ) : (
        <div>暂无待办事项</div>
      )}
      {isLoggedIn ? <div>已登录</div> : <div>未登录</div>}
      <button onClick={toggleLogin}>{isLoggedIn ? "退出登录" : "登录"}</button>
    </>
  );
}

export default App;
