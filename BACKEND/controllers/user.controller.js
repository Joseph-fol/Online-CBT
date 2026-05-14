const student = require("../models/user.model")
const Question = require('../models/questions.model')
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const { sendWelcomeEmail } = require("../utils/emailService")

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

    student.findOne({ email: req.body.email })
        .then((userExists) => {
            if (userExists) {
                return res.status(409).json({
                    message: "User already exists",
                    email: userExists.email
                })
            }

            let salt = bcrypt.genSaltSync(10)
            let hashedPassword = bcrypt.hashSync(req.body.password, salt)
            req.body.password = hashedPassword

            const studentInfo = req.body
            const newStudentDetails = new student(studentInfo)

            return newStudentDetails.save()
                .then((studentData) => {
                    console.log("Customer Saved", studentData);

                    // Send welcome email
                    sendWelcomeEmail(studentData.email, studentData.fullName)
                        .then((result) => {
                            console.log("Email result:", result.message);
                        })
                        .catch((err) => {
                            console.error("Background email error:", err.message);
                        });

                    // Generate token and handle response
                    return new Promise((resolve, reject) => {
                        try {
                            const token = jsonwebtoken.sign({email: studentData.email}, process.env.jwtSecretKey, {expiresIn: "30d"})
                            console.log("Generated token", studentData.email);
                            resolve(token)
                        } catch (error) {
                            reject(error)
                        }
                    })
                    .then((token) => {
                        return res.status(201).json({
                            message: "Signup Successful",
                            token: token,
                            student: {
                                id: studentData._id,
                                email: studentData.email,
                            }
                        })
                    })
                    .catch((error) => {
                        console.error("Token generation error:", error);
                        return res.status(500).json({
                            message: "Signup failed - token generation error",
                            error: error.message
                        })
                    })
                })
        })
        .catch((err) => {
            console.log("Error saving to database", err);
            return res.status(500).send(`Error: ${err.message}`)
        })
}

const postAdminSignUp = (req, res) => {
    const { fullName, email, password, adminCode } = req.body

    // Verify admin code
    if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
        return res.status(403).json({
            message: "Invalid admin registration code"
        })
    }

    student.findOne({ email: req.body.email })
        .then((userExists) => {
            if (userExists) {
                return res.status(409).json({
                    message: "Email already exists",
                    email: userExists.email
                })
            }

            let salt = bcrypt.genSaltSync(10)
            let hashedPassword = bcrypt.hashSync(req.body.password, salt)
            req.body.password = hashedPassword
            req.body.role = "admin"

            const adminInfo = req.body
            const newAdminDetails = new student(adminInfo)

            return newAdminDetails.save()
                .then((adminData) => {
                    console.log("Admin Saved", adminData);

                    // Send welcome email
                    sendWelcomeEmail(adminData.email, adminData.fullName)
                        .then((result) => {
                            console.log("Email result:", result.message);
                        })
                        .catch((err) => {
                            console.error("Background email error:", err.message);
                        });

                    // Generate token and handle response
                    return new Promise((resolve, reject) => {
                        try {
                            const token = jsonwebtoken.sign({email: adminData.email}, process.env.jwtSecretKey, {expiresIn: "30d"})
                            console.log("Generated token for admin", adminData.email);
                            resolve(token)
                        } catch (error) {
                            reject(error)
                        }
                    })
                    .then((token) => {
                        return res.status(201).json({
                            message: "Admin Signup Successful",
                            token: token,
                            admin: {
                                id: adminData._id,
                                fullName: adminData.fullName,
                                email: adminData.email,
                                role: adminData.role
                            }
                        })
                    })
                    .catch((error) => {
                        console.error("Token generation error:", error);
                        return res.status(500).json({
                            message: "Signup failed - token generation error",
                            error: error.message
                        })
                    })
                })
        })
        .catch((err) => {
            console.log("Error saving admin to database", err);
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

            console.log("Login successful for, ", foundStudent.email)
            const token = jsonwebtoken.sign({email: foundStudent.email}, process.env.jwtSecretKey, {expiresIn: "30d"})
            return res.status(200).json({
                message: "Signin Successful",
                token: token,
                student: {
                    id: foundStudent._id,
                    email: foundStudent.email,
                }
            })
        })
        .catch((err) => {
            console.error("Error during signin", err);
            return res.status(500).send('Internal server error')
        })
}

