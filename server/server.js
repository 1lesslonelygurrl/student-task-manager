
const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Connect to SQLite database
const db = new Database(path.join(__dirname, "tasks.db"));

// Create table automatically
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    due_date TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// GET: Retrieve all tasks
app.get("/api/tasks", (req, res) => {
  const tasks = db.prepare(
    "SELECT * FROM tasks ORDER BY id DESC"
  ).all();

  res.json(tasks);
});

// GET: Retrieve one task
app.get("/api/tasks/:id", (req, res) => {
  const task = db.prepare(
    "SELECT * FROM tasks WHERE id = ?"
  ).get(req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

// POST: Create a task
app.post("/api/tasks", (req, res) => {
  const { title, description = "", due_date = "" } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const result = db.prepare(`
    INSERT INTO tasks (title, description, due_date)
    VALUES (?, ?, ?)
  `).run(title.trim(), description, due_date);

  const task = db.prepare(
    "SELECT * FROM tasks WHERE id = ?"
  ).get(result.lastInsertRowid);

  res.status(201).json(task);
});

// PUT: Update a task
app.put("/api/tasks/:id", (req, res) => {
  const existing = db.prepare(
    "SELECT * FROM tasks WHERE id = ?"
  ).get(req.params.id);

  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, description, due_date, status } = req.body;

  const updated = {
    title: title ?? existing.title,
    description: description ?? existing.description,
    due_date: due_date ?? existing.due_date,
    status: status ?? existing.status
  };

  if (!updated.title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!["Pending", "In Progress", "Completed"].includes(updated.status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, due_date = ?, status = ?
    WHERE id = ?
  `).run(
    updated.title.trim(),
    updated.description,
    updated.due_date,
    updated.status,
    req.params.id
  );

  res.json(
    db.prepare("SELECT * FROM tasks WHERE id = ?")
      .get(req.params.id)
  );
});

// DELETE: Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM tasks WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ message: "Task deleted successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
