import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidHour(hour) {
  return Number.isInteger(hour) && hour >= 0 && hour <= 23;
}

// GET /api/todos?date=YYYY-MM-DD -> all todos for one day, grouped by hour not needed server-side
app.get("/api/todos", (req, res) => {
  const { date } = req.query;
  if (!DATE_RE.test(date)) {
    return res.status(400).json({ error: "date must be YYYY-MM-DD" });
  }
  const rows = db
    .prepare("SELECT * FROM todos WHERE date = ? ORDER BY hour, id")
    .all(date);
  res.json(rows);
});

// GET /api/todos/counts?start=YYYY-MM-DD&end=YYYY-MM-DD -> [{date, count}] for month-view dots
app.get("/api/todos/counts", (req, res) => {
  const { start, end } = req.query;
  if (!DATE_RE.test(start) || !DATE_RE.test(end)) {
    return res.status(400).json({ error: "start and end must be YYYY-MM-DD" });
  }
  const rows = db
    .prepare(
      "SELECT date, COUNT(*) as count FROM todos WHERE date >= ? AND date <= ? GROUP BY date"
    )
    .all(start, end);
  res.json(rows);
});

app.post("/api/todos", (req, res) => {
  const { date, hour, text } = req.body;
  if (!DATE_RE.test(date) || !isValidHour(hour) || !text || !text.trim()) {
    return res.status(400).json({ error: "date (YYYY-MM-DD), hour (0-23), and text are required" });
  }
  const result = db
    .prepare("INSERT INTO todos (date, hour, text) VALUES (?, ?, ?)")
    .run(date, hour, text.trim());
  const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "not found" });

  const text = req.body.text !== undefined ? req.body.text : existing.text;
  const done = req.body.done !== undefined ? (req.body.done ? 1 : 0) : existing.done;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }

  db.prepare("UPDATE todos SET text = ?, done = ? WHERE id = ?").run(text.trim(), done, id);
  const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Planner API listening on http://localhost:${PORT}`);
});
