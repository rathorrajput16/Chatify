# 💬 CHATIFY: Real-Time Chat Application

A full-stack real-time chat application built from scratch, focusing on core backend engineering, real-time communication, and clean system architecture.

---

## 🚀 Features

- 🔐 Custom JWT Authentication using HTTP-only cookies (no third-party auth)
- ⚡ Real-time messaging powered by Socket.io
- 🟢 Online / Offline presence indicators
- ✍️ Typing indicators with notification & typing sounds (toggle supported)
- 📨 Automated welcome emails on signup (Resend)
- 🗂️ Image uploads & media storage using Cloudinary
- 🧰 RESTful API built with Node.js & Express
- 🧱 MongoDB for scalable data persistence
- 🎨 Modern UI with React, Tailwind CSS & DaisyUI
- 🧠 Global state management using Zustand
- 🧑‍💻 Professional Git & GitHub workflow (branches, PRs, merges)
- 🚀 Easy, free-tier-friendly deployment with Sevalla

---

## 🛠️ Tech Stack

**Frontend**
- React
- Tailwind CSS
- DaisyUI
- Zustand

**Backend**
- Node.js
- Express
- Socket.io
- MongoDB

**Services & Tools**
- Cloudinary
- Resend
- JWT
- Git & GitHub

---

## 🧠 Engineering Highlights

- Implemented authentication and authorization from scratch
- Designed real-time socket-based communication
- Clean separation of frontend and backend
- Scalable project structure with environment-based configuration
- Focused on maintainability and readability

---

## 🔮 Future Improvements

- Group chats
- Message read receipts
- Rate limiting & abuse prevention
- End-to-end encryption (exploration)

---

## 🧪 Environment Variables

### Backend (`/backend/.env`)

```bash
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongo_connection_string

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_address
EMAIL_FROM_NAME=your_app_name

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_api_key
ARCJET_ENV=development
