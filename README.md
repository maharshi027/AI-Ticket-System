# 🎫 AI Ticket Management System

An **AI-powered Ticket Management System** designed to automatically receive, analyze, prioritize, and route tickets based on job roles, skills, urgency, and content. This system reduces manual effort, improves response time, and ensures the right ticket reaches the right team or individual.

---

## 🚀 Features

- 🤖 **AI-Based Ticket Triage** – Automatically classifies and prioritizes tickets
- 🧠 **Skill & Role Matching** – Assigns tickets based on job role and skill requirements
- ⏱ **Priority Detection** – Identifies urgent, high-impact issues
- 📄 **Structured JSON Responses** – Clean AI output for backend processing
- 🔐 **Authentication & Authorization** – Secure access using JWT
- 📊 **Ticket Status Tracking** – Open, In Progress, Resolved, Closed
- 📨 **Automated Responses** – AI-generated acknowledgements and updates
- 🌐 **RESTful API Architecture**

---

## 🛠 Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- MongoDB (Mongoose)

### AI / Automation

- AI Prompt-based Ticket Triage Agent
- JSON-only AI Responses

---

## 📁 Project Structure

```
AI-Ticket-System/
├── backend/             # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── inngest/         # Inngest task automation
│   ├── utils/           # AI & Mailer utilities
│   ├── package.json
│   └── index.js
├── frontend/            # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/maharshi027/ai-ticket-system.git
cd ai-ticket-system
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb_connection_string
JWT_SECRET=your_secret_key
SENDGRID_API_KEY=your_sendgrid_key
INNGEST_EVENT_KEY=your_inngest_key
```

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm run dev
```

To run Inngest dev server (in another terminal):

```bash
npm run inngest-dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## 🧠 AI Ticket Triage Logic

The AI agent analyzes:

- Ticket description
- Required skills
- Job role
- Urgency keywords
- Historical patterns

### Sample AI Response (Strict JSON)

```json
{
  "priority": "High",
  "category": "Backend",
  "requiredSkills": ["Node.js", "MongoDB"],
  "assignedRole": "Backend Developer",
  "estimatedResolutionTime": "4 hours"
}
```

---

## 🔐 Authentication Flow

- User login generates JWT
- Token passed via Authorization Header
- Middleware validates token

```http
Authorization: Bearer <token>
```

---

## 📌 API Endpoints

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| POST   | /api/auth/login  | User login      |
| POST   | /api/tickets     | Create ticket   |
| GET    | /api/tickets     | Get all tickets |
| PUT    | /api/tickets/:id | Update ticket   |
| DELETE | /api/tickets/:id | Delete ticket   |

---

## 📈 Future Enhancements

- SLA breach prediction
- Email & Slack notifications
- AI sentiment analysis
- Admin dashboard with analytics
- Multi-language ticket support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Harshit**

- GitHub: [https://github.com/maharshi027](https://github.com/maharshi027)
- Email: [harshit.2327cseai120@kiet.edu](mailto:harshit.2327cseai120@kiet.edu)

---

⭐ If you like this project, don’t forget to star the repository!
