# Velvet Clean — Mini Laundry Order Management System

👉 https://velvet-clean.onrender.com


# 📌 Overview

**Velvet Clean** is a lightweight Laundry Order Management System designed to simplify daily dry-cleaning operations.
It allows store owners to manage orders, track statuses, calculate billing, and view business insights through an intuitive interface.

# ⚙️ Setup Instructions

## 🔧 Prerequisites

* Node.js installed
* MongoDB (local or MongoDB Atlas)

## 🚀 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/tithiii1903-prog/Velvet-clean-
cd Velvet Clean 
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/laundryDB
PORT=5000
```

### 4. Start Backend Server

```bash
node server.js
```

### 5. Start Frontend (if separate)

```bash
npm run dev
```

---

# 🚀 Features Implemented

## 🧾 Order Management

* Create new orders
* Add multiple garments with quantity and price
* Automatic total bill calculation
* Modify price and quantity dynamically

## 🔄 Order Status Management

* Status tracking:

  * RECEIVED
  * PROCESSING
  * READY
  * DELIVERED
* Ability to update status in real-time

## 📋 Order Viewing & Filtering

* View all orders
* Manage and update orders easily

## 📊 Dashboard

* Total Orders
* Total Revenue
* Order tracking insights

## 🕒 Order History

* Completed orders are moved to history
* Orders visible after **24 hours of completion**

---

# 🤖 AI Usage Report

## 🔧 Tools Used

* ChatGPT → Prompting, debugging, deployment help
* Antigravity AI Agent → Full-stack development (frontend + backend + integration)

---

## 💬 Sample Prompts Used

* “Build a full-stack laundry management system using Node.js, React, MongoDB”
* “Fix MongoDB connection errors in Express app”

- “Improve UI with  cabernet and milk color theme”  

* “Add order status update functionality”
* “Deploy full-stack app on Render”

---

## ❌ What AI Got Wrong

* Did not implement authentication system (login/logout)
* Generated multiple small bugs that required manual fixing
* Created a very basic and unappealing UI
* Did not assign unique customer IDs
* Some backend logic required corrections

---

## ✅ Improvements Made

* Implemented authentication logic (basic improvements)
* Redesigned frontend with a more aesthetic pastel theme
* Fixed multiple bugs in both frontend and backend
* Improved database structure and handling
* Enhanced overall UI/UX
* Handled deployment issues and configurations
* Added logic for order history after 24 hours

---

# ⚖️ Tradeoffs

* Focused on functionality and speed over advanced architecture
* Avoided unnecessary abstractions to keep the system simple
* Skipped overly complex UI animations or heavy frameworks

---

# 🔮 Future Improvements

If given more time, I would:

* Add **customer registration system**
* Create a **customer dashboard**
* Allow customers to:

  * Create their own orders
  * Track their order status
* Improve scalability and add role-based access

---

# 🎯 Final Note

This project focuses on **practical execution, effective AI usage, and problem-solving** rather than over-engineering.
The system is fully functional, deployed, and meets all core requirements.

---
