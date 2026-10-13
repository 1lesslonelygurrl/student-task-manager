
# Student Task Manager

## 1. Project Overview

Student Task Manager is a web application that helps students organize and manage their assignments and deadlines.

Users can create tasks, view task lists, edit task details, update task status, and delete tasks.

## 2. Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js and Express.js
- Database: SQLite using better-sqlite3
- API: REST API
- Development Environment: Visual Studio Code

## 3. Project Structure

```text
Solution1/
├── server/
│   └── server.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The SQLite database file is generated automatically when the server starts.

## 4. Installation

Requirements:
- Node.js
- npm

Clone or download this repository and open the project folder in a terminal.

Install dependencies:

```bash
npm install
```

## 5. How to Run

Start the server:

```bash
node server/server.js
```

Open the application in a browser:

http://localhost:3000

The SQLite database and tasks table are created automatically when the server starts for the first time.

## 6. Features

- Create a task with a title, description, and due date
- View all tasks
- View an individual task by ID
- Edit task details
- Update task status
- Delete tasks
- Store task data in an SQLite database

Available task statuses:
- Pending
- In Progress
- Completed

## 7. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Retrieve all tasks |
| GET | /api/tasks/:id | Retrieve one task |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |

### Example: Create a Task

Request:

```http
POST /api/tasks
Content-Type: application/json
```

Request body:

```json
{
  "title": "Complete Mini Project #2",
  "description": "Build a task management website",
  "due_date": "2026-10-16"
}
```

## 8. Database

The application uses SQLite to store task information.

The `tasks` table contains:
- id
- title
- description
- due_date
- status
- created_at

### 9. Debugging Evidence

**Screenshot 1: Backend API Test**

The screenshot shows a successful GET request to `/api/tasks` and the task data returned by the backend.

![Backend API Test](screenshots/api-test.png)

**Screenshot 2: Frontend Test**

The screenshot shows the Student Task Manager interface displaying tasks retrieved from the database.

![Frontend Test](screenshots/frontend-test.png)
## 10. Author

Student Mini Project #2
