import express from 'express';
import { getChatHistory } from '../controllers/user.controller.js';
import { protectRoute } from './protectRoute.js';

const router = express.Router();

router.get('/chathistory', protectRoute, getChatHistory);

export default router;