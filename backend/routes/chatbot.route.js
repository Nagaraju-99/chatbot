import express from 'express';
import { sendMessage } from '../controllers/chatbot.controller.js';
import { protectRoute } from './protectRoute.js';

const router = express.Router();

router.post('/message', protectRoute, sendMessage);

export default router;