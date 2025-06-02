# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

🎮 Gaming Tournament Management System
This is a React-based web application that allows users to browse and register for gaming tournaments, and provides admin functionality to create and manage tournaments. The app uses Firebase Authentication and Cloud Firestore as the backend.

🚀 Features
User registration and login using Firebase Authentication

Admin dashboard for creating/editing tournaments

Tournament listing with real-time updates

Tournament registration for users

Registration history and tournament availability tracking

Interactive map displaying tournament locations

Client-side search and filtering by title, date, location

🧑‍💻 User Credentials
Use the following credentials to test the app as a normal user:

Email: user@gmail.com
Password: 1234567

🛠️ Admin Credentials
Use the following credentials to access the admin dashboard and manage tournaments:

Email: admin@gmail.com
Password: 1234567
⚠️ You must be logged in with the admin credentials to create or edit tournaments.

📦 Installation Instructions
Clone the repository or extract the ZIP file
Navigate into the project folder:

cd gaming-tournament
Install dependencies
Make sure you have Node.js installed. Then run:

npm install
Run the app locally

npm start
Access the app
Open your browser and go to:

http://localhost:3000
🔐 Firebase Configuration
Firebase is already set up. The configuration is stored in src/firebase.js.

🗺️ Notes
Tournament creation requires specifying a location (city name). This is converted to coordinates for map display.

The map uses OpenStreetMap via Leaflet.js.

Firestore security rules restrict write access to the admin user only.

📁 Folder Structure Overview

src/
├── components/           # React UI components
├── contexts/             # Auth and tournament context providers
├── pages/                # Page components (Dashboard, Admin, Login)
├── firebase.js           # Firebase config and exports
├── App.js                # Main app and routes
├── index.js              # React entry point
