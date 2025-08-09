# 🏥 Hospital Management System

A full-stack hospital management web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It supports role-based access for Admin, Doctor, and Customer (Patient) with secure authentication, appointment booking, and doctor approval workflows.

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - OTP-based signup
  - Role-based login (Admin, Doctor, Customer)
  - JWT token security

- 🩺 **Doctor Module**
  - Signup with specialization, experience, and fee
  - Appointment management

- 👨‍⚕️ **Admin Panel**
  - Create New Appointment 
  - View all booked, completed, cancelled, expired appointments with doctor and customer(patient) details

- 📅 **Appointment System**
  - Book, cancel, complete appointments
  - Filter by status (booked, completed, cancelled, expired)

- 📊 **Dashboard**
  - Role-based dashboard views
  - Appointment tabs and summaries
  - Appointment creation panel


## Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Frontend     | React.js, Axios, React Router |
| Backend      | Node.js, Express.js |
| Database     | MongoDB, Mongoose |
| Auth         | JWT, bcrypt, OTP |
| Styling      | CSS, Bootstrap, React Icons |


## 📂 Folder Structure (Simplified)

hospital-frontend/ ├── src/ │ ├── pages/ │ ├── components/ │ ├── services/ │ └── App.js

hospital-backend/ ├── controllers/ ├── models/ ├── routes/ ├── server.js


---

## Setup Instructions

### Backend Setup

cd hospital
npm install

Create a .env file:
DATABASE_URL=
PORT=3000
CLOUD_NAME=
API_KEY=
API_SECRET=

MAIL_HOST=
MAIL_USER=
MAIL_PASS=

RAZORPAY_KEY=
RAZORPAY_SECRET=

JWT_SECRET=
NODE_ENV=
FOLDER_NAME = 

Start Backend:
npm run dev

Frontend Setup:
cd hospitalFront
npm install
npm run dev


