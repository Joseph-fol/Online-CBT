const express = require("express")
const router = express.Router();
const {postStudentSignUp, getStudentSignUp, getStudentSignin} = require("../controllers/user.controller")

router.get("/studentSignUp", getStudentSignUp)
router.post("/signUp", postStudentSignUp)
router.get("/studentSignin", getStudentSignin)
module.exports = router