Client Lead Management System (Mini CRM)

A full-stack CRM application for managing client leads — built as a structured internship project. It supports authenticated admin access, full lead CRUD, dashboard analytics, and a public-facing contact form for capturing new leads.

✨ Features
🔐 Authentication — JWT-based login/register with bcrypt password hashing
📋 Lead Management — Create, view, update, and delete leads
📊 Dashboard — Search, filter, and stats overview of all leads
🔍 Lead Details — Dedicated view for individual lead information
🌐 Public Contact Form — Lets external visitors submit lead inquiries without logging in
🎨 Clean UI — Light cream and teal design system
🛠️ Tech Stack

Frontend

React (Vite)
TypeScript
Tailwind CSS
React Router
Context API (AuthContext)

Backend

Node.js + Express
MongoDB + Mongoose
JWT (authentication)
bcrypt (password hashing)

Deployment

Render (backend + frontend)
📁 Project Structure
mini-crm/
├── client/                 # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Dashboard, LeadDetails, ContactForm, etc.
│   │   ├── services/        # API calls
│   │   └── App.tsx
│   └── package.json
├── server/                  # Express backend
│   ├── models/               # Mongoose schemas (Lead, User)
│   ├── routes/                # Auth routes, Lead routes
│   ├── middleware/            # JWT auth middleware
│   ├── controllers/
│   └── server.js
├── .env.example
└── README.md
🚀 Getting Started
Prerequisites
Node.js (v18+)
MongoDB Atlas account (or local MongoDB instance)
Installation
Clone the repository
bash
   git clone <repo-url>
   cd mini-crm
Install backend dependencies
bash
   cd server
   npm install
Install frontend dependencies
bash
   cd ../client
   npm install
Set up environment variables Create a .env file in the server/ directory:
env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

Create a .env file in the client/ directory:

env
   VITE_API_BASE_URL=http://localhost:5000/api
Running Locally

Backend

bash
cd server
npm run dev

Frontend

bash
cd client
npm run dev

The app will be available at http://localhost:5173 (frontend) with the API running on http://localhost:5000.

🔑 API Overview
Method	Endpoint	Description	Auth Required
POST	/api/auth/register	Register a new admin user	No
POST	/api/auth/login	Login and receive JWT	No
GET	/api/leads	Get all leads	Yes
POST	/api/leads	Create a new lead	Yes
GET	/api/leads/:id	Get a single lead	Yes
PUT	/api/leads/:id	Update a lead	Yes
DELETE	/api/leads/:id	Delete a lead	Yes
POST	/api/leads/contact	Public lead submission form	No
🌍 Deployment

This project is deployed on Render:

Backend: Node/Express web service with environment variables configured in the Render dashboard
Frontend: Static site pointing to the deployed backend API URL

Note: Ensure .env is excluded from version control (.gitignore) and any exposed credentials are rotated before deployment.

📌 Roadmap / Future Improvements
 Role-based access control (admin vs. staff)
 Email notifications on new lead submissions
 Export leads to CSV
 Pagination for large lead lists
👩‍💻 Author

Built by Abhishek as part of the Future Interns full-stack development internship.

📄 License

This project is for educational/portfolio purposes.
