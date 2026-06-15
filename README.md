# 💬 Chatify

A **real-time full-stack chat application** built with the MERN stack, powered by **Socket.IO** for instant bidirectional communication. Chatify supports image sharing, online presence tracking, email notifications, cloud media uploads, and enterprise-grade security via Arcjet.

---

## ✨ Features

- 🔴 **Real-Time Messaging** — Instant message delivery using **Socket.IO** (WebSocket-based)
- 👥 **Online Presence** — See who's online in real time via socket user-tracking map
- 🔔 **Sound Notifications** — Toggleable audio alerts for incoming messages
- 🖼️ **Image Sharing** — Send images in chat (uploaded to **Cloudinary**)
- 📷 **Profile Pictures** — Upload and update profile avatar (stored on **Cloudinary**)
- 📧 **Welcome Emails** — Automated welcome email on signup using **Resend**
- 🔐 **JWT Authentication** — Secure cookie-based auth with `httpOnly` JWT tokens
- 🛡️ **Arcjet Security** — Bot detection, SQL injection shield & sliding-window rate limiting
- ⚡ **Optimistic UI** — Messages appear instantly before server confirmation
- 🗂️ **Chats & Contacts Tabs** — Switch between existing conversations and all contacts
- 🌐 **Production Ready** — Serves the React frontend as static files in production mode

---

## 🛠️ Tech Stack

### Backend

| Technology | Role |
|---|---|
| **Node.js + Express** | REST API server |
| **Socket.IO** `v4.8` | Real-time bidirectional messaging & presence |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT (jsonwebtoken)** | Stateless authentication via HTTP-only cookies |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Cloud storage for images & profile pictures |
| **Resend** | Transactional email (welcome emails) |
| **Arcjet** | Bot detection, rate limiting, OWASP shield |
| **cookie-parser** | Cookie parsing middleware |
| **cors** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |
| **nodemon** | Dev server auto-restart |

### Frontend

| Technology | Role |
|---|---|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Zustand** | Lightweight global state management |
| **Socket.IO Client** `v4.8` | Real-time socket connection |
| **Axios** | HTTP requests |
| **TailwindCSS v3 + DaisyUI** | Utility-first styling & component library |
| **Lucide React** | Icon library |
| **react-hot-toast** | Toast notification system |

---

## 🏗️ Project Structure

```
Chatify/
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js      # Signup, login, logout, update profile
│       │   └── message.controller.js   # Send message, get messages, get contacts/chats
│       ├── emails/
│       │   ├── emailHandlers.js        # Send welcome email via Resend
│       │   └── emailTemplates.js       # HTML email templates
│       ├── lib/
│       │   ├── arcjet.js               # Arcjet security config (shield, bot, rate limit)
│       │   ├── cloudinary.js           # Cloudinary SDK init
│       │   ├── db.js                   # MongoDB connection
│       │   ├── env.js                  # Typed env variable exports
│       │   ├── resend.js               # Resend email client init
│       │   ├── socket.js               # ⚡ Socket.IO server setup & online user tracking
│       │   └── utilis.js               # JWT token generator
│       ├── middleware/
│       │   ├── arcjet.middleware.js    # Request-level Arcjet protection
│       │   ├── auth.middleware.js      # Protect REST routes (JWT verification)
│       │   └── socket.auth.middleware.js # ⚡ Authenticate Socket.IO connections via JWT
│       ├── models/
│       │   ├── User.js                 # User schema (fullName, email, password, profilePic)
│       │   └── Message.js             # Message schema (senderId, receiverId, text, image)
│       ├── routes/
│       │   ├── auth.route.js           # /api/auth routes
│       │   └── message.route.js        # /api/messages routes
│       └── server.js                   # Express app entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ChatContainer.jsx        # Main chat window with messages
        │   ├── ChatHeader.jsx           # Chat header (user info + online badge)
        │   ├── ChatsList.jsx            # List of existing chat partners
        │   ├── ContactList.jsx          # List of all contacts
        │   ├── MessageInput.jsx         # Message input box with image upload
        │   ├── ProfileHeader.jsx        # Profile section with avatar upload
        │   ├── ActiveTabSwitch.jsx      # Chats / Contacts tab toggle
        │   ├── NoChatHistoryPlaceholder.jsx
        │   ├── NoConversationPlaceholder.jsx
        │   ├── MessagesLoadingSkeleton.jsx
        │   ├── UsersLoadingSkeleton.jsx
        │   ├── PageLoader.jsx
        │   ├── BorderAnimatedContainer.jsx
        │   └── NoChatsFound.jsx
        ├── hooks/                       # Custom React hooks
        ├── lib/
        │   └── axios.js                 # Axios instance with base URL
        ├── pages/
        │   ├── ChatPage.jsx             # Main chat layout page
        │   ├── LoginPage.jsx            # Login form
        │   └── SignUpPage.jsx           # Registration form
        ├── store/
        │   ├── useAuthStore.js          # ⚡ Auth state + socket connect/disconnect
        │   └── useChatStore.js          # ⚡ Chat state + socket subscriptions
        ├── App.jsx                      # Route definitions & auth guard
        ├── main.jsx                     # React entry point
        └── index.css                    # Global styles
```

