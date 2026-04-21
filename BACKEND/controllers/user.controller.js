const student = require("../models/student.model")
const bcrypt = require("bcrypt")

const getStudentSignUp = (req, res) =>{
    res.render("studentSignup")
} 

const getStudentSignin = (req, res) =>{
    res.render("studentSignin")
} 

const postStudentSignUp =(req, res) => {
    let salt = bcrypt.genSaltSync(10)
    let hashedPassword = bcrypt.hashSync(req.body.password, salt)
    req.body.password = hashedPassword

    const studentInfo = req.body
    const newStudentDetails = new student(studentInfo)
    newStudentDetails.save()
    .then((studentData) =>{
        console.log("Customer Saved" , studentData);
        setTimeout(() => {
            // Send only one response for this request.
            return res.redirect("/student/studentSignin")
        }, 2000);
    })
    .catch((err) =>{
        console.log("Error saving to database", err);
        return res.status(500).send(`Error: ${err.message}`)
    })
}

module.exports = {getStudentSignUp, postStudentSignUp, getStudentSignin}