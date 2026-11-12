import express from "express";
import { createTodo, getTodos, getTodoById, updateTodoById, toggleTodoById, deleteTodoById } from "../controllers/todo.controller.js"

const route = express.Router()



// Create Todo
route.post("/add", createTodo);

// Get Todo
route.get("/todos", getTodos);

// Get Todo by Id
route.get("/todos/:id", getTodoById);

// Update Todo by Id
route.put("/todos/:id", updateTodoById);

// Toggle Todo by Id - Patch
route.patch("/todos/:id/toggle", toggleTodoById);

// Delete Todo by Id
route.delete("/todos/:id", deleteTodoById);

export default route;