const express = require("express")
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware")
const { sendWelcomeEmail } = require("../utils/emailService")
const {postStudentSignUp, getStudentSignUp, postAdminSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions, getQuestionById, getQuestionBySubject, getDashboardStats} = require("../controllers/user.controller")

// Test email endpoint
router.get("/test-email/:email", (req, res) => {
    const testEmail = req.params.email
    console.log("\n📧 Testing email to:", testEmail)
    console.log("EMAIL_USER:", process.env.EMAIL_USER)
    console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD)
    console.log("EMAIL_FROM_NAME:", process.env.EMAIL_FROM_NAME)
    
    sendWelcomeEmail(testEmail, "Test User")
        .then((result) => {
            console.log("✅ Test email result:", result)
            res.json({ success: true, message: result.message })
        })
        .catch((error) => {
            console.error("❌ Test email error:", error)
            res.json({ success: false, error: error.message })
        })
})

router.get("/studentSignUp", getStudentSignUp)
router.post("/signUp", postStudentSignUp)
router.post("/admin/signUp", postAdminSignUp)
router.post("/signin", postSignin)
router.get("/studentSignin", getStudentSignin)
router.get("/dashboard", verifyToken, getDashboard)
router.post("/admin/signin", postAdminSignin)
router.get("/adminSignin", adminSignin)
router.get("/dashboard-stats", getDashboardStats)
router.post("/addQuestions", addQuestion)
router.get("/getAllQuestions", getAllQuestions)
router.get("/question/:id", getQuestionById)
router.get("/subject/:subject", getQuestionBySubject)

module.exports = router