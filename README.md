# ChatGPT Clone - Backend API

A robust Node.js backend API for a ChatGPT clone application, powered by Google's Gemini AI and built with Express.js and MongoDB.

## 🚀 Live Demo

- **API Base URL**: `https://chatgptbe-production.up.railway.app`
- **Health Check**: `https://chatgptbe-production.up.railway.app/api/v1/test`

## 📋 Features

- **AI Chat Integration**: Powered by Google Gemini AI (gemini-2.5-flash model)
- **Conversation Management**: Persistent chat history with conversation threading
- **RESTful API**: Clean, well-structured API endpoints
- **Database Integration**: MongoDB with Mongoose ODM
- **CORS Support**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling and logging
- **Environment Flexibility**: Fallback configurations for deployment

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **AI Service**: Google Generative AI (Gemini)
- **Authentication**: JWT (ready for implementation)
- **Deployment**: Railway

## 📦 Dependencies

### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `@google/generative-ai` - Google Gemini AI integration
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `uuid` - Unique identifier generation

### Development Dependencies
- `nodemon` - Development server with hot reload
- `prettier` - Code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatgptBE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=8003
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000,https://your-frontend-url.vercel.app

   # Database Configuration
   MONGODB_URI=your_mongodb_connection_string

   # Google Gemini Configuration
   GOOGLE_API_KEY=your_google_ai_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL
```
Local: http://localhost:8003/api/v1
Production: https://chatgptbe-production.up.railway.app/api/v1
```

### Endpoints

#### Health Check
```http
GET /api/v1/test
```
Returns server status and timestamp.

#### Chat Endpoints
```http
POST /api/v1/gpt/chat
Content-Type: application/json

{
  "query": "Your message here",
  "staticContext": "Optional context",
  "conversationId": "optional-conversation-id"
}
```

#### History Management
```http
GET /api/v1/gpt/chat-history
GET /api/v1/gpt/single-chat-history/:conversationId
GET /api/v1/gpt/chat-history/:id
DELETE /api/v1/gpt/chat-history/:conversationId
DELETE /api/v1/gpt/chat-history/:id
DELETE /api/v1/gpt/delete
```

## 🏗️ Project Structure

```
chatgptBE/
├── controllers/
│   └── gpt.controller.js      # Chat and history logic
├── db/
│   └── index.js               # Database connection
├── models/
│   └── userHistory.model.js   # Chat history schema
├── routes/
│   └── gpt.routes.js          # API route definitions
├── utils/
│   ├── ApiError.js            # Error handling utilities
│   ├── ApiResponse.js         # Response formatting
│   └── asyncHandler.js        # Async error wrapper
├── app.js                     # Express app configuration
├── index.js                   # Server entry point
├── constants.js               # Application constants
└── package.json               # Dependencies and scripts
```

## 🔧 Design Decisions

### Architecture Patterns
- **MVC Pattern**: Separation of concerns with models, controllers, and routes
- **Middleware Chain**: CORS, logging, parsing, and error handling
- **Async/Await**: Modern JavaScript async patterns with proper error handling

### Database Design
- **Conversation Threading**: Each chat belongs to a conversation for context
- **Flexible Schema**: Mongoose models with optional fields for extensibility
- **Indexing**: Optimized queries with proper indexing on conversation IDs

### Error Handling
- **Graceful Degradation**: App continues running even if database fails
- **Comprehensive Logging**: Detailed logs for debugging and monitoring
- **Fallback Configurations**: Environment variables with sensible defaults

### Security Considerations
- **CORS Configuration**: Whitelist-based origin control
- **Input Validation**: Request body validation and sanitization
- **Environment Variables**: Sensitive data stored in environment variables

## 🚀 Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
MONGODB_URI=your_production_mongodb_uri
GOOGLE_API_KEY=your_google_ai_api_key
GEMINI_MODEL=gemini-2.5-flash
```

## 🔍 Monitoring and Debugging

### Logging
The application includes comprehensive logging:
- Server startup information
- Database connection status
- Request logging with origins
- CORS debugging information
- Error tracking

### Health Checks
- Root endpoint (`/`) for basic health check
- Test endpoint (`/api/v1/test`) for API health
- Database connection status in logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Ensure your IP is whitelisted in MongoDB Atlas
- Check your connection string format
- Verify network access settings

**CORS Errors**
- Add your frontend domain to CORS_ORIGIN
- Check browser console for specific error messages
- Verify the origin header in requests

**502 Bad Gateway**
- Check Railway logs for startup errors
- Ensure all environment variables are set
- Verify the app binds to 0.0.0.0 (not localhost)

## 📞 Support

For support and questions, please open an issue in the GitHub repository.