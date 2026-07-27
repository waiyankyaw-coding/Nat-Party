# 🚀 TikTok Live Interactive Stage & Gift-Triggered App

A real-time full-stack web application that bridges **TikTok LIVE events** (such as gifts, comments, and user engagement) with a dynamic frontend web stage. When viewers send gifts on TikTok, the backend processes the event via WebSockets (`Socket.io`) and triggers instant on-screen reactions and animations.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Socket.io-client
* **Backend:** Node.js, Express, Socket.io, `tiktok-live-connector`
* **Streaming Tool:** TikTok LIVE Studio (Window Capture + Webcam)

---

## ✨ Features

* **Real-Time TikTok Event Listening:** Automatically connects to your active TikTok live broadcast using your unique handle.
* **Gift & Coin Processing:** Captures gift names, diamond/coin counts, and handles combo/streak recognition.
* **WebSocket Broadcasting:** Instantly streams event payloads from the backend server to the React frontend stage.
* **Interactive UI Reactions:** Triggers visual changes, animations, or rewards when specific gift thresholds are met.

---

## 📂 Project Structure

```text
NatKanaPwal/
├── Server/               # Node.js backend (TikTok connection & Socket.io)
│   ├── server.js
│   └── package.json
└── Client/               # React / Vite frontend UI stage
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
* Node.js installed on your machine.
* TikTok LIVE Studio (or OBS Studio) for broadcasting.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/NatKanaPwal.git
cd NatKanaPwal
```

### 2. Set Up & Run the Backend Server
```bash
cd Server
npm install
```
* Open `server.js` and replace `your_tiktok_username` with your actual TikTok handle.
* Start the server:
```bash
node server.js
# or with nodemon for auto-reload:
nodemon server.js
```

### 3. Set Up & Run the Frontend Client
Open a new terminal tab:
```bash
cd Client
npm install
npm run dev
```
*(Your frontend app will run locally at `http://localhost:5173`)*

---

## 🎥 Going Live on TikTok

1. Open **TikTok LIVE Studio** on your computer.
2. Add a **Window Capture** source pointing to your browser running `http://localhost:5173`.
3. Add your **Video Capture Device** (webcam) so your audience can see you.
4. Set up your overlay banner (e.g., *"🎁 1 Gift = 1 Dance Move!"*).
5. Start your backend and frontend servers, ensure your TikTok stream is live, and watch your stage react to live gifts in real time!

---

## 📄 License
This project is open-source and available for personal and educational use.
