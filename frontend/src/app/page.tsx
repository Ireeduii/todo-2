"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [newTasks, setNewTasks] = useState("");
  const [tasks, setTasks] = useState<
    { id: string; name: string; completed: boolean; isCompleted: boolean }[]
  >([]);

  async function createNewTask() {
    // if (!newTasks.trim()) return;

    await fetch("http://localhost:3000/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newTasks }),
    });

    loadTasks();
    setNewTasks("");
  }

  function loadTasks() {
    fetch("http://localhost:3000/tasks/")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function deleteTask(id: string) {
    if (confirm("Are you sure delete this task ?")) {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });

      loadTasks();
    }
  }

  async function toggleComplete(id: string) {
    await fetch(`http://localhost:3000/tasks/${id}/check`, {
      method: "PATCH",
    });
  }
  async function editTask(task: { id: string; name: string }) {
    const newName = prompt("Edit task", task.name);

    if (newName && newName.trim()) {
      await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      loadTasks();
    }
  }
  useEffect(() => {
    loadTasks();
  }, []);

  // const filteredTasks = tasks.filter((task) => {
  //   if (filter === "active") return !task.isCompleted;
  //   if (filter === "completed") return task.isCompleted;
  //   return true;
  // });

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") {
      return true;
    } else {
      if (filter === "Active") {
        return !task.isCompleted;
      } else {
        return task.isCompleted;
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex flex-col items-center py-12 px-4 ">
      <h1 className="text-4xl mb-8 text-shadow-2xs mt-20 btn btn-soft bg-transparent btn-secondary">
        Todo List
      </h1>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 ">
        <div className="flex gap-3 mb-6 ">
          <input
            type="text"
            placeholder="Add new task..."
            className="flex-1 input input-bordered input-secondary rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={newTasks}
            onChange={(e) => setNewTasks(e.target.value)}
            onKeyDown={(e) => {
              // if ((e.key === "Shift", e.key === "Enter")) createNewTask();
              // if ((e.key === "Enter", e.key === "Shift")) createNewTask();
              if (e.key === "Shift") createNewTask();
              if (e.key === "Enter") createNewTask();
            }}
          />
          <button
            onClick={createNewTask}
            className="btn btn-secondary px-6 py-2 rounded-lg text-lg font-semibold hover:bg-pink-700 transition"
          >
            Add
          </button>
        </div>
        <div className="flex justify-center  mb-4 ">
          <div className="flex flex-row gap-12 ">
            {["All", "Active", "Completed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`btn btn-sm btn-outline btn-info w-20 ${
                  filter === s ? "btn-info" : "hover:bg-info/20"
                }`}
              >
                {s}
              </button>
            ))}
            {/* <button
              onClick={() => setFilter("all")}
              className={`btn btn-sm btn-outline btn-info w-20 ${
                filter === "all" ? "btn-info" : "hover:bg-info/20"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("active")}
              className={`btn btn-sm btn-outline btn-info w-20 ${
                filter === "active" ? "btn-info" : "hover:bg-info/20"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`btn btn-sm btn-outline btn-info ${
                filter === "completed" ? "btn-info" : "hover:bg-info/20"
              }`}
            >
              Completed
            </button> */}
          </div>
        </div>

        <ul className="space-y-4 max-h-[400px] overflow-y-auto">
          {tasks.length === 0 && (
            <p className="text-center text-gray-500">No tasks yet.</p>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-purple-50 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition cursor-default"
            >
              <input
                type="checkbox"
                defaultChecked={task.isCompleted}
                // checked={task.completed}
                className="checkbox checkbox-secondary "
                onChange={() => toggleComplete(task.id)}
              />

              <span
                className={`text-gray-700 font-medium mr-40 ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.name}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => editTask(task)}
                  className="btn btn-sm btn-outline btn-info px-3 py-1 rounded hover:bg-info/20 mr-3s"
                  aria-label={`Edit task ${task.name}`}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="btn btn-sm btn-outline btn-error px-3 py-1 rounded hover:bg-error/20"
                  aria-label={`Delete task ${task.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
