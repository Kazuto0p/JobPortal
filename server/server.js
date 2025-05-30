import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import connection from './connection.js';
// import job from './Router/router.js';
import userRoutes from "./Router/user_routes.js"; 
import jobRoutes from "./Router/job_routes.js";
import applicationRoutes from "./Router/application_routes.js";



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("Welcome to Kirito's backend setup!");
});

// app.use("/api",job)
app.use("/api", userRoutes); // Mount user routes
app.use("/api", jobRoutes);
app.use("/api/applications", applicationRoutes);

connection().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB error:', err);
});