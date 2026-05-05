const student = require("../models/user.model")
const Question = require('../models/questions.model')
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")

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

                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "olawoyinjoseph05@gmail.com",
                            pass: "oysa nbex vzjb bily"
                        }
                    })

                    let mailOptions = {
                        from: "Online CBT",
                        to: [studentData.email],
                        subject: "Welcome to Online CBT",
                        html: `
                            <div style="background-color: #f8fafc; padding: 0 0 10px; border-radius: 30px 30px 0 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        
        <div style="padding-top: 30px; height: 80px; border-radius: 30px 30px 0 0; background-color: #0f172b; display: flex; align-items: center; justify-content: center; text-align: center;">
            <h1 style="color: #f8fafc; text-align: center; font-size: 26px; letter-spacing: 1px;">Welcome to Online CBT</h1>
        </div>

        <div style="padding: 40px 30px 20px; text-align: center; color: #0f172b; background-color: #ffffff;">
            <p style="font-size: 20px; margin-top: 0;">
                <span style="font-weight: 700; color: #ab3500;">Congratulations!</span> Your sign-up was successful.
            </p>

            <p style="line-height: 1.8; padding: 15px 10px; font-size: 16px;">
                Welcome to <strong style="color: #0f172b;">Online CBT</strong>, a secure, seamless, and smart online cbt platform . By joining us, you have taken the first step toward unlocking a seamless and distraction-free online examination experience. 
                <br><br>
                We would love to hear from you! If you have any questions or require assistance navigating your new account, please do not hesitate to reach out to our support team.
            </p>

            <!-- Footer Area -->
            <div style="padding: 20px 0 10px;">
                <hr style="width: 50%; border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
                <p style="margin-bottom: 5px; font-size: 16px; font-weight: 600;">Best Regards,</p>
                <p style="color: #ab3500; margin-top: 0; font-size: 18px; font-weight: bold;">Dev Joseph</p>
            </div>
        </div>
    </div>
                        `
                    }

                    // Send email asynchronously but don't wait for it
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.error("Email sending failed", error.message);
                        }
                        else {
                            console.log("Email sent: " + info.response);
                        }
                    })

                    // Send response immediately
                    return res.status(201).json({
                        message: "Signup Successful",
                        student: {
                            id: studentData._id,
                            email: studentData.email
                        }
                    })
                })
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
            console.log("Login successful for, ", foundStudent.email)
            return res.status(200).json({
                message: "Signin Successful",
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


module.exports = { getStudentSignUp, postStudentSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions, getQuestionById }