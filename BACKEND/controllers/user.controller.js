const student = require("../models/user.model")
const Question = require('../models/questions.model')
const Invitation = require("../models/invitation.model")
const ExamResult = require("../models/examResult.model")
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const { sendWelcomeEmail, sendAdminInvitationEmail, sendInvitationRevokedEmail } = require("../utils/emailService")

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

    console.log("\n📝 STUDENT SIGNUP ATTEMPT");
    console.log("=============================");
    console.log("Email:", email);
    console.log("Full Name:", fullName);
    console.log("Resend API Key available:", !!process.env.RESEND_API_KEY);

    // Check if user already exists
    student.findOne({ email: req.body.email })
        .then((userExists) => {
            if (userExists) {
                console.warn("⚠️ User already exists:", email);
                return res.status(409).json({
                    message: "User already exists",
                    email: userExists.email
                })
            }

            // Hash password
            let salt = bcrypt.genSaltSync(10)
            let hashedPassword = bcrypt.hashSync(req.body.password, salt)
            req.body.password = hashedPassword

            // Create and save student
            const studentInfo = req.body
            const newStudentDetails = new student(studentInfo)
            
            return newStudentDetails.save()
                .then((studentData) => {
                    console.log("✅ Student Saved:", studentData.email)

                    // Send welcome email (non-blocking)
                    console.log("📧 Attempting to send welcome email to:", studentData.email);
                    sendWelcomeEmail(studentData.email, studentData.fullName)
                        .then((emailResult) => {
                            if (emailResult.success) {
                                console.log("✅ Welcome email sent successfully to:", studentData.email);
                                console.log("Email ID:", emailResult.emailId);
                            } else {
                                console.error("❌ Welcome email failed to send to:", studentData.email);
                                console.error("Error:", emailResult.error);
                            }
                        })
                        .catch((emailError) => {
                            console.error("❌ Welcome email catch error for:", studentData.email);
                            console.error("Error message:", emailError.message);
                            console.error("Full error:", emailError);
                        });

                    // Generate JWT token
                    const token = jsonwebtoken.sign(
                        { email: studentData.email }, 
                        process.env.jwtSecretKey, 
                        { expiresIn: "1h" }
                    )
                    console.log("🔑 Generated token for:", studentData.email)

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
                    console.error("Student signup error:", error.message);
                    return res.status(500).json({
                        message: "Signup failed",
                        error: error.message
                    })
                })
        })
        .catch((error) => {
            console.error("Database error:", error.message);
            return res.status(500).json({
                message: "Signup failed",
                error: error.message
            })
        })
}

