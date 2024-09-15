import express from "express";
import cors from 'cors';
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todo-db')
.then(() => { console.log('Connected to Mongodb') })
.catch((error) => { console.log('Error connecting to DB')});

const todoSchema = new mongoose.Schema({
  task: { type: String, required: true, unique: true, lowercase: true},
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

app.post('/todos', async (req, res) => {
  try {
    console.log("req", req.body);
    if (!req.body || !req.body.task) {
      res.status(400).json({ error: "Invalid request type" });
      return;
    }

    const { task } = req.body;

    // Try to create the todo
    const todo = await Todo.create({ task });
    res.json(todo);

  } catch (error) {
    console.log(error);

    // Check for the duplicate key error (error code 11000)
    if (error.code === 11000) {
      res.status(409).json({ error: "Todo already exists" });
    } else {
      res.status(500).json({ error: "Failed to create todo" });
    }
  }
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos"});
  }
});

app.patch('/todos', async (req, res) => {
  console.log(req.body)
  try{
    const { ids, updates } = req.body  // Expect an array of IDs and an updates
    const result = await Todo.updateMany(
      { _id: {$in: ids }},
      { $set: updates 
      });
    res.json({ message: "Task Updated", modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete('/todos', async (req, res) => {
  try {
    const { ids } = req.body;
    // Validate that ids is an array and not empty
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid request. Provide an array of IDs.' });
    }

    // Validate the IDs
    if (!ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: 'One or more invalid IDs.' });
    }
    const result = await Todo.deleteMany({ _id: {$in: ids} });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting todos", error);
    res.status(500).json({ error: 'Failed to delete todos' })
  }
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});
  