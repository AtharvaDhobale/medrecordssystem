🏥 Secure Digital System for Lifelong Medical Record Management

A production-ready, research-driven web application designed to securely store, access, and manage lifelong medical records.
The system enables users to upload, view, download, and delete their health documents through a secure, cloud-ready architecture, ensuring privacy, reliability, and long-term accessibility.

🔧 System Overview

This project provides a patient-centric digital health record platform.
It offers:

Secure account authentication

Encrypted medical file storage

Role-based access control

Fast and reliable retrieval of health documents

REST API integration between frontend and backend

Scalable architecture suitable for cloud deployment

The system has been implemented as part of a research study on secure digital health infrastructure.

🛠️ Technology Stack
Frontend

React.js

JavaScript / TypeScript

TailwindCSS

Axios

PostCSS / Autoprefixer

Backend

Java (Spring Boot)

Spring Web

Spring Data MongoDB

Maven

Database

MongoDB (NoSQL)

Supports encrypted storage and large file handling

Tools & Utilities

Node.js & npm

Postman (API testing)

Git & GitHub

Shell/PowerShell scripts

Docker (optional)

📁 Project Structure
/
├── backend/                 # Spring Boot server (REST APIs)
│   ├── src/
│   └── pom.xml
│
├── frontend/                # React web client
│   ├── public/
│   ├── src/
│   └── package.json
│
├── docs/                    # Architecture diagrams, research notes, screenshots
├── .gitignore
├── README.md
└── LICENSE (optional)

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/<repo>.git
cd <repo>

2️⃣ Backend Setup (Spring Boot)
cd backend
mvn clean install
mvn spring-boot:run


Backend will start on:

http://localhost:8080


Configure MongoDB and environment variables inside:

src/main/resources/application.properties

3️⃣ Frontend Setup (React)
cd frontend
npm install
npm start


Frontend runs on:

http://localhost:3000

🔗 API Testing via Postman

A complete set of REST APIs is available for:

Authentication

File upload

File retrieval

File download

File deletion

Import the Postman collection (if provided) and test against:

http://localhost:8080/api/

🔐 Security & Data Protection

All medical files are stored in encrypted format

Only authenticated users can access their documents

JWT-based authentication

Strict role-based access for users and administrators

Secure API communication between frontend and backend

This system follows modern security principles inspired by India’s Digital Personal Data Protection Act (DPDPA) 2023.

📊 Key Features

✔ Secure Login System

✔ Encrypted File Storage

✔ Upload/View/Download/Delete Operations

✔ Patient-Controlled Records

✔ Dashboard for managing documents

✔ Fast REST API responses

✔ Fully responsive user interface

✔ Cloud-ready backend and database design

🧪 Testing & Quality Assurance

API workflows tested using Postman

Frontend tested using manual/automated UI checks

Backend validated with unit/integration tests

MongoDB optimized using indexing and document-level encryption

📝 Research & Academic Background

This application was developed as part of an academic research project exploring:

Secure cloud-based medical record retention

User-owned lifelong health data management

Web-based medical data interoperability

High-security digital health architectures

The system demonstrates how modern web technologies can support digital healthcare transformation.
