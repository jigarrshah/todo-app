import { useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleAddTodo = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue === '') return

    const newTodo = {
      id: Date.now(),
      text: trimmedValue,
      completed: false
    }

    setTodos([newTodo, ...todos])
    setInputValue('')
  }

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  return (
    <div className="app">
      <div className="todo-container">
        <h1>Jigar Todo List</h1>

        <div className="input-section">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button onClick={handleAddTodo} className="add-button">
            Add
          </button>
        </div>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span className={todo.completed ? 'todo-text completed' : 'todo-text'}>
                {todo.text}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="delete-button"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty-message">No tasks yet. Add one to get started!</p>
        )}
      </div>
    </div>
  )
}

export default App
