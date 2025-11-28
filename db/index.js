import mongoose from "mongoose";

const connectDB = async () => {
    
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://fshafqat:Mbd1zadOBYQMfaBC@cluster0.v2echrn.mongodb.net/chatgpt-clone?retryWrites=true&w=majority&appName=Cluster0';
        console.log('🔄 Connecting to MongoDB...');
        const connectionInstance = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection FAILED:', error.message);
        console.log('⚠️  App will continue without database functionality');
        return false;
    }
}

export default connectDB