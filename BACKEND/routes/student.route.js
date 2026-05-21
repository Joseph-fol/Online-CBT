const express = require("express")
const router = express.Router();
const { verifyToken, adminOnly } = require("../middleware/auth.middleware")
const mongoose = require("mongoose")
const { sendWelcomeEmail, sendAdminInvitationEmail } = require("../utils/emailService")
const {postStudentSignUp, getStudentSignUp, postAdminSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions, getQuestionById, getQuestionBySubject, updateQuestion, deleteQuestion, getDashboardStats, createAdminInvitation, validateInvitation, getPendingInvitations, revokeInvitation, saveExamResult, getStudentExamResults, getAllExamResults} = require("../controllers/user.controller")

// Email Configuration Check Endpoint
router.get("/test-email-config", (req, res) => {
    console.log("\n EMAIL CONFIGURATION CHECK");
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
        
        console.log(`\n Testing ${type} email to:`, testEmail);
        
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

// Database Connection Test Endpoint
router.get("/test-db-connection", async (req, res) => {
    console.log("\nDATABASE CONNECTION TEST");
    console.log("============================");

    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set.");
        return res.status(500).json({
            status: "FAILED",
            message: "MONGO_URI environment variable is not set."
        });
    }

    try {
        // Use a temporary connection to test without disrupting the main one
        const testConn = await mongoose.createConnection(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Fail fast
        }).asPromise();

        await testConn.close();

        console.log("Database connection test successful.");
        return res.status(200).json({
            status: "SUCCESS",
            message: "MongoDB connection successful."
        });
    } catch (error) {
        console.error("Database connection test failed.");
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);

        let detailedMessage = "Authentication failed. Check your username, password, and IP whitelist.";
        if (error.message.includes('querySrv ESERVFAIL') || error.message.includes('querySrv ENODATA')) {
            detailedMessage = "DNS resolution for SRV record failed. Check your cluster URL and network settings.";
        } else if (error.message.includes('connect ETIMEDOUT')) {
            detailedMessage = "Connection timed out. This is often an IP whitelist issue. Ensure Render's IP is allowed in MongoDB Atlas.";
        }

        return res.status(500).json({
            status: "FAILED",
            message: `Database connection failed: ${error.message}`,
            detailedSuggestion: detailedMessage,
            errorCode: error.code
        });
    }
});

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