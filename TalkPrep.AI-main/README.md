# AI Mock Interview Platform (TalkPrep.AI)

TalkPrep.AI is a premium, futuristic, and highly responsive full-stack web application designed to help job-seekers prepare for technical, HR, and system design interviews. 

It is built using **React.js, Tailwind CSS, and Framer Motion** on the frontend, and **Node.js, Express.js, and MongoDB** on the backend, featuring native AI integrations.

---

## 🌟 Core Features

* 🎙️ **Speech AI Virtual Mock Room**: Practice speaking answers aloud to synthesized voice questions. Features native real-time Web Speech Transcription (STT) and voice outputs (TTS).
* 💻 **Coding Round IDE**: Online programming editor workspace with countdown timers, code syntax themes, dynamic compiler tests console, and progressive AI logic hints.
* 📄 **ATS Resume Analyzer**: Drag-and-drop parser simulator evaluating ATS match metrics, keyword missing logs, formatting checks, and role estimates.
* 📊 **Interactive SVG Analytics**: Visualized score gauge trends, sentiment checks (speech speed, filler index), weekly activities, and custom circular badges.
* 🤖 **Floating AI Companion**: Conversational panel answering developer conceptual doubts, suggesting portfolio projects, and supplying career roadmap paths.
* 🌓 **Universal Dark/Light Theme**: Sleek, Harmonious glassmorphic color palette with responsive mobile drawer layouts.

---

## 📂 Project Directory Structure

```
project/
├── backend/                # Express.js Server
│   ├── config/             # Database connection helpers
│   ├── controllers/        # MVC Business logic
│   ├── middlewares/        # JWT guards & error filters
│   ├── models/             # Mongoose schemas (User, Question, Challenges, etc.)
│   ├── routes/             # API Router maps
│   ├── services/           # OpenAI completion handlers & fallbacks
│   └── utils/              # Database seeder scripts
└── frontend/               # React client
    ├── public/             # Static public assets
    └── src/
        ├── components/     # Reusable widgets (Navbar, Footer, Chatbot)
        ├── context/        # Global state (Theme, Toast, Auth)
        ├── pages/          # 10 pages routes
        ├── services/       # Axios API client
        ├── App.jsx         # App routes setup
        ├── index.css       # Tailwind directives & glass panels
        └── main.jsx        # App mounting entry point
```

---

## ⚡ Setup & Launch Instructions

To launch this full stack application, ensure you have **Node.js** (v18 or higher) and **MongoDB** installed on your system.

### 1. Database Seeding & Backend launch
Open a terminal in the `backend/` directory:

```bash
# 1. Install express, mongoose, jwt, bcrypt, etc.
npm install

# 2. Seed database challenges and questions
npm run seed

# 3. Launch dev server on port 5000
npm run dev
```

*Note: Ensure your MongoDB server is active locally on `mongodb://localhost:27017`.*

#### 🔑 OpenAI API Key Configuration
Create a `.env` file under the `backend/` directory (a template reference is provided in `.env.template`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-mock-interview
JWT_SECRET=super_secret_jwt_encryption_key_change_me_in_production_198273
OPENAI_API_KEY=your_actual_openai_api_key_here
```
*If you leave `OPENAI_API_KEY` blank or unconfigured, the application **automatically executes in fallback mode**, generating realistic mock responses and grades. This allows you to test the entire platform without incurring API fees!*

---

### 2. Frontend Client launch
Open a secondary terminal in the `frontend/` directory:

```bash
# 1. Install React router, Framer Motion, Tailwind, etc.
npm install

# 2. Launch Vite development client on port 5173
npm run dev
```

*Open your browser and navigate to `http://localhost:5173` to interact with the platform.*

---

## 🛠️ Verification & Building

To verify and compile production bundles, execute within the `frontend/` folder:
```bash
npm run build
```
This builds static client pages inside the `frontend/dist` directory.
