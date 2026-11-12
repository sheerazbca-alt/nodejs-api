import express from "express";
import cors from "cors"

import todoRoute from "./routes/todo.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import {errorHandler} from "./middleware/error.middleware.js"

dotenv.config();

const app = express();

// Middleware

app.use(cors());
app.use(express.json());

// connect to DB
connectDB();

// Routes
app.use("/api", todoRoute)

// Error Handler Middleware
app.use(errorHandler)

// Start Server

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})