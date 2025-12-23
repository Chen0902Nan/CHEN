const TodoList = (props) => {
  const { todos, onDelete, onToggle } = props;
  return (
    <ul className="todo-list">
      {todos.length === 0 ? (
        <li className="empty">No todos yet!</li>
      ) : (
        todos.map((todo) => {
          return (
            <li key={todo.id} className={todo.completd ? "completed" : ""}>
              <label htmlFor="">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggle(todo.id)}
                ></input>
                <span>{todo.text}</span>
              </label>
              <button onClick={() => onDelete(todo.id)}></button>
            </li>
          );
        })
      )}
    </ul>
  );
};

export default TodoList;
