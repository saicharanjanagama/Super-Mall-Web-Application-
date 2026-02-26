<h1 align="center">🛍️ Super Mall Web Application (React + Firebase + Cloudinary)</h1> 

<p align="center"> 
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Backend-Firebase-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-Firestore-yellow?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Auth-Firebase%20Auth-green?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Storage-Cloudinary-red?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Styling-Styled%20Components-black?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Routing-React%20Router-blueviolet?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Deployment-Firebase%20Hosting-purple?style=for-the-badge" /> 
</p> 

<p align="center"> 
  A <b>full-featured Super Mall management web application</b> built using <b>React + Firebase + Cloudinary</b>. The platform enables <b>Admins to manage shops, products, offers, categories, and floors</b>, while Users can <b>browse, filter, compare products, and explore shop-wise offers</b>. Designed using <b>modular React architecture, secure authentication, scalable Firestore database, and production-level deployment practices</b>.
</p>
---

## 🌍 Live Application 

🔗 **Live URL:**  [🛍️ Super Mall Web Application](https://p777-9d06d.web.app/)

---

## 🎯 Problem Statement

Traditional mall management systems lack:
- Centralized digital product listing
- Secure admin-based management
- Product comparison functionality
- Structured category & floor filtering
- Cloud-based scalable backend

This platform solves that by:

✅ Secure Admin & User Authentication<br>
✅ Dynamic Shop & Offer Management<br>
✅ Product Comparison (Cost & Features)<br>
✅ Category-wise & Floor-wise Browsing<br>
✅ Cloudinary Image Upload Integration<br>
✅ Production-ready scalable architecture

---

## 🔐 Core Features

### 👤 Authentication System
- User Registration
- Secure Login & Logout
- Firebase Authentication
- Persistent Login State
- Protected Routes
- Role-based Access (Admin / User)

### 🏬 Admin Management System

- Create Shop Details
- Manage Shop Information
- Manage Offer Details
- Manage Category & Floor
- Add / Edit / Delete Products
- Shop-wise Offer Management
- Logging for all admin actions

### 🛍️ Product & Mall Features

- Category-wise Product Listing
- Floor-wise Shop Details
- Compare Products (Price & Features)
- Filter by Category / Price
- Search & Explore Shops
- Shop-wise Offers Display

### 📸 Media Handling

- Cloudinary Image Upload
- Image Preview Support
- Secure Media Hosting

### 🧠 Architecture & Code Quality

- Modular Component Structure
- Reusable React Components
- Clean Folder Structure
- Environment-based Configuration
- Firebase Firestore Structured Collections

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
- **Firebase Hosting**

### Media Storage

- **Cloudinary Integration**

### Security
- **Firestore Security Rules**
- **Storage Security Rules**
- **Protected Routes**
- **Auth-based Data Access**

---

## 🧠 How the Application Works

1️⃣ Admin / User registers or logs in
2️⃣ Firebase Authentication verifies credentials
3️⃣ Role-based dashboard loads
4️⃣ Admin manages shops/products/offers
5️⃣ Data stored securely in Firestore
6️⃣ Users browse & filter shops/products
7️⃣ Product comparison executed dynamically
8️⃣ Images uploaded to Cloudinary
9️⃣ Application served via Firebase Hosting

---

## 🗂️ Project Structure

```bash
chat-application/
├── src/
│   ├── api/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── services/
│   ├── routes/
│   ├── styles/
│   ├── views/
│   ├── utils/
│   ├── index.js
│   └── App.js
├── public/
│   └── images/
├── firestore.rules
├── storage.rules
├── firebase.json
└── README.md
```

---

## 🔐 Security Rules

### Firestore

- Only authenticated users can read data
- Only Admin can create/update/delete shops & products
- Role-based data validation

---

## 🔧 Setup Instructions (Local Development)

### 📦 Prerequisites

- Node.js (v18+ recommended)
- Firebase Project
- Cloudinary Account
- Git

### 1️⃣ Clone Repo

```bash
git clone https://github.com/saicharanjanagama/Super-Mall-Web-Application-.git
cd Super-Mall-Web-Application-
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

REACT_APP_CLOUDINARY_CLOUD_NAME=
REACT_APP_CLOUDINARY_UPLOAD_PRESET=
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

https://p777-9d06d.web.app/

---

## 🧪 Test Cases

### Authentication

- Register new user
- Login with incorrect credentials
- Role-based dashboard access
- Logout functionality

### Admin Module

- Add new shop
- Update shop details
- Delete product
- Create offer

### User Module

- Browse category-wise products
- Filter by price
- Compare two products
- View shop-wise offers

### Security

- Unauthorized admin access attempt
- Firestore write without permission

---

## ⚡ Optimization Techniques Used

- Modular React architecture
- Efficient Firestore queries
- Cloud-based scalable backend
- Reusable UI components
- Clean separation of concerns
- Environment-based configuration

---

## 🎯 Future Improvements

- Real-time Offer Notifications
- Advanced Search & Sorting
- Payment Gateway Integration
- Analytics Dashboard
- Dark Mode UI
- Mobile App Version

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
