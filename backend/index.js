import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.route.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

const port = process.env.PORT || 4002;

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//Database Connection code
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

// Defining Routes
app.use("/bot/v1/", chatbotRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
