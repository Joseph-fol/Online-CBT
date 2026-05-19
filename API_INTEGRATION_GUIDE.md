# API Integration Setup & Testing Guide

## ✅ Backend Setup Complete

Your backend API is now fully configured with the following endpoints:

### Subject Management Endpoints
- **POST** `/subjects` - Create a new subject (Admin only)
- **GET** `/subjects` - Get all subjects (Authenticated users)
- **GET** `/subjects/:id` - Get subject by ID (Admin only)

---

## 🚀 Step 1: Start the Backend Server

### Ensure MongoDB is Connected
Make sure your `.env` file has the correct MongoDB URI:
```
MONGO_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/your_db
jwtSecretKey=your_jwt_secret_key
PORT=2114
```

### Start Backend
```bash
# Navigate to backend folder
cd BACKEND

# Install dependencies (if not already done)
npm install

# Start the server
npm start
# Or use nodemon for development
nodemon index.js
```

You should see:
```
Connected to MongoDB
I am working on server 2114
```

---

## 🎨 Step 2: Start the Frontend Development Server

The frontend is already configured with localhost API URL.

### Environment Configuration
Frontend `.env.local` is already set to:
```
VITE_API_URL=http://localhost:2114
```

### Start Frontend
```bash
# Navigate to frontend folder
cd FRONTEND

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Your frontend should be running at: `http://localhost:5173` (or another Vite port)

---

## 🧪 Step 3: Testing the API Connection

### Test 1: Get All Subjects (No Admin Required)
1. Log in as a student or admin user
2. Navigate to Admin Dashboard → Subjects (for admins) or check dashboard
3. You should see a loading state, then the subjects list (currently empty)
4. Check browser console for any errors

### Test 2: Create a Subject
1. Log in as an admin user
2. Go to Admin Dashboard → Subjects
3. Click "Add Subject" button
4. Fill in the form:
   - **Subject Name**: CSC 101
   - **Department**: Computer Science
   - **Duration**: 60 (minutes)
   - **Description**: Introduction to Computer Science (optional)
5. Click "Create Subject"
6. You should see a success toast notification
7. The subject should appear in the list

### Test 3: Delete a Subject
1. Hover over any subject card
2. Click the red trash/delete icon
3. Confirm the deletion
4. Subject should be removed from the list

---

## 🔍 Advanced Testing with API Tools

### Using cURL (Command Line)

#### Get All Subjects
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:2114/subjects
```

#### Create Subject
```bash
curl -X POST http://localhost:2114/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "CSC 101",
    "department": "Computer Science",
    "description": "Intro to CS",
    "duration": 60
  }'
```

#### Get Subject by ID
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:2114/subjects/SUBJECT_ID
```

### Using Postman

1. **Import Collection**:
   - Open Postman
   - Create a new collection "CBT Exam API"

2. **Set Environment Variable**:
   - Add variable `base_url` = `http://localhost:2114`
   - Add variable `token` = (your JWT token from login)

3. **Create Requests**:

**GET All Subjects**
- Method: GET
- URL: `{{base_url}}/subjects`
- Headers: `Authorization: Bearer {{token}}`

**POST Create Subject**
- Method: POST
- URL: `{{base_url}}/subjects`
- Headers: `Authorization: Bearer {{token}}`
- Body (JSON):
```json
{
  "name": "CSC 102",
  "department": "Computer Science",
  "description": "Data Structures",
  "duration": 90
}
```

---

## 📱 Frontend Integration Details

### API Service Files

**`src/utils/api.config.js`**
- Configures the base API URL
- Uses `VITE_API_URL` environment variable
- Falls back to `http://localhost:2114` if not set

**`src/utils/subjectApi.js`**
- Provides subject API functions
- Automatically adds authentication token
- Includes error handling with `.then()/.catch()` chains

### Subject Component (`src/admin/pages/Subject.jsx`)
- ✅ Fetches all subjects on mount
- ✅ Displays loading state
- ✅ Shows error messages with retry button
- ✅ Creates new subjects via modal form
- ✅ Deletes subjects with confirmation
- ✅ Auto-formats dates and assigns accent colors

---

## ⚠️ Troubleshooting

### "Failed to load subjects" Error

1. **Check Backend is Running**
   ```bash
   curl http://localhost:2114/subjects
   ```
   Should return 401 (Unauthorized) - which is expected

2. **Check Token is Valid**
   - Make sure you're logged in
   - Token is stored in localStorage
   - Reload page if needed

3. **Check CORS is Enabled**
   - Backend has `app.use(cors())` enabled
   - Should allow requests from `http://localhost:5173`

### Token Expired
- Log out and log back in
- New token will be generated
- Try the request again

### MongoDB Connection Failed
- Verify MongoDB URI in backend `.env`
- Check MongoDB connection string is correct
- Ensure network access is enabled in MongoDB Atlas

### Port Already in Use
- Backend Port 2114 in use:
  ```bash
  netstat -ano | findstr :2114  # Windows
  lsof -i :2114                  # Mac/Linux
  ```
  Then kill the process or use different port

---

## 📝 Next Steps

1. ✅ Test the subject creation and fetching
2. ✅ Verify all CRUD operations work
3. ⏭️ Add Edit Subject functionality (UPDATE endpoint)
4. ⏭️ Connect Question Bank to Subject IDs
5. ⏭️ Deploy to production when ready

---

## 🔐 Security Notes

- ✅ All endpoints require authentication (`verifyToken` middleware)
- ✅ Create/Read/Update endpoints require admin role (`adminOnly` middleware)
- ✅ JWT token is sent in `Authorization: Bearer` header
- ✅ Passwords hashed with bcrypt
- ✅ CORS enabled for frontend origin

---

**API Ready for Testing! 🎉**
