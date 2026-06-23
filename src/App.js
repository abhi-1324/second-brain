import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const response = await fetch("/tasks");
    const data = await response.json();
    setTasks(data);
  }

  async function addTask() {
    if (!input) return;
    setLoading(true);
    await fetch("https://second-brain-vuqg.onrender.com/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, completed: false })
    });
    setInput("");
    fetchTasks();
    setLoading(false);
  }

  async function deleteTask(id) {
    await fetch(`https://second-brain-vuqg.onrender.com/tasks/${id}`, {
      method: "DELETE"
    });
    fetchTasks();
  }

  async function toggleTask(id, completed) {
    await fetch(`https://second-brain-vuqg.onrender.com/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });
    fetchTasks();
  }

  async function analyzeWithAI() {
  if (tasks.length === 0) return;
  setLoading(true);
  
  const taskList = tasks.map(t => t.text).join("\n");
  
  const response = await fetch("https://second-brain-vuqg.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks: taskList })
  });
  
  const data = await response.json();
  alert(data.result);
  setLoading(false);
}

  return (
  <div className="app">
    <div className="header">
      <h1>🧠 Second Brain</h1>
      <p className="subtitle">Your AI Productivity OS</p>
    </div>

    <button className="analyze-btn" onClick={analyzeWithAI}>
      ✨ Analyze & Prioritize My Tasks
    </button>

    <div className="input-area">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && addTask()}
        placeholder="Dump anything on your mind..."
      />
      <button className="add-btn" onClick={addTask}>+</button>
    </div>

    <p className="section-title">{tasks.length} things on your mind</p>

    <div className="tasks">
      {tasks.length === 0 && (
        <p className="empty">YOUR MIND IS CLEAR</p>
      )}
      {tasks.map((task) => (
        <div key={task._id} className={`task ${task.completed ? "done" : ""}`}>
          <span onClick={() => toggleTask(task._id, task.completed)}>
            {task.completed ? "✅" : "⬜"} {task.text}
          </span>
          <button className="delete-btn" onClick={() => deleteTask(task._id)}>✕</button>
        </div>
      ))}
    </div>
  </div>
);
}

export default App;