---

## ⚡ Socket.IO — How It Works

Chatify uses **Socket.IO** for all real-time functionality. Here's a breakdown:

### Server-side (`backend/src/lib/socket.js`)
```js
// An HTTP server wraps Express, then Socket.IO wraps that server
const io = new Server(server, { cors: { origin: CLIENT_URL, credentials: true } });

// Every socket connection is authenticated via JWT middleware
io.use(socketAuthMiddleware);

// A map tracks which socket ID belongs to which user
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  userSocketMap[socket.userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // broadcast presence

  socket.on("disconnect", () => {
    delete userSocketMap[socket.userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // update presence
  });
});
```

### Socket Authentication Middleware (`socket.auth.middleware.js`)
- Extracts the JWT from the socket's HTTP-only cookie on handshake
- Verifies the token and fetches the user from MongoDB
- Attaches `socket.user` and `socket.userId` for downstream use
- Rejects unauthenticated connections before the `connection` event fires

### Client-side (`frontend/src/store/useAuthStore.js`)
```js
// Socket connects on login/signup and disconnects on logout
const socket = io(BASE_URL, { withCredentials: true });
socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
```

### Message Events (`frontend/src/store/useChatStore.js`)
```js
// Subscribe to incoming messages for the selected conversation
socket.on("newMessage", (newMessage) => {
  set({ messages: [...currentMessages, newMessage] });
  if (isSoundEnabled) new Audio("/sounds/notification.mp3").play();
});
```

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/signup` | Register a new user | ❌ |
| `POST` | `/login` | Log in and receive JWT cookie | ❌ |
| `POST` | `/logout` | Clear JWT cookie | ✅ |
| `PUT` | `/update-profile` | Upload new profile picture | ✅ |
| `GET` | `/check` | Verify current session | ✅ |

### Message Routes — `/api/messages`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/contacts` | Get all users (excluding self) | ✅ |
| `GET` | `/chats` | Get all users you've chatted with | ✅ |
| `GET` | `/:id` | Get message history with a user | ✅ |
| `POST` | `/send/:id` | Send a message (text or image) | ✅ |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB URI (local or [MongoDB Atlas](https://cloud.mongodb.com))
- [Cloudinary](https://cloudinary.com) account
- [Resend](https://resend.com) API key
- [Arcjet](https://arcjet.com) API key

### 1. Clone the Repository

```bash
git clone https://github.com/rathorrajput16/Chatify.git
cd Chatify
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=3000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_jwt_key

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RESEND_API_KEY=your_resend_api_key

ARCJET_KEY=your_arcjet_api_key
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 4. Run in Development

Open **two terminals**:

```bash
# Terminal 1 — Backend (runs on http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

### 5. Build for Production

```bash
cd frontend
npm run build
```

Then start the backend — it will serve the built frontend automatically:

```bash
cd backend
npm start
```

---

## 🛡️ Security

Chatify implements multiple layers of security:

| Layer | Implementation |
|---|---|
| **Password Hashing** | `bcryptjs` with salt rounds of 10 |
| **JWT Auth** | HTTP-only cookie (not accessible via JS) |
| **Socket Auth** | JWT verified on every WebSocket handshake |
| **Bot Detection** | Arcjet `detectBot` in LIVE mode |
| **OWASP Shield** | Arcjet `shield` against SQL injection etc. |
| **Rate Limiting** | Arcjet `slidingWindow` — 100 req/60s |
| **CORS** | Restricted to `CLIENT_URL` only |
| **Input Validation** | Server-side email regex & password length checks |



## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">Built with ❤️ by <a href="https://github.com/rathorrajput16">rathorrajput16</a></p>