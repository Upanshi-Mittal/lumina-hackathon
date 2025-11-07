# 🚀 Hackmate — Smart Hackathon Team Builder

Hackmate is an intelligent platform that helps students:
- ✅ Log in using their JIIT credentials
- ✅ Complete their technical profile
- ✅ Analyze their GitHub presence
- ✅ Receive skill-based team suggestions
- ✅ Manage team assignments & submissions

This project uses **FastAPI + MongoDB** for the backend and **React (Vite) + Tailwind** for the frontend.

---

## 🧠 **Tech Stack**

### **Frontend**
- React (Vite)
- TailwindCSS
- ShadCN UI components
- Framer Motion animations
- React Router

### **Backend**
- FastAPI
- Beanie ODM (MongoDB)
- Motor (async MongoDB driver)
- Python 3.11
- Pydantic models

### **Database**
- MongoDB Atlas

---


---

## ⚙️ **Backend Setup**

### ✅ Step 1 — Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```
## Run backend

```bash
cd HACKMATE
uvicorn backend.main:app --reload
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔥 Key Features

## ✅ 1. JIIT Login Integration
Students can log in using:
Enrollment number
Webkiosk password


## ✅ 2. User Details Form
Students fill:
Email
Phone number
GitHub
LinkedIn
Skills
Portfolio
Stored in MongoDB using Beanie.


## ✅ 3. Smart Dashboard
Displays:
User info
Quick links
GitHub analysis
Team assignment
Logout


## ✅ 4. GitHub Analysis (AI-based)
Repository score
Contribution heatmap
Tech stack detection


## ✅ 5. Team Assignment
Uses skill weighting
Compatibility scoring
AI-based team creation


