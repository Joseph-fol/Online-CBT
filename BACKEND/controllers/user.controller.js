const student = require("../models/user.model")
const bcrypt = require("bcrypt")

const getStudentSignUp = (req, res) => {
    res.render("studentSignup")
}

const getStudentSignin = (req, res) => {
    res.render("studentSignin")
}

const getDashboard = (req, res) => {
    res.send("You are welcome to dashboard")
}

const adminSignin = (req, res) => {
    res.render("adminSignin")
}


const postStudentSignUp = (req, res) => {
    const { fullName, email, password } = req.body
    let salt = bcrypt.genSaltSync(10)
    let hashedPassword = bcrypt.hashSync(req.body.password, salt)
    req.body.password = hashedPassword

    const studentInfo = req.body
    const newStudentDetails = new student(studentInfo)
    newStudentDetails.save()

        .then((studentData) => {
            console.log("Customer Saved", studentData);
            // Send only one response for this request.
            return res.status(201).json({
                message: "Signup Successful",
                student: {
                    id: studentData._id,
                    email: studentData.email
                }
            })

            return res.redirect("studentSignin")
            const userExists = student.findOne({ email })
            if (userExists) {
                return res.status(400).json({ 
                    message: "User already exists",
                    email: studentData.email
                })
            }
        })
        .catch((err) => {
            console.log("Error saving to database", err);
            return res.status(500).send(`Error: ${err.message}`)
        })
}

const postSignin = (req, res) => {
    const { email, password } = req.body
    student.findOne({ email })
        .then((foundStudent) => {

            if (!foundStudent) {
                console.log("Invalid email");
                return res.status(401).json({
                    message: "Invalid email or password"
                })
            }
            const isMatch = bcrypt.compareSync(password, foundStudent.password)
            if (!isMatch) {
                console.log("Invalid password");
                return res.status(401).json({
                    message: "Invalid email or password"
                })
            }
            return res.json({
                message: "Signin Successful",
                student: {
                    id: foundStudent._id,
                    email: foundStudent.email,
                }
            })
            console.log("Login successful for, ", foundStudent.email)
        })
        .catch((err) => {
            console.error("Error during signin", err);
            return res.status(500).send('Internal server error')
        })
}

const postAdminSignin = (req, res) => {
    const { email, password } = req.body
    student.findOne({ email, role: "admin" })
        .then((foundAdmin) => {
            console.log("Found admin:", foundAdmin)
            if (!foundAdmin) {
                console.log("Admin not found");
                return res.status(401).json({ message: "Admin not found" })
            }

            const isMatch = bcrypt.compareSync(password, foundAdmin.password)
            if (!isMatch) {
                console.log("Invalid password");
                return res.status(401).json({ message: "Invalid password" })
            }
            // admin123
            console.log("Admin successfully signin ", foundAdmin.email);
            return res.json({
                message: "Admin successfully signed in",
                admin: {
                    id: foundAdmin._id,
                    email: foundAdmin.email,
                    role: foundAdmin.role
                }
            })
        })

        .catch((err) => {
            console.log("Error during admin signin", err)
            return res.status(500).send("Internal server error")
        })
}

module.exports = { getStudentSignUp, postStudentSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin }