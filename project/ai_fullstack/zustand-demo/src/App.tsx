// import { useCounterStore } from "./store/counter";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { useTodoStore } from "./store/todo";
import { useState } from "react";
function App() {
  // const [count, setCount] = useState(0)
  // const { count, increment, decrement, reset } = useCounterStore();
  const { todos, addTodo, toggleTodo, removeTodo } = useTodoStore();
  const [inputValue, setInputValue] = useState<string>("");

  const handleAdd = () => {
    if (inputValue.trim() === "") return;
    addTodo(inputValue);
    setInputValue("");
  };

  const handleDelete = (id: number) => {
    removeTodo(id);
  };
  return (
    <>
      <section>
        <h2>Todos {todos.length}</h2>
        <div>
          <input
            type="text"
            placeholder="Add a Todo"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button onClick={handleAdd}>Add</button>
        </div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.text}
              </span>
              <button onClick={() => handleDelete(todo.id)}>Del</button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default App;
