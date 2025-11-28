import mongoose from 'mongoose';

const userHistorySchema = new mongoose.Schema({
    query: { type: String, required: true },
    staticContext: { type: String },
    chatbotResponse: { type: String, required: true },
    conversationId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

export default UserHistory;
