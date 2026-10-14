import { useState } from "react";
import TodoItem from "./TodoItem";
import { formatHourLabel } from "../dateUtils";

export default function HourSection({ hour, todos, isCurrent, onAdd, onToggle, onEdit, onDelete }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(hour, trimmed);
    setText("");
  }

  return (
    <section className={`hour-section ${isCurrent ? "current" : ""}`}>
      <div className="hour-label">
        {formatHourLabel(hour)}
        {isCurrent && <span className="now-badge">Now</span>}
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>

      <form className="todo-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a task…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </section>
  );
}
