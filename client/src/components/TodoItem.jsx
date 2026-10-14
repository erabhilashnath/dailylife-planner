import { useState } from "react";

export default function TodoItem({ todo, onToggle, onEdit, onDelete, onToggleReminder }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.text);

  function save() {
    const trimmed = value.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    } else {
      setValue(todo.text);
    }
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      setValue(todo.text);
      setEditing(false);
    }
  }

  return (
    <li className={`todo-item ${todo.done ? "done" : ""}`}>
      <input
        type="checkbox"
        checked={!!todo.done}
        onChange={() => onToggle(todo.id, !todo.done)}
      />
      {editing ? (
        <input
          type="text"
          className="todo-edit-input"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="todo-text" onClick={() => setEditing(true)}>
          {todo.text}
        </span>
      )}
      <button
        type="button"
        className={`todo-reminder ${todo.reminder ? "active" : ""}`}
        aria-label={todo.reminder ? "Turn off reminder" : "Set reminder"}
        title={todo.reminder ? "Reminder on — will beep at this hour" : "Set reminder"}
        onClick={() => onToggleReminder(todo.id, !todo.reminder)}
      >
        {todo.reminder ? "🔔" : "🔕"}
      </button>
      <button
        type="button"
        className="todo-delete"
        aria-label="Delete task"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    </li>
  );
}
