# AiAgentBac

> 🛠️ Backend for your AI-Agent Chat Application (Node.js + Express + Socket.io + MongoDB)

## 📚 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [License](#license)

---

## 🧠 About
AiAgentBac is the backend service for your AI-Agent Chat Application.  
It handles:

- User authentication  
- AI request processing (Google GenAI APIs)  
- Real-time communication using Socket.io  
- Database operations via MongoDB  
- Rate limiting / caching using Redis (optional)

It connects directly to the frontend repository **AiAgentFr**.

---

## ✅ Features
- Full REST API using **Express 5**
- Real-time communication with **Socket.io**
- MongoDB models with **Mongoose**
- Authentication using **JWT + bcrypt**
- Validation using **express-validator**
- CORS-enabled API
- Logging using **morgan**
- Secure `.env` management using **dotenv**
- Modular folder architecture (controllers, routes, services, middleware)
- Google `@google/generative-ai` for AI responses

---

## 🛠️ Tech Stack
- **Node.js**, **Express.js**
- **MongoDB**, **Mongoose**
- **Socket.io** (real-time chat)
- **JWT Authentication**
- **Redis (ioredis)** (optional)
- **Google GenAI SDK**
- Other tools: **dotenv**, **cors**, **bcrypt**, **cookie-parser**, **morgan**

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url_if_used
GENAI_API_KEY=your_google_gen_ai_key
CLIENT_URL=http://localhost:5173
PORT=5000
Your .env is ignored via .gitignore.

```

🚀 Getting Started
Prerequisites
Node.js (v14+)

npm

MongoDB (local or Atlas)

Redis (optional)

Google GenAI API key

📥 Installation
Clone the repository:

bash
Copy code
git clone https://github.com/shreyajain9589/AiAgentBac.git
cd AiAgentBac
Install dependencies:

bash
Copy code
npm install
Create environment file:

bash
Copy code
cp .env.example .env   # only if .env.example exists
Add your values.

▶️ Running Locally
Since your package.json uses server.js as the entry file and does not define a start script:

Development (auto-restart using nodemon)
bash
Copy code
npx nodemon server.js
Production
bash
Copy code
node server.js
Your backend will run on the port defined in .env
(default: 5000).

📁 Project Structure
plaintext
Copy code
AiAgentBac/
  ├── controllers/          # Request handlers
  ├── routes/               # API routes
  ├── services/             # Business logic (AI, user, chat)
  ├── middleware/           # Auth & validation middleware
  ├── models/               # MongoDB schemas
  ├── db/                   # Database connection files
  ├── utils/                # Helper utilities
  ├── server.js             # Main backend entry file
  ├── package.json
  ├── .env.example          # Example environment variables
  ├── .gitignore
  └── README.md


