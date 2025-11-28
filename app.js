import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = process.env.CORS_ORIGIN ? 
            process.env.CORS_ORIGIN.split(',') : 
            ['http://localhost:3000', 'https://chatgpt-one-khaki.vercel.app'];
        
        console.log(`🌐 Request from origin: ${origin || 'No origin'}`);
        console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // For now, allow all vercel.app domains
        if (origin.includes('vercel.app') || origin.includes('localhost')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`❌ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No origin'}`);
    next();
});

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import gptRouter from './routes/gpt.routes.js'

// Health check routes
app.get("/", (req, res) => {
    res.json({ 
        message: "ChatGPT Clone API is working!", 
        timestamp: new Date().toISOString(),
        status: "success",
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get("/api/v1/test", (req, res) => {
    res.json({ 
        message: "ChatGPT Clone API is working!", 
        timestamp: new Date().toISOString(),
        status: "success"
    });
});

app.use("/api/v1/gpt", gptRouter)

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Global error:', error.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});


export { app }
