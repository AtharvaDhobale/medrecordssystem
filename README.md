# 🏥 MedRecords — Secure Digital System for Lifelong Medical Record Management

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_App-blue?style=for-the-badge)](https://fearless-dedication-production-ef3f.up.railway.app/)
[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-GridFS-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A production-ready, full-stack web application architected to securely store, access, and manage lifelong medical records. Engineered with a scalable microservices-inspired approach, this system leverages **Spring Boot**, **React.js**, and **MongoDB GridFS** to deliver a secure, high-performance digital health infrastructure.

## 🚀 Project Overview

The healthcare industry requires robust data interoperability and stringent security measures. **MedRecords** was developed to solve the fragmentation of patient health data by providing a centralized, patient-centric vault. The platform ensures data privacy, reliable document retrieval, and long-term accessibility, complying with modern data protection standards.

As the **Project Lead**, I spearheaded the full software development lifecycle (SDLC)—from system design and RESTful API architecture to front-end integration and cloud deployment. 

## 🛠️ Technology Stack & Architecture

- **Backend Architecture:** Java, Spring Boot, Spring Web, Spring Security, Maven
- **Frontend Ecosystem:** React.js, JavaScript (ES6+), React Router, Tailwind CSS, Axios
- **Database & Storage:** MongoDB (NoSQL), MongoDB GridFS (for large file/document storage)
- **Security & Authentication:** JWT (JSON Web Tokens), BCrypt Password Hashing, Role-Based Access Control (RBAC)
- **Cloud & DevOps:** Git/GitHub, Railway (Backend hosting), Continuous Deployment (CI/CD)

## ✨ Technical Achievements & Key Features

- **Secure Authentication System:** Implemented stateless authentication using JWT and Spring Security, ensuring strictly controlled access to patient profiles.
- **Advanced Document Management:** Architected a robust file upload/download pipeline utilizing MongoDB GridFS to efficiently store and retrieve PDFs, images, and medical reports.
- **Responsive User Interface (UI):** Designed a dynamic Single Page Application (SPA) with React and Tailwind CSS, featuring real-time dashboard analytics and instant file filtering.
- **RESTful API Development:** Built highly scalable, decoupled REST API endpoints facilitating seamless JSON communication between the Java backend and React client.
- **Data Protection & Privacy:** Enforced document-level security rules inspired by the Digital Personal Data Protection (DPDP) Act, ensuring users only access their authorized health data.

## 👥 Project Team

- **Project Lead:** Atharva Dhobale
- **Team Members:** Harshika Rawat, Prathmesh Barse
- **Mentor:** Dr. Jagannath Nalavade

*This application was developed as part of a research-driven academic project exploring secure cloud-based medical record retention and web-based medical data interoperability.*

## ⚙️ Local Installation & Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Local or Cloud MongoDB Instance (`mongodb://localhost:27017`)

### 1. Backend Setup (Spring Boot)
```bash
cd medrecords
./mvnw clean install
./mvnw spring-boot:run
```
*The backend API will initialize on `http://localhost:8080`*

### 2. Frontend Setup (React.js)
```bash
cd medrecords-frontend
npm install
npm start
```
*The frontend SPA will initialize on `http://localhost:3000`*

*(Ensure you create a `.env` file in the frontend directory with `REACT_APP_API_URL=http://localhost:8080`)*

## 🔐 Security Standards

- **Encryption at Rest & Transit:** All passwords hashed via BCrypt; API calls secured.
- **Session Management:** Secure token storage via client-side local storage with strict expiration logic.
- **CORS Configuration:** Backend strictly configured to accept cross-origin requests only from authorized frontend domains.

## 📬 Contact / Author

**Atharva Dhobale** (Project Lead)  
[GitHub Profile](https://github.com/AtharvaDhobale)

---
*Built with passion for transforming digital healthcare.*
