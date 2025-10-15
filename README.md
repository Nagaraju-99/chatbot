# Chatbot Application

A full-stack chatbot application built with React (frontend) and Node.js/Express (backend), featuring user authentication, AI-powered chat using Google's Generative AI, and a modern UI with Tailwind CSS.

## Features

- User authentication (signup/login)
- AI-powered chatbot using Google Gemini AI
- Modern React frontend with Tailwind CSS
- RESTful API backend with Express.js
- MongoDB database for user data and chat history
- JWT-based authentication
- Responsive design

## Tech Stack

### Frontend
- React 19
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- Axios (HTTP client)
- Radix UI (components)
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Generative AI
- JWT (authentication)
- bcryptjs (password hashing)
- CORS

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Google AI API key (for Gemini AI)


4. Set up environment variables:

   Create a `.env` file in the `backend` directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   PORT=4002
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Chatbot
- `POST /bot/v1/chat` - Send message to chatbot
- `GET /bot/v1/history` - Get chat history

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Author

Nagaraju J
