import { useState } from "react";
import "./styles/app.styl";
import TodoList from "./components/TodoList";
import TodoInput from "./components/TodoInput";
import TodoStats from "./components/TodoStats";

function App() {
  // 子组件共享的数据状态
  const [todos, setTodos] = useState([]);
  // 子组件修改数据的方法
  const addTodo = (text) => {
    setTodos([
      ...todos,
      {
        id: Date.now(), // 时间戳
        text,
        completed: false,
      },
    ]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  };

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const onClearCompleted=()=>{
    setTodos(todos.filter(todo=>!todo.completed))
  }
  return (
    <div className="todo-app">
      <h1>My Todo List</h1>
      {/* 自定义事件 */}
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo}/>
      <TodoStats
        total={todos.length}
        active={activeCount}
        completed={completedCount}
      />
    </div>
  );
}

export default App;
