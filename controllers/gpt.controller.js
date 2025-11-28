
import dotenv from 'dotenv';
import { asyncHandler } from '../utils/asyncHandler.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import UserHistory from '../models/userHistory.model.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyA5iQz_gk11ZbzR88B0HCHsiR8KQ97X6oQ';

const genAI = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;


export const chatgptReq = asyncHandler(async (req, res) => {
    const { query, staticContext, conversationId } = req.body;
    const userId = null; // No authentication required

    if (!query) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    try {
        const sessionConversationId = conversationId || uuidv4();
        const previousChats = await UserHistory.find({ conversationId: sessionConversationId }).sort({ timestamp: 1 });

        const chatbotResponse = await generateChatResponse(query, previousChats);
        
        await UserHistory.create({
            query,
            staticContext,
            chatbotResponse,
            conversationId: sessionConversationId,
        });
        
        // Respond to the user with the generated chatbot response
        res.status(200).json({
            query,
            context: staticContext,
            response: chatbotResponse,
            conversationId: sessionConversationId,
        });
    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});







const generateChatResponse = async (userQuery, previousChats) => {
    if (genAI && GOOGLE_API_KEY) {
        try {
            const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
            
            let contextPrompt = `You are a helpful AI assistant. Please format your responses with proper structure using:
- **Bold text** for headings and important points
- Bullet points (•) or numbered lists for multiple items
- Line breaks for better readability
- Code blocks with \`\`\` for code examples
- Clear paragraphs separated by line breaks

`;
            
            if (previousChats && previousChats.length > 0) {
                contextPrompt += `Here's our conversation history:\n`;
                // Get last 5 messages for context, maintain chronological order
                previousChats.slice(-5).forEach(chat => {
                    contextPrompt += `User: ${chat.query}\nAssistant: ${chat.chatbotResponse}\n`;
                });
                contextPrompt += `\nNow respond to this new question: ${userQuery}`;
            } else {
                contextPrompt += `Please respond to: ${userQuery}`;
            }
            
            const result = await model.generateContent(contextPrompt);
            const response = await result.response;
            return response.text();
            
        } catch (error) {
            return "I'm sorry, I'm having trouble processing your request right now. Please try again.";
        }
    }
    
    return "AI service is not available. Please check your configuration.";
};



export const getUserHistory = asyncHandler(async (req, res) => {
    try {
        const history = await UserHistory.find({}).sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch user history', 
            message: 'Database connection issue. Please check MongoDB Atlas network access settings.' 
        });
    }
});

export const deleteUserHistoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedHistory = await UserHistory.findOneAndDelete({ _id: id });
        if (!deletedHistory) {
            return res.status(404).json({ error: 'History entry not found' });
        }
        res.json({ message: 'History entry deleted successfully', deletedHistory });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user history' });
    }
});

export const delUserChatByConID = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    try {
        const deletedHistory = await UserHistory.deleteMany({ conversationId });
        if (!deletedHistory.deletedCount) {
            return res.status(404).json({ error: 'History entry not found' });
        }
        res.json({ message: 'History conversation deleted successfully', deletedHistory });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user history' });
    }
});

export const deleteAllUserChats = asyncHandler(async (req, res) => {
    try {
        const deletedHistory = await UserHistory.deleteMany({});
        if (!deletedHistory.deletedCount) {
            return res.status(404).json({ error: 'No chat history found to delete' });
        }
        res.json({ message: 'All chat history deleted successfully', deletedHistory });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete chats' });
    }
});

export const getUserHistoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const history = await UserHistory.findOne({ _id: id });
        if (!history) {
            return res.status(404).json({ error: 'History entry not found' });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user history' });
    }
});

export const getUserChatByConID = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    try {
        const history = await UserHistory.find({ conversationId });
        if (!history || history.length === 0) {
            return res.status(404).json({ error: 'History entry not found' });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user history' });
    }
});

export const getLatestUserHistoryWithFiles = asyncHandler(async (req, res) => {
    try {
        const filter = { uploadedFiles: { $exists: true, $not: { $size: 0 } } };
        const history = await UserHistory.find(filter).sort({ timestamp: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user history' });
    }
});