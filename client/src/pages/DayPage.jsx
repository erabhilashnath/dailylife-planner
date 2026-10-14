import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import HourSection from "../components/HourSection";
import { fetchTodosForDate, createTodo, updateTodo, deleteTodo } from "../api";
import { toDateKey, parseDateKey, DAY_START_HOUR, DAY_END_HOUR } from "../dateUtils";

const HOURS = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
  (_, i) => DAY_START_HOUR + i
);

export default function DayPage() {
  const { date } = useParams();
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      const rows = await fetchTodosForDate(date);
      setTodos(rows);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [date]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const isToday = date === toDateKey(now);
  const currentHour = now.getHours();

  const todosByHour = {};
  for (const todo of todos) {
    (todosByHour[todo.hour] ??= []).push(todo);
  }

  const dateLabel = parseDateKey(date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleAdd(hour, text) {
    try {
      await createTodo({ date, hour, text });
      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id, done) {
    try {
      await updateTodo(id, { done });
      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEdit(id, text) {
    try {
      await updateTodo(id, { text });
      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="app-header day-header">
        <Link to="/" className="back-link">← Back to calendar</Link>
        <h1>{dateLabel}</h1>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="day-page">
        {HOURS.map((hour) => (
          <HourSection
            key={hour}
            hour={hour}
            todos={todosByHour[hour] || []}
            isCurrent={isToday && hour === currentHour}
            onAdd={handleAdd}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </main>
    </div>
  );
}
