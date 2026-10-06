# Online CBT Project Documentation

This project is a full-stack Computer-Based Testing (CBT) application built for academic and assessment workflows. It allows students to register, sign in, take quizzes, and review performance, while admins can manage subjects, create question banks, track results, and invite other admins.

The system is split into two primary parts:

- Backend: Node.js + Express + MongoDB + JWT authentication
- Frontend: React + Vite + React Router + Axios

---

## 1. Project Overview

### Purpose
The platform supports the following business flows:

- Student onboarding and authentication
- Subject and exam category creation
- Question bank management
- Quiz execution for different subjects
- Result recording and score calculation
- Performance history tracking
- Admin dashboard summary and user management

### Primary Roles

#### Student
A student can:
- sign up and sign in
- browse available assessments
- take an exam by subject
- submit answers
- view past exam scores and performance reports

#### Admin
An admin can:
- sign in and access the admin dashboard
- create and manage academic subjects
- add, update, and delete exam questions
- publish or keep questions in draft mode
- review all exam submissions
- send and revoke admin invitations

### Technology Stack

#### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests
- Resend for email delivery
- dotenv for environment management

#### Frontend
- React 19
- Vite
- React Router
- Axios for API communication
- Formik + Yup for form validation
- React Toastify for notifications
- SweetAlert2 for confirmation dialogs

---

## 2. Repository Structure

```text
CBT EXAM/
├── API_INTEGRATION_GUIDE.md
├── BACKEND/
│   ├── .env
│   ├── controllers/
│   │   ├── subject.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── examResult.model.js
│   │   ├── invitation.model.js
│   │   ├── questions.model.js
│   │   ├── subject.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── student.route.js
│   │   └── subject.routes.js
│   ├── utils/
│   │   └── emailService.js
│   ├── views/
│   │   ├── adminSignin.ejs
│   │   ├── studentSignin.ejs
│   │   └── studentSignup.ejs
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── FRONTEND/
│   ├── .env.local
│   ├── .env.production
│   ├── src/
│   │   ├── admin/
│   │   ├── component/
│   │   ├── student/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.*
└── README.md (optional, not always present)
```

---

## 3. Backend Architecture

### Entry Point
The backend entry point is `BACKEND/index.js`. This file is responsible for:

- loading environment variables
- creating the Express app
- parsing request bodies
- enabling CORS for frontend communication
- registering route modules
- connecting to MongoDB
- starting the HTTP server

### Startup Flow

```js
const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/user", studentRoutes)
app.use("/subjects", subjectRoutes)

mongoose.connect(URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message)
    process.exit(1)
  })
```

This means the API is typically served from:

```text
http://localhost:2114
```

---

## 4. Backend Environment Variables

The backend relies on environment variables stored in `BACKEND/.env`.

Example:

```env
PORT=2114
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online-cbt
jwtSecretKey=yourSecretKey
FRONTEND_URL=https://onlinecbt.vercel.app
RESEND_API_KEY=your_resend_key
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=Online CBT
```

### Key Environment Variables

- `PORT`: server port for the backend
- `MONGO_URI`: MongoDB connection string
- `jwtSecretKey`: secret for JWT signing and verification
- `FRONTEND_URL`: used in invitation links and email redirects
- `RESEND_API_KEY`: email service API key
- `EMAIL_*`: email configuration used by the mail service

---

## 5. Backend Models

### 5.1 User Model (`models/user.model.js`)
This stores both student and admin records.

```js
const studentDetails = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    activeToken: { type: String, default: null }
}, { timestamps: true })
```

Fields:
- `fullName`: user’s full name
- `email`: unique identifier and login credential
- `password`: hashed password
- `role`: either `student` or `admin`
- `activeToken`: current JWT token used for active session tracking

### 5.2 Subject Model (`models/subject.model.js`)
This defines each academic subject or course category.

```js
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        unique: [true, 'Subject name must be unique'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration (in minutes) is required']
    }
}, { timestamps: true })
```

### 5.3 Question Model (`models/questions.model.js`)
Question records include the complete MCQ structure and metadata.

```js
const questionSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    adminEmail: { type: String, required: true, index: true },
    marks: { type: Number },
    score: { type: Number },
    totalQuestion: { type: Number },
    questionText: { type: String, required: true },
    options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true }
    },
    description: { type: String, required: true },
    correctAnswer: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D']
    },
    duration: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true })
```

### 5.4 Exam Result Model (`models/examResult.model.js`)
This stores a student’s completed exam record.

```js
const examResultSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    timeSpent: { type: Number },
    submittedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true })
```

### 5.5 Invitation Model (`models/invitation.model.js`)
This tracks admin signup invitations.

