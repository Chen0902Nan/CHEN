// import { useState, useEffect } from "react";
// import { useMouse } from "./hooks/useMouse.jsx";
import { useTodos } from "./hooks/useTodos.js";
import TodoList from "./components/TodoList.jsx";
import TodoInput from "./components/TodoInput.jsx";
// function MouseMove() {
//   const { x, y } = useMouse();
//   return (
//     <>
//       <div>
//         鼠标位置：{x} {y}
//       </div>
//     </>
//   );
// }

export default function App() {
  // const [count, setCount] = useState(0);
  const { todos, addTodo, deleteTodo, toggleTodo } = useTodos();
  return (
    <>
      <TodoInput onAddTodo={addTodo}></TodoInput>
      {todos.length > 0 ? (
        <TodoList
          todos={todos}
          onDeleteTodo={deleteTodo}
          onToggleTodo={toggleTodo}
        ></TodoList>
      ) : (
        <div>暂无待办事项</div>
      )}
      {/* {count}
      <button onClick={() => setCount(count + 1)}>增加</button>
      {count % 2 === 0 && <MouseMove />} */}
    </>
  );
}
