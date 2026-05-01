const express = require("express")
const router = express.Router();
const {postStudentSignUp, getStudentSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions} = require("../controllers/user.controller")

router.get("/studentSignUp", getStudentSignUp)
router.post("/signUp", postStudentSignUp)
router.post("/signin", postSignin)
router.get("/studentSignin", getStudentSignin)
router.get("/dashboard", getDashboard)
router.post("/admin/signin", postAdminSignin)
router.get("/adminSignin", adminSignin)
router.post("/addQuestions", addQuestion)
router.get("/getAllQuestions", getAllQuestions)

module.exports = router