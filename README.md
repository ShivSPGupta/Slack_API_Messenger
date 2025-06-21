# Slack Message Manager 🔧

A lightweight Node.js + React app to manage Slack messages via the Slack Web API.  
You can **send**, **schedule**, **retrieve**, **edit**, and **delete** messages in any Slack channel your bot is authorized to access.

---

## 🚀 Features

- ✅ Send a message to a Slack channel
- 🕒 Schedule a message to be sent at a specific date/time
- 🔍 Retrieve a message by ID (`ts`) or get the latest
- ✏️ Edit a previously sent message
- 🗑️ Delete a message using its timestamp

---

## 🛠 Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js (Express) + Slack Web API

---

## 🧰 Setup

### 1. Clone the repo
```bash
git clone https://github.com/ShivSPGupta/Slack_API_Messenger.git
cd Slack_API_Messenger
```
2. Install backend dependencies

cd backend
npm install

3. Install frontend dependencies

cd ../frontend
npm install

4. Configure Slack App

    Go to Slack API

    Create an app and enable OAuth & Permissions

    Add these scopes:

        chat:write

        chat:write.public

        channels:history

        channels:read

        channels:join

    Install the app to your workspace

    Get the Bot User OAuth Token

5. Set environment variables

In backend/index.js (or wherever your server is), update:

const slackToken = "xoxb-your-slack-bot-token";
const channel = "CXXXXXXXX"; // Slack channel ID

6. Start both apps

Backend

cd backend
npm start

Frontend

cd frontend
npm run dev

🌐 API Endpoints (Backend)
Endpoint	Method	Description
/send	POST	Send a message to Slack
/schedule	POST	Schedule a message for future delivery
/retrieveById	POST	Retrieve a message by ts (or latest)
/edit	POST	Edit a previously sent message
/delete	DELETE	Delete a message using its ts

✅ Example Request (Retrieve)

POST /retrieveById
{
  "ts": "1750676234.926209"
}

If ts is empty or missing, it returns the latest message.

📌 License

MIT License © 2025 Shiv Shankar

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