const postAdminSignUp = (req, res) => {
    const { fullName, email, password, invitationToken } = req.body

    console.log("Admin signup attempt for:", email);

    // Verify invitation token
    if (!invitationToken) {
        return res.status(400).json({
            message: "Invitation token is required"
        })
    }

    // Find and validate invitation
    Invitation.findOne({ token: invitationToken, status: "pending" })
        .then((invitation) => {
            if (!invitation) {
                return res.status(403).json({
                    message: "Invalid or expired invitation"
                })
            }

            // Check if invitation was for a specific email
            if (invitation.invitedEmail && invitation.invitedEmail !== email) {
                return res.status(403).json({
                    message: "This invitation is for a different email address"
                })
            }

            // Check if user already exists
            return student.findOne({ email: email })
                .then((userExists) => {
                    if (userExists) {
                        return res.status(409).json({
                            message: "Email already exists",
                            email: userExists.email
                        })
                    }

                    // Hash password
                    let salt = bcrypt.genSaltSync(10)
                    let hashedPassword = bcrypt.hashSync(password, salt)

                    // Create and save admin
                    const adminData = {
                        fullName,
                        email,
                        password: hashedPassword,
                        role: "admin"
                    }

                    const newAdminDetails = new student(adminData)
                    return newAdminDetails.save()
                        .then((admin) => {
                            console.log("✅ Admin Saved:", admin.email)

                            // Mark invitation as accepted
                            invitation.status = "accepted"
                            invitation.acceptedAt = new Date()
                            invitation.acceptedBy = email
                            return invitation.save()
                                .then(() => {
                                    console.log("Invitation marked as accepted")

                                    // Send welcome email (non-blocking)
                                    sendWelcomeEmail(admin.email, admin.fullName)
                                        .then((emailResult) => {
                                            if (emailResult.success) {
                                                console.log("Welcome email sent to admin:", admin.email)
                                            } else {
                                                console.warn("Welcome email failed:", emailResult.error)
                                            }
                                        })
                                        .catch((emailError) => {
                                            console.error("Welcome email error:", emailError.message)
                                        });

                                    // Generate JWT token
                                    const token = jsonwebtoken.sign(
                                        { email: admin.email }, 
                                        process.env.jwtSecretKey, 
                                        { expiresIn: "30d" }
                                    )
                                    console.log("Generated token for admin:", admin.email)

                                    return res.status(201).json({
                                        message: "Admin Signup Successful",
                                        token: token,
                                        admin: {
                                            id: admin._id,
                                            fullName: admin.fullName,
                                            email: admin.email,
                                            role: admin.role
                                        }
                                    })
                                })
                                .catch((inviteError) => {
                                    console.error("Error updating invitation:", inviteError.message)
                                    return res.status(500).json({
                                        message: "Signup failed while updating invitation",
                                        error: inviteError.message
                                    })
                                })
                        })
                        .catch((error) => {
                            console.error("Admin signup error:", error.message)
                            return res.status(500).json({
                                message: "Admin signup failed",
                                error: error.message
                            })
                        })
                })
                .catch((error) => {
                    console.error("Database error:", error.message);
                    return res.status(500).json({
                        message: "Signup failed",
                        error: error.message
                    })
                })
        })
        .catch((error) => {
            console.error("Invitation validation error:", error.message)
            return res.status(500).json({
                message: "Signup failed",
                error: error.message
            })
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
            const token = jsonwebtoken.sign({email: foundStudent.email}, process.env.jwtSecretKey, {expiresIn: "1h"})
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

// Create invitation link (only admins can create)
const createAdminInvitation = (req, res) => {
    const { invitedEmail } = req.body
    const adminEmail = req.headers['x-admin-email'] || req.body.adminEmail

    console.log("Creating invitation for:", invitedEmail, "by:", adminEmail)

    // Verify that the requester is an admin
    student.findOne({ email: adminEmail, role: "admin" })
        .then((admin) => {
            if (!admin) {
                return res.status(403).json({
                    message: "Only admins can create invitations"
                })
            }

            // Create new invitation
            const newInvitation = new Invitation({
                invitedBy: adminEmail,
                invitedEmail: invitedEmail || null
            })

            return newInvitation.save()
                .then((savedInvitation) => {
                    const invitationLink = `${process.env.FRONTEND_URL || 'https://onlinecbt.vercel.app'}/admin/signup?token=${savedInvitation.token}`
                    
                    console.log("Invitation created:", savedInvitation.token)

                    let response = {
                        message: "Invitation created successfully",
                        invitationToken: savedInvitation.token,
                        invitationLink: invitationLink,
                        expiresIn: "7 days"
                    }

                    // Send email if invitedEmail is provided
                    if (invitedEmail) {
                        console.log("Sending email to:", invitedEmail)
                        return sendAdminInvitationEmail(
                            invitedEmail, 
                            invitationLink, 
                            admin.fullName || adminEmail
                        )
                            .then((emailResult) => {
                                if (emailResult.success) {
                                    response.emailSent = true
                                    response.emailMessage = "Invitation sent to the email address"
                                    console.log("Email sent successfully to:", invitedEmail)
                                } else {
                                    response.emailSent = false
                                    response.emailMessage = "Invitation created but email failed to send. Share the link manually."
                                    console.error("Email failed:", emailResult.error)
                                }
                                return res.status(201).json(response)
                            })
                            .catch((emailError) => {
                                response.emailSent = false
                                response.emailMessage = "Invitation created but email failed to send. Share the link manually."
                                console.error("Email error:", emailError.message)
                                return res.status(201).json(response)
                            })
                    } else {
                        response.emailSent = false
                        response.emailMessage = "No email provided - copy link manually"
                        return res.status(201).json(response)
                    }
                })
                .catch((err) => {
                    console.error("Error creating invitation:", err);
                    return res.status(500).json({
                        message: "Failed to create invitation",
                        error: err.message
                    })
                })
        })
        .catch((err) => {
            console.error("Error verifying admin:", err);
            return res.status(500).json({
                message: "Failed to create invitation",
                error: err.message
            })
        })
}

// Validate invitation token
const validateInvitation = (req, res) => {
    const { token } = req.query

    if (!token) {
        return res.status(400).json({
            message: "Invitation token is required"
        })
    }

    Invitation.findOne({ token: token, status: "pending" })
        .then((invitation) => {
            if (!invitation) {
                return res.status(403).json({
                    valid: false,
                    message: "Invalid or expired invitation"
                })
            }

            res.status(200).json({
                valid: true,
                message: "Invitation is valid",
                invitedEmail: invitation.invitedEmail,
                createdAt: invitation.createdAt
            })
        })
        .catch((err) => {
            console.error("Error validating invitation:", err);
            res.status(500).json({
                message: "Failed to validate invitation",
                error: err.message
            })
        })
}

// Get all pending invitations (for admin dashboard)
const getPendingInvitations = (req, res) => {
    const adminEmail = req.headers['x-admin-email'] || req.body.adminEmail
    Invitation.find({ invitedBy: adminEmail, status: "pending" })
        .select('token invitedEmail createdAt')
        .then((invitations) => {
            res.status(200).json({
                invitations: invitations
            })
        })
        .catch((err) => {
            console.error("Error fetching invitations:", err);
            res.status(500).json({
                message: "Failed to fetch invitations",
                error: err.message
            })
        })
}

// Revoke invitation (admin can revoke sent invitations)
const revokeInvitation = (req, res) => {
    const { token } = req.body
    const adminEmail = req.headers['x-admin-email'] || req.body.adminEmail

    // First find the invitation to get its details
    Invitation.findOne({ token: token, invitedBy: adminEmail, status: "pending" })
        .then((invitation) => {
            if (!invitation) {
                return res.status(404).json({
                    message: "Invitation not found or already used"
                })
            }

            // Update the invitation status to expired
            invitation.status = "expired"
            return invitation.save()
                .then((revokedInvitation) => {
                    console.log("Invitation revoked:", token)

                    // Send revocation email if invitedEmail exists
                    if (revokedInvitation.invitedEmail) {
                        // Get admin's full name
                        student.findOne({ email: adminEmail })
                            .then((admin) => {
                                const adminName = admin?.fullName || adminEmail
                                sendInvitationRevokedEmail(
                                    revokedInvitation.invitedEmail, 
                                    adminName
                                )
                                    .then((emailResult) => {
                                        if (emailResult.success) {
                                            console.log("Revocation email sent to:", revokedInvitation.invitedEmail)
                                        } else {
                                            console.error("Failed to send revocation email:", emailResult.error)
                                        }
                                    })
                                    .catch((emailError) => {
                                        console.error("Revocation email error:", emailError.message)
                                    })
                            })
                            .catch((err) => {
                                console.error("Error fetching admin details:", err.message)
                            })
                    }

                    return res.status(200).json({
                        message: "Invitation revoked successfully",
                        invitation: revokedInvitation
                    })
                })
                .catch((err) => {
                    console.error("Error updating invitation:", err);
                    return res.status(500).json({
                        message: "Failed to revoke invitation",
                        error: err.message
                    })
                })
        })
        .catch((err) => {
            console.error("Error revoking invitation:", err);
            return res.status(500).json({
                message: "Failed to revoke invitation",
                error: err.message
            })
        })
}

// Save exam result/score
const saveExamResult = (req, res) => {
    const { studentEmail, subject, totalQuestions, correctAnswers, answers, timeSpent } = req.body

    console.log("\n📥 RECEIVED EXAM RESULT SAVE REQUEST");
    console.log("=====================================");
    console.log("Student Email:", studentEmail);
    console.log("Subject:", subject);
    console.log("Total Questions:", totalQuestions);
    console.log("Correct Answers:", correctAnswers);
    console.log("Time Spent:", timeSpent);
    console.log("Body received:", JSON.stringify(req.body, null, 2));

    // Validate required fields
    if (!studentEmail || !subject || totalQuestions === undefined || correctAnswers === undefined) {
        console.error("❌ VALIDATION FAILED - Missing required fields");
        return res.status(400).json({
            message: "Missing required fields: studentEmail, subject, totalQuestions, correctAnswers"
        })
    }

    // Calculate score
    const score = (correctAnswers / totalQuestions) * 100

    // Create new exam result
    const examResultData = {
        studentEmail,
        subject,
        totalQuestions,
        correctAnswers,
        score,
        answers: answers || {},
        timeSpent: timeSpent || null,
        submittedAt: new Date()
    }

    console.log("📝 Creating exam result with data:", JSON.stringify(examResultData, null, 2));

    const newExamResult = new ExamResult(examResultData)

    return newExamResult.save()
        .then((result) => {
            console.log("EXAM RESULT SAVED SUCCESSFULLY");
            console.log("Result ID:", result._id);
            console.log("Score saved:", result.score);
            console.log("Full result:", JSON.stringify(result, null, 2));
            
            return res.status(201).json({
                message: "Exam result saved successfully",
                result: {
                    id: result._id,
                    studentEmail: result.studentEmail,
                    subject: result.subject,
                    totalQuestions: result.totalQuestions,
                    correctAnswers: result.correctAnswers,
                    score: result.score.toFixed(2),
                    submittedAt: result.submittedAt
                }
            })
        })
        .catch((err) => {
            console.error("ERROR SAVING EXAM RESULT");
            console.error("Error message:", err.message);
            console.error("Error details:", JSON.stringify(err, null, 2));
            console.error("Stack trace:", err.stack);
            
            return res.status(500).json({
                message: "Failed to save exam result",
                error: err.message,
                details: err.toString()
            })
        })
}

// Get all exam results for a student
const getStudentExamResults = (req, res) => {
    const { studentEmail } = req.query

    console.log("Fetching exam results for student:", studentEmail)

    // Validate required field
    if (!studentEmail) {
        return res.status(400).json({
            message: "Missing required field: studentEmail"
        })
    }

    return ExamResult.find({ studentEmail: studentEmail })
        .sort({ submittedAt: -1 })
        .then((results) => {
            console.log(`✅ Found ${results.length} exam results for:`, studentEmail)
            return res.status(200).json({
                message: "Exam results fetched successfully",
                count: results.length,
                results: results.map(result => ({
                    id: result._id,
                    studentEmail: result.studentEmail,
                    subject: result.subject,
                    totalQuestions: result.totalQuestions,
                    correctAnswers: result.correctAnswers,
                    score: result.score.toFixed(2),
                    timeSpent: result.timeSpent,
                    submittedAt: result.submittedAt,
                    status: result.score >= 50 ? "Pass" : "Fail"
                }))
            })
        })
        .catch((err) => {
            console.error("Error fetching exam results:", err)
            return res.status(500).json({
                message: "Failed to fetch exam results",
                error: err.message
            })
        })
}

module.exports = { getStudentSignUp, postStudentSignUp, postAdminSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions, getQuestionById, getQuestionBySubject, getDashboardStats, createAdminInvitation, validateInvitation, getPendingInvitations, revokeInvitation, saveExamResult, getStudentExamResults }