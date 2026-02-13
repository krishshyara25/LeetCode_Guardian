<p align="center">
  <img src="https://img.shields.io/badge/LeetCode-Streak%20Guardian-orange?style=for-the-badge&logo=leetcode" />
</p>

<h1 align="center">🚀 LeetCode Streak Guardian Bot</h1>

<p align="center">
A multi-user Telegram bot that helps groups stay consistent with their LeetCode practice.
</p>

---

## 🏷️ Tech Stack Badges

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Telegram-Bot-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white"/>
  <img src="https://img.shields.io/badge/Render-Deployment-46E3B7?style=for-the-badge&logo=render&logoColor=black"/>
</p>

---

## 🎯 Features

- ✅ Multi-user registration
- ✅ LeetCode username validation
- ✅ Daily submission tracking (5:30 AM IST reset)
- ✅ Scheduled cron reminders
- ✅ Group warning messages
- ✅ Interactive menu with buttons
- ✅ `/status`, `/leaderboard`, `/list`, `/unregister`
- ✅ Motivation mode
- ✅ MongoDB persistence
- ✅ Cloud deployment ready

---

## 🧠 How It Works

1. Users register their LeetCode username.
2. The bot validates the username using LeetCode GraphQL API.
3. Scheduled cron jobs check daily submissions.
4. If no submission is found after reset time, users are warned.
5. A leaderboard is generated dynamically.
6. Motivation messages keep users consistent.

---

## 🏗️ Architecture Diagram
              ┌────────────────────┐
              │   Telegram Group   │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │  Telegram Bot API  │
              └─────────┬──────────┘
                        │
                        ▼
            ┌────────────────────────┐
            │   Node.js Application  │
            │  (Express + node-cron) │
            └─────────┬──────────────┘
                      │
      ┌───────────────┼───────────────┐
      ▼                               ▼
    ┌────────────────────┐ ┌──────────────────────┐
    │ MongoDB Atlas      │ │ LeetCode GraphQL API │
    │ (User Persistence) │ │ (Submission Data)    │
    └────────────────────┘ └──────────────────────┘

    
---

## 📁 Project Structure

    src/
    ├── bot.js
    ├── scheduler.js
    ├── leetcode.js
    ├── timeUtils.js
    ├── models/
    │ └── User.js
    └── config/
    └── db.js


---

## ⚙️ Environment Variables

    Create a `.env` file in the root directory:
    
    TELEGRAM_BOT_TOKEN=your_bot_token
    MONGO_URI=your_mongodb_connection_string
    GROUP_CHAT_ID=your_group_chat_id
    NODE_ENV=production

---

## 🛠️ Installation (Local Development)

```bash
git clone https://github.com/yourusername/leetcode-streak-bot.git
cd leetcode-streak-bot
npm install


Create .env file and then:

npm start


or

nodemon src/index.js
```
## ☁️ Deployment (Render)
```

Push project to GitHub.

Create new Web Service on Render.

Set:

Build Command: npm install

Start Command: node src/index.js

Add environment variables.

Deploy.

Use UptimeRobot (free) to prevent free-tier sleeping.
```
## 🔥 Future Enhancements
```

Weekly performance reports

Admin-only controls

Multi-platform support (Codeforces, AtCoder)

Streak analytics dashboard

Difficulty-based tracking

Inline keyboard UX

Webhook-based production setup
```
## 🧩 Motivation Behind This Project
```

Consistency is the key to mastering Data Structures & Algorithms.
This bot helps build accountability in groups and prevents streak loss due to forgetfulness.

```
