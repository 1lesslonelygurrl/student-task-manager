
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const message = document.getElementById("message");

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");

    if (!response.ok) {
      throw new Error("Failed to load tasks");
    }

    const tasks = await response.json();

    taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`;

    taskList.replaceChildren();

    if (tasks.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No tasks yet. Add your first task!";
      taskList.appendChild(empty);
      return;
    }

    tasks.forEach((task) => {
      const card = document.createElement("article");
      card.className = "task-card";

      const title = document.createElement("h3");
      title.textContent = task.title;

      const description = document.createElement("p");
      description.textContent = task.description || "No description";

      const dueDate = document.createElement("p");
      dueDate.textContent = task.due_date
        ? `Due date: ${task.due_date}`
        : "No due date";

      const status = document.createElement("p");
      status.textContent = `Status: ${task.status}`;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const statusSelect = document.createElement("select");

      ["Pending", "In Progress", "Completed"].forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        option.selected = task.status === value;
        statusSelect.appendChild(option);
      });

      statusSelect.addEventListener("change", async () => {
        await updateTask(task.id, { status: statusSelect.value });
      });

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "Edit";

      editButton.addEventListener("click", async () => {
        const newTitle = prompt("Enter task title:", task.title);

        if (newTitle === null) return;

        if (!newTitle.trim()) {
          alert("Task title cannot be empty");
          return;
        }

        const newDescription = prompt(
          "Enter description:",
          task.description || ""
        );

        if (newDescription === null) return;

        await updateTask(task.id, {
          title: newTitle.trim(),
          description: newDescription
        });
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", async () => {
        if (!confirm(`Delete "${task.title}"?`)) return;

        try {
          const response = await fetch(`/api/tasks/${task.id}`, {
            method: "DELETE"
          });

          if (!response.ok) throw new Error("Delete failed");

          await loadTasks();
        } catch (error) {
          message.textContent = error.message;
        }
      });

      actions.append(statusSelect, editButton, deleteButton);
      card.append(title, description, dueDate, status, actions);
      taskList.appendChild(card);
    });
  } catch (error) {
    taskList.textContent = "Unable to load tasks. Please check the server.";
    message.textContent = error.message;
  }
}

async function updateTask(id, updates) {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    message.textContent = "Task updated successfully!";
    await loadTasks();
  } catch (error) {
    message.textContent = error.message;
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(taskForm);

  const task = {
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    due_date: formData.get("due_date")
  };

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to add task");
    }

    taskForm.reset();
    message.textContent = "Task added successfully!";

    await loadTasks();
  } catch (error) {
    message.textContent = error.message;
  }
});

loadTasks();
