export default function TodoItem({ todo, onToggleTodo, onDeleteTodo }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleTodo(todo.id)}
      />

      <span className={todo.completed ? "completed" : ""}> {todo.text}</span>
      <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
    </li>
  );
}
