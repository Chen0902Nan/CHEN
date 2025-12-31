import { useState } from "react";
export default function TodoInput({ onAddTodo }) {
  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTodo(text.trim());
    setText("");
  };
  return (
    <form action="" className="todo-input " onSubmit={handleSubmit}>
      <input
        type="text "
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </form>
  );
}
