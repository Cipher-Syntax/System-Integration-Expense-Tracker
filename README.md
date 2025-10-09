# 💸 Expense Tracker with Notifications

## 📘 Overview
The **Expense Tracker with Notifications** is a full-stack web application designed to help users monitor and manage their daily expenses, set budget limits, and receive alerts when spending exceeds those limits.  
It’s built using **Django REST Framework** for the backend and **React** for the frontend, with optional **Twilio** and **EmailJS** integrations for notifications.

---

## 🧩 Problem Statement
Students and freelancers often lose track of their daily expenses, leading to poor budgeting and overspending. Traditional methods like notebooks or spreadsheets are inconvenient and time-consuming.  
This system simplifies the process by providing:
- Real-time expense tracking  
- Category-based analysis  
- Budget alerts via email/SMS  
- Visual insights for smarter financial decisions

---

## 🎯 Objectives

### General Objective
To provide a user-friendly digital platform that helps users track, manage, and analyze their personal finances.

### Specific Objectives
1. Allow users to record and categorize daily income and expenses.  
2. Generate visual reports and charts for spending insights.  
3. Set and monitor budget limits with real-time alerts.  
4. Notify users via SMS or email when spending exceeds limits.

---

## 🧭 Scope and Limitations

### Scope
- Register, log in, and manage personal expenses/incomes.  
- Categorize expenses (Food, Transport, Utilities, etc.).  
- Define budget limits with automated notifications.  
- Generate visual analytics (charts and graphs).  
- Accessible via any modern web browser.

### Limitations
- Designed for individual use (no group/shared budgets).  
- No direct integration with bank accounts or e-wallets.  
- Notifications supported only via SMS or email.

---

## 👥 Target Users / Beneficiaries
- **Primary Users:** Students and freelancers managing personal budgets.  
- **Beneficiaries:** Individuals seeking better financial discipline through easy-to-use expense tracking tools.

---

## ⚙️ Technologies and Tools

### Backend
- **Django REST Framework** – API backend and business logic  
- **PostgreSQL/MySQL** – Relational database  
- **Celery + Redis** – Background task queue (for notifications)
- **SimpleJWT** – Secure authentication with tokens  

### Frontend
- **React** – Interactive user interface  
- **Chart.js** – Visual reports and analytics  
- **Tailwind CSS** – Responsive and modern UI styling  

### Integrations
- **EmailJS** – Sends budget alert emails  
- **Twilio API** – (Optional) Sends SMS notifications  

### Development Tools
- **VS Code** – IDE  
- **Git & GitHub** – Version control  
- **Postman / Thunder Client** – API testing  

---

## 🧠 System Architecture

**Frontend (React)** ↔ **Backend (Django REST API)** ↔ **Database (PostgreSQL)**  
---

## 🗂️ Backend Overview (Django)

### Models
- **User** – Authentication and ownership of data  
- **Category** – Expense classification  
- **Expense** – Transaction records (income/expense)  
- **Budget** – Budget limits and time range  
- **NotificationLog** – Record of alerts sent  


## 🖥️ Frontend Overview (React)

### Pages
- `Login` / `Register` – Authentication  
- `Dashboard` – Overview with charts and totals  
- `Expenses` – View/add/edit/delete records  
- `Budgets` – Define and track spending limits  
- `Reports` – Visual and tabular summaries  
- `Settings` – Manage notification preferences  

### Core Components
- `ExpenseFormModal`, `ExpenseListItem`  
- `BudgetCard`, `MonthlyChart`, `CategoryPieChart`  
- `ProtectedRoute`, `Navbar`, `Toast`  


---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Cipher-Syntax/System-Integration-Expense-Tracker.git
