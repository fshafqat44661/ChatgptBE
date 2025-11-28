import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})



connectDB()
.then((dbConnected) => {
    const port = process.env.PORT || 8003;
    const host = process.env.HOST || '0.0.0.0';
    
    app.listen(port, host, () => {
        console.log(`✅ Server is running on ${host}:${port}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Database: ${dbConnected ? 'Connected' : 'Disconnected'}`);
        console.log(`🌐 CORS Origins: ${process.env.CORS_ORIGIN || 'Using fallback origins'}`);
        if (!dbConnected) {
            console.log('⚠️  Some features may not work without database');
        }
    });
})
.catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1)
})
