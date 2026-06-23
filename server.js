const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

const Task = require("./models/Task");

// Save a new task
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update task as completed
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/analyze", async (req, res) => {
  const tasks = req.body.tasks;
  
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.GROQ_API_KEY
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a brutal productivity coach. Given a list of tasks analyze them and:
1. Pick the TOP 3 most important tasks to do TODAY
2. Identify which tasks are low priority time wasters
3. Give one brutal honest observation about this person's priorities
Be direct, specific and ruthless. No sugarcoating.`
        },
        {
          role: "user",
          content: tasks
        }
      ]
    })
  });
  
  const data = await response.json();
  res.json({ result: data.choices[0].message.content });
});