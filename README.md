<h1 align="center">🛍️ Super Mall Web Application (HTML + CSS + JS + Firebase)</h1> 

<p align="center"> 
  <img src="https://img.shields.io/badge/Frontend-HTML5-orange?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Styling-CSS3-blue?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Logic-JavaScript-yellow?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Backend-Firebase-red?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Database-Firestore-green?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Auth-Firebase%20Auth-purple?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Deployment-Firebase%20Hosting-black?style=for-the-badge" /> 
</p> 

<p align="center"> A <b>secure Super Mall management web application</b> that allows merchants to manage shops, offers, products, categories, and locations while enabling users to explore and compare products efficiently. Built using <b>modular JavaScript architecture + Firebase backend</b> with secure authentication and logging system. </p>

---

## 🌍 Live Application 

🔗 **Live URL:**  [🛍️ Super Mall Web Application](https://p777-9d06d.web.app/)

---

## 🎯 Problem Statement

Many basic chat apps lack:
- Real-time synchronization
- Secure authentication
- Protected routes
- Media sharing
- Scalable backend architecture

This platform solves that by:

✅ Implementing real-time messaging using Firestore<br>
✅ Secure Firebase Authentication<br>
✅ Protected routes with persistent login<br>
✅ Image/media sharing<br>
✅ Production-ready architecture

---

## 🔐 Core Features

### 👤 Authentication System
- User Registration
- Secure Login & Logout
- Firebase Authentication
- Persistent Login State
- Protected Routes
- Error Handling & Toast Notifications

### 💬 Real-Time Messaging

- One-to-one private chat
- Real-time Firestore listeners
- Instant message updates
- Message timestamps
- Optimistic UI updates

### 📁 Media Sharing

- Upload images
- Firebase Storage integration
- File preview support
- Secure storage ruless

### 👥 User Management

- Search users
- Start new conversations
- Unique chat ID generation
- Store conversation metadata
- Track last message & timestamp

### 🧠 State Management

- Redux Toolkit for global state
- Auth slice
- Chat slice
- Clean modular architecture

---

## 🛠️ Technologies Used

### Frontend
- **React JS**
- **React Router DOM**
- **Redux Toolkit**
- **Styled Components**

### Backend
- **Firebase Authentication**
- **Firestore Database**
- **Firebase Storage**
- **Firebase Hosting**

### Security
- Firestore Security Rules
- Storage Security Rules
- Protected Routes
- Auth-based Data Access

---

## 🧠 How the Application Works

1️⃣ User Registers / Logs in<br>
2️⃣ Firebase Authentication verifies user<br>
3️⃣ Dashboard loads user list<br>
4️⃣ User selects another user<br>
5️⃣ Chat room created dynamically<br>
6️⃣ Messages stored in Firestore<br>
7️⃣ Real-time listeners update UI instantly<br>
8️⃣ Media files stored in Firebase Storage<br>
9️⃣ Conversation metadata updated automatically

---

## 🗂️ Project Structure

```bash
chat-application/
├── src/
│   ├── components/
│   ├── features/
│   │   ├── profile/
│   │   ├── chat/
│   │   ├── rooms/
│   ├── services/
│   │   └── firebase.js
│   ├── utils/
│   ├── App.css/
│   └── App.js
├── public/
├── firestore.rules
├── storage.rules
├── firebase.json
└── README.md
```

---

## 🔐 Security Rules

### Firestore

- Users can read/write only their chats
- Conversation participants only can access messages
- Metadata protected per user

### Storage

- Only authenticated users can upload
- File access restricted by UID
- Controlled media access

---

## 🔧 Setup Instructions (Local Development)

### 📦 Prerequisites

- Node.js (v18+ recommended)
- Firebase Project
- Git

### 1️⃣ Clone Repo

```bash
git clone https://github.com/saicharanjanagama/chat-application.git
cd chat-application
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Create .env
Create file in root:

```bash
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

### 4️⃣ Run App

```bash
npm start
```

---

## 🚀 Deployment (Firebase Hosting)

### Build:

```bash
npm run build
```

### Deploy:

```bash
firebase deploy
```

### Hosting URL:

https://chatapplication-87b43.web.app

---

## 🧪 Test Cases

### Authentication

- Register new user
- Register duplicate user
- Login with wrong password
- Logout functionality
- Access protected route without login

### Messaging

- Send text message
- Send image message
- Real-time update verification
- Create new chat
- Verify chat persistence after refresh

### Security

- Attempt to access another user's chat
- Attempt unauthorized Firestore write

---

## ⚡ Optimization Techniques Used

- Real-time Firestore listeners
- Redux global state optimization
- Lazy component loading
- Optimistic UI updates
- Modular architecture
- Clean folder structure
- Environment-based configuration

---

## 🎯 Future Improvements

- Group Chat
- Online / Offline status
- Typing indicators
- Message reactions
- Push notifications
- End-to-End Encryption
- Dark Mode UI

---

## 👨‍💻 Author

It’s me — **Sai Charan Janagama** 😄<br>
🎓 Computer Science Graduate | 🌐 Aspiring Full Stack Developer<br>
📧 [Email Me](saic89738@gmail.com) ↗<br>
🔗 [LinkedIn](https://www.linkedin.com/in/saicharanjanagama/) ↗<br>
💻 [GitHub](https://github.com/SaiCharanJanagama) ↗

---

## 💬 Feedback

If you have any feedback or suggestions, feel free to reach out!  
Your input helps me improve 🚀
