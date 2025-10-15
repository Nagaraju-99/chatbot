import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import AuthUser from "../models/auth.user.model.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export const sendMessage = async (req, res) => {
    try {
        const { text, chatId } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = text;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const botMessage = response.text();

        // Save chat to the database
        const user = await AuthUser.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userMessage = { sender: 'user', text: prompt };
        const botResponse = { sender: 'bot', text: botMessage };

        let currentChat;
        if (chatId) {
            currentChat = user.chatHistory.id(chatId);
        }

        if (currentChat) {
            currentChat.messages.push(userMessage, botResponse);
        } else {
            const newChat = {
                title: prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''),
                messages: [userMessage, botResponse]
            };
            user.chatHistory.push(newChat);
            currentChat = user.chatHistory[user.chatHistory.length - 1];
        }

        await user.save();

        res.status(200).json({
            chatId: currentChat._id,
            messages: currentChat.messages
        });
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};