```js
const invitationSchema = mongoose.Schema({
    token: {
        type: String,
        unique: true,
        required: true,
        default: () => crypto.randomBytes(32).toString('hex')
    },
    invitedBy: { type: String, required: true },
    invitedEmail: { type: String, default: null },
    status: {
        type: String,
        enum: ["pending", "accepted", "expired"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800
    },
    acceptedAt: { type: Date, default: null },
    acceptedBy: { type: String, default: null }
})
```

---

## 6. Authentication and Authorization

The backend authenticates users with JSON Web Tokens (JWT) and protects private routes using middleware.

### Middleware (`middleware/auth.middleware.js`)

```js
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided. Please sign in first." });
    }

    jsonwebtoken.verify(token, process.env.jwtSecretKey, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token. Please sign in again." });
        }

        const foundUser = await student.findOne({ email: decoded.email });

        if (!foundUser || foundUser.activeToken !== token) {
            return res.status(401).json({
                message: "Session expired or you logged in from another device. Please log in again."
            });
        }

        req.user = {
            ...decoded,
            role: foundUser.role
        };
        next();
    });
};
```

### Role Protection
The project uses a second middleware called `adminOnly` to restrict admin functionality:

```js
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    next();
};
```

### Purpose of JWT in the App
A JWT is generated after successful signup or sign-in and then stored in the frontend, typically in `localStorage`.

Example token payload:

```json
{
  "id": "64f7ce2a5d3f2",
  "email": "student@example.com",
  "role": "student"
}
```

---

## 7. Backend Routes

### 7.1 User Routes (`routes/student.route.js`)
This router contains the user logic for authentication, question management, and exam results.

#### Authentication Routes
- `POST /user/signUp` — student registration
- `POST /user/signin` — student login
- `POST /user/admin/signUp` — admin registration by invitation
- `POST /user/admin/signin` — admin login
- `GET /user/dashboard` — dashboard placeholder endpoint

#### Question Routes
- `POST /user/addQuestions` — add question (admin only)
- `GET /user/getAllQuestions` — fetch questions visible to current user
- `GET /user/question/:id` — fetch a single question
- `PUT /user/question/:id` — update a question (admin only)
- `DELETE /user/question/:id` — delete a question (admin only)
- `GET /user/subject/:subject` — fetch published questions for a subject

#### Invitation Routes
- `POST /user/admin/create-invitation`
- `GET /user/admin/validate-invitation`
- `GET /user/admin/pending-invitations`
- `POST /user/admin/revoke-invitation`

#### Exam Result Routes
- `POST /user/exam/save-result`
- `GET /user/exam/student-results`
- `GET /user/exam/all-results`

#### Diagnostic Routes
- `GET /user/test-email-config`
- `POST /user/test-email-send`
- `GET /user/test-email/:email`
- `GET /user/test-db-connection`

### 7.2 Subject Routes (`routes/subject.routes.js`)

```js
router.post("/", verifyToken, adminOnly, createSubject)
router.get("/", verifyToken, getAllSubjects)
router.get("/:id", verifyToken, adminOnly, getSubjectById)
router.delete("/:id", verifyToken, adminOnly, deleteSubject)
router.put("/:id", verifyToken, adminOnly, updateSubject)
```

Endpoints:
- `POST /subjects` — create a subject
- `GET /subjects` — list all subjects
- `GET /subjects/:id` — fetch a specific subject
- `DELETE /subjects/:id` — remove a subject
- `PUT /subjects/:id` — update a subject

---

## 8. Core Backend Controllers

### 8.1 User Controller (`controllers/user.controller.js`)
This controller is the heart of the platform. It handles:

- signup and sign-in logic
- JWT issuance
- admin invitation flow
- question creation and editing
- exam result persistence
- reporting and analytics

### 8.2 Subject Controller (`controllers/subject.controller.js`)
Handles subject CRUD operations:

```js
const createSubject = (req, res) => {
    const { name, department, description, duration } = req.body

    if (!name || !department || !duration) {
        return res.status(400).json({
            message: "Name, department, and duration are required"
        })
    }

    const newSubject = new Subject({ name, department, description, duration })

    newSubject.save()
      .then((subject) => res.status(201).json({ message: "Subject created successfully", subject }))
      .catch((error) => res.status(500).json({ message: "Failed to create subject", error: error.message }))
}
```

---

## 9. Authentication Flow

### Student Signup
1. Client sends `fullName`, `email`, and `password`
2. Backend checks if the email already exists
3. Password is hashed with bcrypt
4. New user is saved to MongoDB
5. Welcome email is triggered through Resend
6. JWT is generated and returned to the client

### Student Sign-In
1. Client sends email and password
2. Backend finds the user record
3. Password is compared with bcrypt
4. If valid, JWT is generated and returned
5. `activeToken` in the user document is updated

