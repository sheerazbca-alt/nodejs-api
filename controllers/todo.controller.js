import todos from "../models/todo.model.js";
import mongoose from "mongoose";

import { asyncHandler } from "../middleware/asyncHandler.js";

export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // validation
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }
  const todo = await todos.create({
    title,
    description,
  });
  return res.status(201).json({
    success: true,
    message: "Todo created successfully",
    todo,
  });
});

// Get all todo - Get API

export const getTodos = asyncHandler(async (req, res) => {
  // Query Param
  const { search, sort, page = 1, limit = 10 } = req.query;
  // Base query
  let query = {};
  // Search by title
  if (search) {
    query.title = { $regex: search, $options: "i" }; // i for case sensitive
  }
  // Sorting
  let sortOption = {};
  if (sort === "asc") sortOption.createdAt = 1;
  else sortOption.createdAt = -1;
  // Pagination
  const skip = (page - 1) * limit;
  const todosList = await todos
    .find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);
  const totalTodos = await todos.countDocuments(query);
  return res.status(200).json({
    success: true,
    message: "Todos fetched successfully",
    total: totalTodos,
    page: Number(page),
    limit: Number(limit),
    data: todosList,
  });
});

// Get todo by ID - Get API

export const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID based on Mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo Id",
    });
  }

  const todo = await todos.findById(id);

  // If todo not found
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  // If todo found
  if (todo) {
    return res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      data: todo,
    });
  }
});

// Update todo by ID - PUT API

export const updateTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  // Validate ID based on Mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo Id",
    });
  }

  // Validation for title
  if (title && title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  // Find the todo by ID and update it
  const updatedTodo = await todos.findByIdAndUpdate(
    id,
    { title, description },
    { new: true, runValidators: true },
  );

  // If todo not found
  if (!updatedTodo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  // If todo updated successfully
  return res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: updatedTodo,
  });
});

// Toggle todo by ID - PATCH API

export const toggleTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID based on Mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo Id",
    });
  }

  // Find the todo by ID
  const todo = await todos.findById(id);

  // If todo not found
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  // Toggle the isCompleted field
  todo.isCompleted = !todo.isCompleted;
  await todo.save();

  // If todo toggled successfully
  return res.status(200).json({
    success: true,
    message: "Todo toggled successfully",
    data: todo,
  });
});

// Delete todo by ID - DELETE API

export const deleteTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID based on Mongoose ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo Id",
    });
  }

  // Find the todo by ID and delete it
  const deletedTodo = await todos.findByIdAndDelete(id);

  // If todo not found
  if (!deletedTodo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  // If todo deleted successfully
  return res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: deletedTodo,
  });
});
