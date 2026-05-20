const express = require("express")
const router = express.Router();
const { verifyToken, adminOnly } = require("../middleware/auth.middleware")
const { sendWelcomeEmail, sendAdminInvitationEmail } = require("../utils/emailService")
const {postStudentSignUp, getStudentSignUp, postAdminSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions, getQuestionById, getQuestionBySubject, updateQuestion, deleteQuestion, getDashboardStats, createAdminInvitation, validateInvitation, getPendingInvitations, revokeInvitation, saveExamResult, getStudentExamResults, getAllExamResults} = require("../controllers/user.controller")

// Email Configuration Check Endpoint
router.get("/test-email-config", (req, res) => {
    console.log("\nEMAIL CONFIGURATION CHECK");
    console.log("================================");
    
    const config = {
        EMAIL_USER: process.env.EMAIL_USER ? "SET" : "NOT SET",
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? "SET" : "NOT SET",
        EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME ? process.env.EMAIL_FROM_NAME : "Using default",
        MONGO_URI: process.env.MONGO_URI ? "SET" : "NOT SET",
        JWT_SECRET: process.env.jwtSecretKey ? "SET" : "NOT SET",
        FRONTEND_URL: process.env.FRONTEND_URL || "Using default fallback"
    };
    
    console.log(config);
    
    const issues = [];
    if (!process.env.EMAIL_USER) issues.push("EMAIL_USER not configured");
    if (!process.env.EMAIL_PASSWORD) issues.push("EMAIL_PASSWORD not configured");
    if (!process.env.MONGO_URI) issues.push("MONGO_URI not configured");
    
    return res.json({
        status: issues.length === 0 ? "CONFIGURED" : "MISSING CONFIG",
        config,
        issues,
        suggestions: [
            "Ensure EMAIL_USER is a Gmail address",
            "Ensure EMAIL_PASSWORD is a 16-character app-specific password (not regular Gmail password)",
            "Set FRONTEND_URL to your production frontend URL on Render"
        ]
    });
});

// Test email sending endpoint
router.post("/test-email-send", async (req, res) => {
    try {
        const { testEmail, type = "welcome" } = req.body;
        
        if (!testEmail) {
            return res.status(400).json({ error: "Please provide testEmail" });
        }
        
        console.log(`\n📧 Testing ${type} email to:`, testEmail);
        
        let result;
        if (type === "invitation") {
            result = await sendAdminInvitationEmail(
                testEmail,
                "https://cbt-exam.vercel.app/admin/signup?token=test123",
                "Test Admin"
            );
        } else {
            result = await sendWelcomeEmail(testEmail, "Test User");
        }
        
        console.log("Test email result:", result);
        
        return res.json({
            success: result.success,
            message: result.message || result.error,
            details: result
        });
        
    } catch (error) {
        console.error("Test email error:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Test email endpoint (legacy)
router.get("/test-email/:email", (req, res) => {
    const testEmail = req.params.email
    console.log("\n📧 Testing email to:", testEmail)
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "SET" : "NOT SET")
    console.log("EMAIL_PASSWORD exists:", !!process.env.EMAIL_PASSWORD)
    console.log("EMAIL_FROM_NAME:", process.env.EMAIL_FROM_NAME)
    
    sendWelcomeEmail(testEmail, "Test User")
        .then((result) => {
            console.log("Test email result:", result)
            res.json({ success: true, message: result.message })
        })
        .catch((error) => {
            console.error("Test email error:", error)
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
router.post("/addQuestions", verifyToken, adminOnly, addQuestion)
router.get("/getAllQuestions", verifyToken, getAllQuestions)
router.get("/question/:id", getQuestionById)
router.put("/question/:id", verifyToken, adminOnly, updateQuestion)
router.delete("/question/:id", verifyToken, adminOnly, deleteQuestion)
router.get("/subject/:subject", getQuestionBySubject)

// Admin invitation routes
router.post("/admin/create-invitation", createAdminInvitation)
router.get("/admin/validate-invitation", validateInvitation)
router.get("/admin/pending-invitations", getPendingInvitations)
router.post("/admin/revoke-invitation", revokeInvitation)

// Exam result routes
router.post("/exam/save-result", verifyToken, saveExamResult)
router.get("/exam/student-results", getStudentExamResults)
router.get("/exam/all-results", verifyToken, adminOnly, getAllExamResults)

module.exports = router