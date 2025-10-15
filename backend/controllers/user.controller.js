import AuthUser from '../models/auth.user.model.js';

export const getChatHistory = async (req, res) => {
    try {
        const user = await AuthUser.findById(req.user.id).select('chatHistory');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Sort chat history by creation date (newest first)
        const sortedHistory = user.chatHistory.sort((a, b) => b._id.getTimestamp() - a._id.getTimestamp());
        res.status(200).json({ chatHistory: sortedHistory });
    } catch (error) {
        console.error('Error fetching chat history:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const clearChatHistory = async (req, res) => {
    // This is a placeholder for a future feature
    res.status(501).json({ message: 'Not implemented' });
};