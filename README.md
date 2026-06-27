# MedRecords — Personal Health Records System

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_App-blue?style=for-the-badge)](https://fearless-dedication-production-ef3f.up.railway.app/)

A full-stack web application that lets patients securely store, manage, and access their medical records from anywhere. Built with Spring Boot, React, and MongoDB.

## Overview

I built this as a personal project to practice building secure, real-world applications. The idea came from the frustration of having medical documents scattered across different hospitals and clinics — this system gives patients a single place to keep everything organized.

The backend uses JWT authentication so each patient only sees their own records. Files (PDFs, images, reports) are stored in MongoDB GridFS so everything lives in one database.

## Features

- **Patient registration and login** with BCrypt-hashed passwords and JWT tokens
- **Upload medical documents** — PDFs, images, and reports stored in MongoDB GridFS
- **Health Passport** — a quick-glance card with blood group, allergies, and emergency contact
- **Record filtering** — search and filter by file type across all uploaded documents
- **Dashboard overview** — see total records, files uploaded, and profile completion at a glance
- **Secure sessions** — JWT-based auth, tokens stored in localStorage

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 3.5, Spring Security, JWT (JJWT) |
| Database | MongoDB + GridFS (file storage) |
| Frontend | React 18, React Router, Tailwind CSS |
| Auth | BCrypt + JWT tokens |
| Deployment | Railway (backend), Vercel (frontend) |

## Project Structure

```
medrecordssystem/
├── medrecords/                  # Spring Boot backend
│   ├── src/main/java/com/example/medrecords/
│   │   ├── config/              # MongoDB, Security config
│   │   ├── controller/          # REST endpoints
│   │   ├── filter/              # JWT auth filter
│   │   ├── model/               # Patient, Record entities
│   │   ├── repository/          # MongoDB repositories
│   │   ├── service/             # Audit logging, user details
│   │   └── util/                # JWT utility
│   └── src/main/resources/
│       └── application.properties
└── medrecords-frontend/         # React frontend
    └── src/
        ├── components/          # LoginPage, Register, Dashboard, ProfileSetup
        ├── api.js               # All API calls
        └── App.js               # Routes
```

## Installation

### Prerequisites

- Java 17+
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### Backend

```bash
cd medrecords
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`

### Frontend

```bash
cd medrecords-frontend
npm install
npm start
```

Frontend starts at `http://localhost:3000`

## Environment Variables

Create a `.env` file in `medrecords-frontend/` for the frontend:

```
REACT_APP_API_URL=http://localhost:8080
```

The Spring Boot backend reads these from environment variables (with defaults for local dev):

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/medrecords` |
| `JWT_SECRET` | Secret key for signing JWT tokens | dev fallback (change in prod) |
| `PORT` | Server port | `8080` |

## Running Locally

1. Make sure MongoDB is running
2. Start the backend: `cd medrecords && ./mvnw spring-boot:run`
3. Start the frontend: `cd medrecords-frontend && npm start`
4. Open `http://localhost:3000`

## Railway Deployment

### Backend (Railway)

1. Push the `medrecords/` folder to a GitHub repo
2. Create a new Railway project → **Deploy from GitHub repo**
3. Set the root directory to `medrecords`
4. Add environment variables in Railway dashboard:
   - `MONGODB_URI` — your MongoDB Atlas URI
   - `JWT_SECRET` — a strong random string
5. Railway auto-detects the Maven project and builds with `./mvnw clean package`
6. Start command: `java -jar target/medrecords-0.0.1-SNAPSHOT.jar`

### Frontend (Vercel)

1. Push `medrecords-frontend/` to GitHub
2. Import on Vercel → set root directory to `medrecords-frontend`
3. Add env variable: `REACT_APP_API_URL=https://your-railway-app.up.railway.app`
4. Deploy — Vercel handles the React build automatically

## Screenshots

> Add screenshots of Login, Dashboard, and Health Passport pages here.

## Future Improvements

- Share records securely with a doctor via a time-limited link
- OCR for extracting text from uploaded prescription images
- Reminder system for follow-up appointments
- Mobile app with React Native
- Encryption at rest for all stored files

## Author

**Atharva Dhobale**  
[GitHub](https://github.com/AtharvaDhobale)
