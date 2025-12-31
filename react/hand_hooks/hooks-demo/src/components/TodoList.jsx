import TodoItem from "./TodoItem";
export default function TodoList({ todos, onDeleteTodo, onToggleTodo }) {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onToggleTodo={onToggleTodo}
        ></TodoItem>
      ))}
    </ul>
  );
}
// 跨层级useContext