### Admin Sign-In
1. Server checks that the user exists and `role === "admin"`
2. Password is validated
3. JWT is signed with the admin claim
4. Admin data is returned to frontend

---

## 10. Exam Result Logic

When a student completes an exam, the frontend sends a payload like this:

```json
{
  "studentEmail": "student@example.com",
  "subject": "CSC 101",
  "totalQuestions": 10,
  "correctAnswers": 8,
  "answers": { "1": "A", "2": "C" },
  "timeSpent": 300
}
```

The backend calculates the score:

```js
const score = (correctAnswers / totalQuestions) * 100
```

Then it stores the result in the `ExamResult` collection.

### Returned Exam Result Object

```json
{
  "message": "Exam result saved successfully",
  "result": {
    "id": "...",
    "studentEmail": "student@example.com",
    "subject": "CSC 101",
    "totalQuestions": 10,
    "correctAnswers": 8,
    "score": "80.00",
    "submittedAt": "..."
  }
}
```

---

## 11. Email Integration

The project includes an email service in `BACKEND/utils/emailService.js` built on Resend.

### Available email types
- welcome email
- admin invitation email
- invitation revoked email

### Example usage

```js
sendWelcomeEmail(userEmail, userName)
sendAdminInvitationEmail(email, invitationLink, adminName)
sendInvitationRevokedEmail(email, adminName)
```

This is useful for:
- onboarding users
- inviting admins to the platform
- notifying users when an invitation is no longer valid

---

## 12. Frontend Architecture

The frontend app is under `FRONTEND/src` and is organized around user roles and components.

```text
FRONTEND/src/
├── admin/
│   ├── AdminDashboard.jsx
│   ├── AdminSignin.jsx
│   ├── AdminSignup.jsx
│   ├── Sidebar.jsx
│   └── pages/
│       ├── AdminOverview.jsx
│       ├── QuestionBank.jsx
│       ├── Settings.jsx
│       ├── StudentResult.jsx
│       └── Subject.jsx
├── student/
│   ├── SigninPage.jsx
│   ├── SignupPage.jsx
│   ├── StudentDashboard.jsx
│   ├── StudentLayout.jsx
│   ├── AvailableAssessmentsPage.jsx
│   ├── PerformanceHistoryPage.jsx
│   ├── ActiveQuizView.jsx
│   ├── ExactQuestion.jsx
│   └── AssignedObject.jsx
├── component/
│   ├── LandingPage.jsx
│   ├── ProtectedRoute.jsx
│   ├── Navbar.jsx
│   └── PageNotFound.jsx
├── utils/
│   ├── api.config.js
│   ├── auth.js
│   ├── questionApi.js
│   ├── subjectApi.js
│   └── toastUtils.js
├── App.jsx
├── main.jsx
└── assets/
```

---

## 13. Frontend Routing

The app uses `react-router-dom` in `src/App.jsx`.

### Public Routes
- `/`
- `/admin/signin`
- `/admin/signup`
- `/studentSignin`
- `/createStudentAccount`
- `/forgotPassword`
- `/how-it-works`
- `/terms-and-policy`

### Student Protected Routes
- `/student`
- `/student/dashboard`
- `/student/available-assessments`
- `/student/performance-history`
- `/student/ActiveQuizView/:subject`

### Admin Routes
- `/admin`
- `/admin/subjects`
- `/admin/question-bank`
- `/admin/student-result`
- `/admin/settings`

### Protected Route Example

```jsx
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to='/studentSignin' replace />
    }

    return children
}
```

---

## 14. Frontend API Utilities

### `src/utils/api.config.js`
Defines the base backend URL.

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:2114'
export default API_BASE_URL
```

This allows the UI to run locally and change easily for production.

### `src/utils/auth.js`
Handles localStorage token storage and authentication header generation.

```js
export const setToken = (token) => {
    localStorage.setItem('token', token)
}

export const getToken = () => localStorage.getItem('token')

