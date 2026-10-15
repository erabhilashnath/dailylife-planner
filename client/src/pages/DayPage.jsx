import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import HourSection from "../components/HourSection";
import LiveClock from "../components/LiveClock";
import ThemeToggle from "../components/ThemeToggle";
import FullscreenToggle from "../components/FullscreenToggle";
import { fetchTodosForDate, createTodo, updateTodo, deleteTodo } from "../api";
import { toDateKey, parseDateKey, DAY_START_HOUR, DAY_END_HOUR } from "../dateUtils";
import { playBeep, unlockAudio } from "../beep";
import { useTheme } from "../useTheme";
import { useFullscreen } from "../useFullscreen";

const HOURS = Array.from(
  { length: DAY_END_HOUR - DAY_START_HOUR + 1 },
  (_, i) => DAY_START_HOUR + i
);

export default function DayPage() {
  const { date } = useParams();
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const firedReminders = useRef(new Set());
  const [theme, toggleTheme] = useTheme();
  const [isFullscreen, toggleFullscreen] = useFullscreen();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
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

  const todayKey = toDateKey(now);
  const isToday = date === todayKey;
  const isPastDate = date < todayKey;
  const currentHour = now.getHours();

  useEffect(() => {
    if (!isToday) return;
    for (const todo of todos) {
      if (
        todo.reminder &&
        !todo.done &&
        todo.hour === currentHour &&
        !firedReminders.current.has(todo.id)
      ) {
        firedReminders.current.add(todo.id);
        playBeep();
      }
    }
  }, [now, todos, isToday, currentHour]);

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

  async function handleToggleReminder(id, reminder) {
    unlockAudio();
    try {
      await updateTodo(id, { reminder });
      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app day-view">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <header className="app-header day-header">
        <Link to="/" className="back-link">← Back to calendar</Link>
        <h1>{dateLabel}</h1>
        <LiveClock />
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="day-page">
        {HOURS.map((hour) => (
          <HourSection
            key={hour}
            hour={hour}
            todos={todosByHour[hour] || []}
            isCurrent={isToday && hour === currentHour}
            isPast={isPastDate || (isToday && hour < currentHour)}
            onAdd={handleAdd}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleReminder={handleToggleReminder}
          />
        ))}
      </main>
    </div>
  );
}