const postAdminSignin = (req, res) => {
    const { email, password } = req.body
    console.log("Admin signin attempt with email:", email)
    console.log("Searching for admin with email and role admin...")
    
    student.findOne({ email: email, role: "admin" })
        .then((foundAdmin) => {
            console.log("Found admin:", foundAdmin)
            if (!foundAdmin) {
                console.log("Admin not found");
                // Try to find user with this email to see if it exists
                student.findOne({ email: email })
                    .then((anyUser) => {
                        if (anyUser) {
                            console.log("User exists but role is:", anyUser.role);
                        } else {
                            console.log("No user found with this email");
                        }
                    })
                return res.status(401).json({ message: "Admin not found" })
            }
            
            const isMatch = bcrypt.compareSync(password, foundAdmin.password)
            if (!isMatch) {
                console.log("Invalid password");
                return res.status(401).json({ message: "Invalid password" })
            }
            console.log("Admin successfully signin ", foundAdmin.email);
            return res.json({
                message: "Admin successfully signed in",
                admin: {
                    id: foundAdmin._id,
                    fullName: foundAdmin.fullName,
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

const addQuestion = (req, res) => {
    console.log("Incoming payload", req.body)

    const { subject, duration, marks, correctAnswer, totalQuestion, questionText, optionA, optionB, optionC, optionD, score, description } = req.body
    Question.create({
        subject,
        duration,
        marks,
        description: description?.trim(),
        totalQuestion,
        questionText,
        options: {
            A: optionA,
            B: optionB,
            C: optionC,
            D: optionD
        },
        correctAnswer
    })

        .then((newQuestion) => {
            console.log("Saved question:", newQuestion)
            res.status(201).json({
                message: "Question successfully added",
                question: newQuestion
            })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                message: "Failed to add question",
                error: err.message
            })
        })
}

const getAllQuestions = (req, res) => {
    Question.find()
        .then((questionsArray) => {
            res.status(200).json({
                questionsArray
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: "Failed to fetch question",
                details: error.message
            })
        })
}

const getQuestionById = (req, res) => {
    const { id } = req.params
    
    Question.findById(id)
    .then((question) => {
        if(!question){
            return res.status(400).json({
                message: "Question not found"
            })
        }
        res.status(200).json(question)
    })
    .catch((error) => {
        res.status(500).json({
            error: "Invalid id or server error",
            details: error.message
        })
    })
}

const getQuestionBySubject = (req, res) => {
    const {subject} = req.params
    Question.find({subject: subject})
    .then((question)=>{
        if(!question || question.length == 0){
            return res.status(404).json({
                message: `No question found for ${subject}`
            })
        }
        res.status(200).json(question)
    })
    .catch((error) => {
        res.status(500).json({
            message: "Failed to fetch exam questions",
            details: error.message
        })
    })
}

const getDashboardStats = (req, res) => {
    Promise.all([
        // Count total students (users with role "student")
        student.countDocuments({ role: "student" }),
        // Count unique subjects
        Question.distinct("subject").then(subjects => subjects.length),
        // Count total questions
        Question.countDocuments(),
        // Calculate average score
        Question.aggregate([
            { $match: { score: { $exists: true, $ne: null } } },
            { $group: { _id: null, avgScore: { $avg: "$score" } } }
        ])
    ])
    .then(([totalStudents, totalSubjects, totalQuestions, averageScoreData]) => {
        const averageScore = averageScoreData.length > 0 
            ? Math.round(averageScoreData[0].avgScore) 
            : 0;

        res.status(200).json({
            totalStudents,
            totalSubjects,
            totalQuestions,
            averageScore
        })
    })
    .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({
            message: "Failed to fetch dashboard statistics",
            details: error.message
        })
    })
}


module.exports = { getStudentSignUp, postStudentSignUp, postAdminSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions, getQuestionById, getQuestionBySubject, getDashboardStats }