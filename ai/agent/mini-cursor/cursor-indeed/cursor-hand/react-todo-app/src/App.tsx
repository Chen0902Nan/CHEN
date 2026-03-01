import React, { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  editing?: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const newTodoItem: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, editing: true } : todo
      )
    );
  };

  const saveEdit = (id: string, newText: string) => {
    if (newText.trim() === '') return;
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim(), editing: false } : todo
      )
    );
  };

  const cancelEdit = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, editing: false } : todo
      )
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">✨ TodoList Pro</h1>
          <p className="text-blue-100 italic">Organize your life with style & power</p>
        </header>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
            <button
              onClick={addTodo}
              className="px-5 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-blue-100 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ➕ Add
            </button>
          </div>

          <div className="mb-6 flex justify-between items-center text-white/90">
            <div className="text-sm">
              <span className="font-medium">{activeCount}</span> active •{' '}
              <span className="font-medium">{completedCount}</span> completed
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter === 'all' ? 'bg-white text-indigo-600' : 'hover:bg-white/20'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter === 'active' ? 'bg-white text-indigo-600' : 'hover:bg-white/20'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${filter === 'completed' ? 'bg-white text-indigo-600' : 'hover:bg-white/20'}`}
              >
                Completed
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {filteredTodos.length === 0 ? (
              <li className="text-center py-8 text-white/70 italic">
                {filter === 'all'
                  ? 'No todos yet — add your first task!'
                  : filter === 'active'
                  ? 'All tasks are completed! 🎉'
                  : 'No completed tasks yet.'}
              </li>
            ) : (
              filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`group flex items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/15 ${todo.completed ? 'opacity-80' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 mr-3 text-indigo-500 rounded focus:ring-indigo-400 cursor-pointer"
                  />
                  {todo.editing ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        defaultValue={todo.text}
                        autoFocus
                        onBlur={(e) => saveEdit(todo.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(todo.id, e.target.value);
                          if (e.key === 'Escape') cancelEdit(todo.id);
                        }}
                        className="flex-1 px-3 py-1 bg-white/20 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-white/40"
                      />
                      <button
                        onClick={() => saveEdit(todo.id, (e.target as HTMLInputElement).value)}
                        className="text-green-300 hover:text-green-100"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => cancelEdit(todo.id)}
                        className="text-red-300 hover:text-red-100"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`flex-1 text-lg transition-colors ${todo.completed ? 'line-through text-white/60' : 'text-white'}`}
                      onDoubleClick={() => startEditing(todo.id)}
                    >
                      {todo.text}
                    </span>
                  )}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditing(todo.id)}
                      className="text-blue-200 hover:text-blue-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-200 hover:text-red-100 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          {todos.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10 text-center text-white/70 text-sm">
              <button
                onClick={() => setTodos(todos.filter((t) => !t.completed))}
                className="hover:underline"
              >
                Clear completed ({completedCount})
              </button>
            </div>
          )}
        </div>

        <footer className="text-center text-white/60 text-sm">
          <p>Double-click a task to edit • Press Enter to save, Escape to cancel</p>
        </footer>
      </div>
    </div>
  );
};

export default App;