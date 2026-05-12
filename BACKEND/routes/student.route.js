const express = require("express")
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware")
const {postStudentSignUp, getStudentSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions, getQuestionById, getQuestionBySubject} = require("../controllers/user.controller")

router.get("/studentSignUp", getStudentSignUp)
router.post("/signUp", postStudentSignUp)
router.post("/signin", postSignin)
router.get("/studentSignin", getStudentSignin)
router.get("/dashboard", verifyToken, getDashboard)
router.post("/admin/signin", postAdminSignin)
router.get("/adminSignin", adminSignin)
router.post("/addQuestions", addQuestion)
router.get("/getAllQuestions", getAllQuestions)
router.get("/question/:id", getQuestionById)
router.get("/subject/:subject", getQuestionBySubject)

module.exports = router