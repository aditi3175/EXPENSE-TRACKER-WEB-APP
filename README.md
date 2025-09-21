# 💰 Expense Tracker Web App

A full-stack web application designed to help users efficiently track and manage their personal finances. Built with React, Node.js, and MongoDB, this app allows users to log expenses, categorize them, and visualize spending patterns.


## 🚀 Features

- **User Authentication:** Secure login and registration system.
- **Expense Management:** Add, edit, and delete expenses.
- **Categories:** Organize expenses into customizable categories.
- **Analytics Dashboard:** Visual representation of spending trends.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## 🛠️ Technologies Used

- **Frontend:** React, Vite, Tailwindcss
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **UI Framework:** Material-UI

## 🔧 Installation

### Clone the repository

```bash
git clone https://github.com/aditi3175/EXPENSE-TRACKER-WEB-APP.git
cd EXPENSE-TRACKER-WEB-APP

## Backend
cd expenseTrackerBackend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm start

## Frontend Setup
cd ../expenseTracker
npm install
npm run dev
