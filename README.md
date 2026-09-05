# 📸 Image-Gallery (Booking App)

A modern, full-stack web application for discovering, listing, and reserving unique shoot locations and image packages. Built with **React 18**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Website Navigation Guide](#-website-navigation-guide)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

**Image-Gallery** provides a seamless marketplace experience where creators and photographers can:
1. Explore curated shoot locations with photos and pricing details.
2. Reserve image packages with date selection and instant cost calculation.
3. Host and manage custom place listings with multi-photo uploads (via direct upload or image URL).
4. Enjoy a fully responsive interface tailored for mobile screens, tablets, desktops, up to 4K displays.

---

## ✨ Key Features

- **User Authentication**:
  - Secure registration and sign-in powered by JWT cookies and bcrypt hashing.
  - Real-time password validation & strength meter (Weak / Medium / Strong checklist).
  - Form validation with clear server error feedback and a functional **Reset** button.

- **Place Listings Management**:
  - Add, edit, and delete place listings.
  - Upload photos directly or import images via web URL.
  - Cover photo selection star indicator.

- **Booking Engine**:
  - Real-time price calculation based on the number of requested images.
  - Date picker with past-date prevention.
  - User reservations dashboard with booking management and instant cancellation.

- **Fully Responsive UI**:
  - Seamless layout scaling across Mobile, iPad / Tablet, Desktop, 2K Ultrawide, and 4K displays.
  - Flexbox `min-w-0` text truncation to prevent text overflowing or clipping.
  - Sticky glassmorphism header navigation bar.

---

## 🛠 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, JWT (`cookie-parser`), Multer, image-downloader |
| **Database** | MongoDB, Mongoose ORM |
| **Styling & Icons** | Heroicons (SVG), Custom CSS, Glassmorphism |

---

## 📁 Project Architecture

```
BookingApp/
├── client/                      # React Frontend Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── AccountNav.jsx   # Account navigation tabs
│   │   │   ├── BookingWidget.jsx# Place booking form widget
│   │   │   ├── Header.jsx       # Main navigation header
│   │   │   ├── InputField.jsx   # Validated input component
│   │   │   ├── PhotoUploader.jsx# Photo upload & URL manager
│   │   │   └── Toast.jsx        # Notification system
│   │   ├── Pages/               # Route Pages
│   │   │   ├── BookingsPage.jsx # Active reservations page
│   │   │   ├── IndexPage.jsx    # Home marketplace page
│   │   │   ├── InnerPlacePage.jsx# Single place details & gallery
│   │   │   ├── Layout.jsx       # Root layout wrapper
│   │   │   ├── LoginPage.jsx    # Authentication sign-in
│   │   │   ├── PlaceFormPage.jsx# Create/Edit place form
│   │   │   ├── PlacesPage.jsx   # User listings manager
│   │   │   ├── ProfilePage.jsx  # Account profile & sign-out
│   │   │   └── RegisterPage.jsx # User sign-up
│   │   ├── App.jsx              # Main routes configuration
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind & global styles
│   ├── package.json
│   ├── tailwind.config.js       # Responsive 4K breakpoints
│   └── vite.config.js
│
├── server/                      # Node.js / Express Backend
│   ├── db/                      # Database connection setup
│   ├── models/                  # Mongoose Schemas (User, Place, Booking)
│   ├── uploads/                 # Storage for uploaded images
│   ├── .env                     # Server environment variables
│   ├── index.js                 # Express server endpoints & logic
│   └── package.json
│
└── README.md                    # Project Documentation
```

---

## ⚡ Prerequisites

Ensure you have the following tools installed on your local system before starting:

- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (included with Node.js)
- **MongoDB Community Server**: Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI ([Download MongoDB](https://www.mongodb.com/try/download/community))

---

## ⚙️ Environment Configuration

Navigate to the `server/` directory and ensure the `.env` file exists with your MongoDB connection string:

### `server/.env`
```env
Mongoose_Connection=mongodb://127.0.0.1:27017/bookingApp
```

---

## 🚀 Installation & Setup

### 1. Clone or Open the Repository
```bash
git clone <repository-url>
cd BookingApp
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

---

## 🏃 Running the Application

To run the application locally, you will start the Express backend server and the Vite development frontend client.

### Step 1: Start the Backend Server
Open a terminal in the `server` directory and run:
```bash
cd server
npx nodemon index.js
```
*The server will start on `http://localhost:8000` and connect to MongoDB.*

### Step 2: Start the Frontend Client
Open a second terminal in the `client` directory and run:
```bash
cd client
npm run dev
```
*Vite will start the client web application (typically on `http://localhost:5173`). Open `http://localhost:5173` in your web browser.*

---

## 🧭 Website Navigation Guide

Follow these steps to navigate through all features of the web application:

```
                          ┌───────────────────────────┐
                          │    Home Page (Index)      │
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
│   Browse Places    │       │ Account / Auth Icon│       │ Place Details Page │
└──────────┬─────────┘       └──────────┬─────────┘       └──────────┬─────────┘
           │                            │                            │
           ▼                            ▼                            ▼
┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
│  View Photo Grid   │       │  Register & Login  │       │ Create Booking Widget│
└────────────────────┘       └──────────┬─────────┘       └────────────────────┘
                                        │
                                        ▼
                             ┌────────────────────┐
                             │ Account Dashboard  │
                             └──────────┬─────────┘
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
┌────────────────────┐                                    ┌────────────────────┐
│  My Bookings Page  │                                    │   My Places Page   │
│  (View & Cancel)   │                                    │ (Add, Edit, Delete)│
└────────────────────┘                                    └────────────────────┘
```

### 1. Home Page (`/`)
- View featured location cards in a responsive grid layout.
- Use the sticky header to navigate or search destinations.
- Click on any location card to open its dedicated details page.

### 2. User Account Icon & Authentication (`/login`, `/register`)
- Click the **User Icon Badge** in the top-right header corner.
- **Register (`/register`)**: Create a new account. Includes real-time password strength validation rules (8+ chars, uppercase, lowercase, numbers, special characters).
- **Login (`/login`)**: Sign into an existing account. Features error detection, server error alerts, and a **Reset** button to quickly clear form fields.

### 3. Account Dashboard & Profile (`/account`)
- Once logged in, click the User Icon to visit your profile.
- Navigation pill tabs allow switching between **My Profile**, **My Bookings**, and **My Places**.
- Click **Sign out** at any time to log out.

### 4. Managing Places (`/account/places`)
- **Add New Place (`/account/places/new`)**:
  - Fill in title, address, description, maximum image limit, and price per image.
  - Upload photos from your device or paste direct image URLs.
  - Click the **Star** icon on any photo to set it as the cover image.
- **Edit / Delete Place (`/account/places/:id`)**:
  - Modify place details or remove listings.

### 5. Reserving a Location & Viewing Bookings (`/innerPlace/:id`, `/account/bookings`)
- Select a location on the Home page.
- Use the **Booking Widget** on the right side to pick your booking date and the number of requested images.
- Confirm your booking to redirect to **My Bookings** (`/account/bookings`).
- Review reservation details or click **Cancel booking** to remove a reservation.

---

## 📡 API Endpoints Summary

### Authentication Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Authenticate user & set JWT cookie |
| `POST` | `/logout` | Clear JWT cookie & log out |
| `GET` | `/profile` | Fetch logged-in user details |

### Places Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/places` | Retrieve all listed places |
| `GET` | `/places/:id` | Retrieve single place by ID |
| `POST` | `/places` | Create a new place listing |
| `PUT` | `/places` | Update an existing place listing |
| `DELETE` | `/places/:id` | Delete a place listing |

### Photos & Upload Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/upload-by-link` | Download & store photo from image URL |
| `POST` | `/upload` | Upload photos from local filesystem |

### Bookings Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/bookings` | Get all reservations for logged-in user |
| `POST` | `/bookings` | Create a new booking reservation |
| `DELETE` | `/bookings/:id` | Delete a booking reservation |

---

## 🔧 Troubleshooting

- **MongoDB Connection Error**:
  - Make sure your MongoDB daemon is running locally (`mongod` or MongoDB service).
  - Verify that the connection URI in `server/.env` matches `mongodb://127.0.0.1:27017/bookingApp`.

- **CORS / Image Not Loading**:
  - Ensure the backend server is running on `http://localhost:8000`.
  - Static images are served from `http://localhost:8000/uploads/`.

- **Form Fields Not Resetting**:
  - Use the built-in **Reset** button on the Login/Register forms to reset inputs and error states.

---
