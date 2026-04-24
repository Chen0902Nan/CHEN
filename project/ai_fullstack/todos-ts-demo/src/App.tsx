import useTodos from "./hooks/useTodos";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
// import { useEffect } from "react";
export default function App() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();
  // useEffect(() => {
  //   localStorage.setItem("todos", JSON.stringify(todos));
  // }, [todos]);

  return (
    <div>
      <h1>TodoList</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />
    </div>
  );
}
