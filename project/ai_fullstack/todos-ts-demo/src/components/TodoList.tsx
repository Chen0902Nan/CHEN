import type { Todo } from "../types/Todo";
import TodoItem from "./TodoItem";
import * as React from "react";
// 组件参数接口 父子组件对接
// props 接口可以确保子组件的正确运行
interface Props {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}
// export default function TodoList({todos,onToggle,onRemove}):Props{}
const TodoList: React.FC<Props> = ({ todos, onToggle, onRemove }) => {
  return (
    <ul>
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
};
export default TodoList;