export const getAuthHeader = () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}
```

### `src/utils/subjectApi.js`
Wraps all subject-related API calls.

```js
export const subjectApi = {
    getAllSubjects: () => apiClient.get('/subjects'),
    getSubjectById: (id) => apiClient.get(`/subjects/${id}`),
    createSubject: (subjectData) => apiClient.post('/subjects', subjectData),
    updateSubject: (id, subjectData) => apiClient.put(`/subjects/${id}`, subjectData),
    deleteSubject: (id) => apiClient.delete(`/subjects/${id}`)
}
```

### `src/utils/questionApi.js`
Provides wrappers for question operations and exam submission.

---

## 15. Frontend Components and Roles

### Student Pages

#### `student/StudentDashboard.jsx`
Displays the personalized dashboard and routes to:
- performance history
- available assessments

#### `student/AvailableAssessmentsPage.jsx`
Shows all available exam subjects assigned to the student.

#### `student/ActiveQuizView.jsx`
Handles live quiz interaction, answer selection, and final submission.

#### `student/PerformanceHistoryPage.jsx`
Shows the student’s saved exam results and historical score review.

### Admin Pages

#### `admin/pages/Subject.jsx`
Responsible for:
- fetching all subjects
- creating subjects
- editing subjects
- deleting subjects
- searching/filtering subjects

#### `admin/pages/QuestionBank.jsx`
Responsible for:
- retrieving the question bank
- selecting a subject
- adding questions
- updating published and draft questions
- deleting questions

#### `admin/pages/AdminOverview.jsx`
Shows dashboard metrics such as:
- total students
- active subjects
- total questions
- average score
- recent results

---

## 16. End-to-End User Flow

### Student Flow
1. User signs up or logs in
2. Token is stored in localStorage
3. Student is redirected to the dashboard
4. User selects an assessment subject
5. Subject questions are fetched from backend
6. User answers questions in the quiz UI
7. Relative score is computed and submitted
8. Exam result is saved in MongoDB
9. Result appears in the student performance history

### Admin Flow
1. Admin signs in with username/password
2. Admin dashboard loads key metrics
3. Admin can manage subjects and questions
4. Admin can view all exam results
5. Admin can generate invitation links for new admins

---

## 17. Local Development Setup

### Backend
```bash
cd BACKEND
npm install
npm start
```

### Frontend
```bash
cd FRONTEND
npm install
npm run dev
```

### Expected Local URLs
- Backend: `http://localhost:2114`
- Frontend: `http://localhost:5173`

---

## 18. API Testing Examples

### Get all subjects
```bash
curl -H "Authorization: Bearer <token>" http://localhost:2114/subjects
```

### Create a subject
```bash
curl -X POST http://localhost:2114/subjects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CSC 101",
    "department": "Computer Science",
    "description": "Introduction to Computer Science",
    "duration": 60
  }'
```

### Student signup
```bash
curl -X POST http://localhost:2114/user/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepass123"
  }'
```

### Admin signin
```bash
curl -X POST http://localhost:2114/user/admin/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "adminpass123"
  }'
```

### Save exam result
```bash
curl -X POST http://localhost:2114/user/exam/save-result \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentEmail": "student@example.com",
    "subject": "CSC 101",
    "totalQuestions": 10,
    "correctAnswers": 8,
    "answers": { "1": "A", "2": "C" },
    "timeSpent": 300
  }'
```

---

## 19. Common Troubleshooting

### Backend not starting
Check:
- `MONGO_URI` exists and is valid
- MongoDB network access is enabled
- `PORT` is not already in use
- `jwtSecretKey` is configured

### Frontend cannot reach backend
Check:
- `VITE_API_URL` is set correctly
- backend is running
- CORS is enabled
- correct route URL is being used

### Unauthorized or token error
Check:
- token is saved in localStorage
- Authorization header is formatted as `Bearer <token>`
- the user is still valid in the database

### Admin invitation fails
Check:
- invitation token exists and is still pending
- invitation email matches the invite target
- the invitation has not expired or been revoked

### Email not sending
Check:
- `RESEND_API_KEY` is configured
- email sender configuration is valid
- the user’s email address is correct

---

## 20. Security Considerations

This project already includes key security mechanisms:

- bcrypt hashing for passwords
- JWT-based authentication
- role-based authorization via `adminOnly`
- active session tracking with `activeToken`
- protected API routes

Recommended improvements for production:

- stricter input validation with Joi or Zod
- request rate limiting
- stronger CORS restrictions
- HTTPS enforcement
- secret rotation strategy
- secure deployment environment management

---

## 21. Production Deployment Notes

When deploying, ensure:

- MongoDB is hosted in a secure cloud environment
- environment variables are set in production
- the frontend URL is configured in `FRONTEND_URL`
- HTTPS is enabled
- backend CORS only allows approved frontend origins
- logs are sanitized before production release

---

## 22. Summary

This project is a complete CBT platform composed of:

- a Node.js/Express backend for authentication, management, and exam processing
- MongoDB data models for users, subjects, questions, results, and invitations
- a React frontend for student and admin experiences
- role-based access control and secure session handling

It is a solid foundation for an online assessment system and can be extended with features such as:

- PDF report exports
- scheduling and timed exam windows
- question import/export packages
- analytics dashboards
- advanced admin permissions
- student profile management

---

## 23. Quick Start Commands

### Backend
```bash
cd BACKEND
npm install
npm start
```

### Frontend
```bash
cd FRONTEND
npm install
npm run dev
```

---

This documentation covers the complete project flow from backend APIs and data models to frontend routes, components, and end-to-end CBT functionality.
