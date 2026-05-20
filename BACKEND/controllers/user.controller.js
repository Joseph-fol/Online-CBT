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
                console.warn("User already exists:", email);
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
                    console.log("Student Saved:", studentData.email)

                    // Send welcome email (non-blocking)
                    console.log("Attempting to send welcome email to:", studentData.email);
                    sendWelcomeEmail(studentData.email, studentData.fullName)
                        .then((emailResult) => {
                            if (emailResult.success) {
                                console.log("Welcome email sent successfully to:", studentData.email);
                                console.log("Email ID:", emailResult.emailId);
                            } else {
                                console.error("Welcome email failed to send to:", studentData.email);
                                console.error("Error:", emailResult.error);
                            }
                        })
                        .catch((emailError) => {
                            console.error("Welcome email catch error for:", studentData.email);
                            console.error("Error message:", emailError.message);
                            console.error("Full error:", emailError);
                        });

                    // Generate JWT token
                    const userRole = studentData.role || "student"
                    const token = jsonwebtoken.sign(
                        { id: studentData._id, email: studentData.email, role: userRole }, 
                        process.env.jwtSecretKey, 
                        { expiresIn: "1h" }
                    )
                    console.log("Generated token for:", studentData.email)

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
                            console.log("Admin Saved:", admin.email)

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
            const userRole = foundStudent.role || "student"
            const token = jsonwebtoken.sign({id: foundStudent._id, email: foundStudent.email, role: userRole}, process.env.jwtSecretKey, {expiresIn: "1h"})
            return res.status(200).json({
                message: "Signin Successful",
                token: token,
                student: {
                    id: foundStudent._id,
                    email: foundStudent.email,
                    fullName: foundStudent.fullName,
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
    console.log("Attempting MongoDB query...")
    
    student.findOne({ email: email, role: "admin" })
        .then((foundAdmin) => {
            console.log("Found admin:", foundAdmin)
            if (!foundAdmin) {
                console.log("Admin not found");
                return res.status(401).json({ message: "Admin not found" })
            }
            
            try {
                const isMatch = bcrypt.compareSync(password, foundAdmin.password)
                if (!isMatch) {
                    console.log("Invalid password");
                    return res.status(401).json({ message: "Invalid password" })
                }
            } catch (bcryptErr) {
                console.error("Bcrypt comparison error:", bcryptErr.message);
                return res.status(500).json({
                    message: "Authentication error",
                    error: bcryptErr.message
                })
            }
            
            console.log("Admin successfully signin ", foundAdmin.email);
            
            // Check if JWT secret is set
            if (!process.env.jwtSecretKey) {
                console.error("JWT Secret Key not configured");
                return res.status(500).json({
                    message: "Server configuration error",
                    error: "JWT Secret Key not configured"
                })
            }
            
            // Ensure admin role is set (fallback for older records)
            const adminRole = foundAdmin.role || "admin"
            
            // Generate JWT token
            const token = jsonwebtoken.sign(
                { id: foundAdmin._id, email: foundAdmin.email, role: adminRole },
                process.env.jwtSecretKey,
                { expiresIn: "24h" }
            )
            
            return res.json({
                message: "Admin successfully signed in",
                token: token,
                admin: {
                    id: foundAdmin._id,
                    fullName: foundAdmin.fullName,
                    email: foundAdmin.email,
                    role: foundAdmin.role
                }
            })
        })

        .catch((err) => {
            console.error("Error during admin signin");
            console.error("Error type:", err.name);
            console.error("Error message:", err.message);
            console.error("Error code:", err.code);
            console.error("Full error:", err);
            
            // Provide specific error messages
            let errorMessage = "Internal server error";
            let errorDetails = err.message;
            
            if (err.name === 'MongoServerError' || err.message.includes('ECONNREFUSED') || err.message.includes('buffering timed out')) {
                errorMessage = "Database connection error";
                errorDetails = "Cannot connect to MongoDB. Please check: 1) MongoDB is running, 2) Connection string is correct, 3) IP whitelist in MongoDB Atlas includes your IP";
            } else if (err.message.includes('ETIMEDOUT')) {
                errorMessage = "Database connection timeout";
                errorDetails = "MongoDB query timed out. The database may be slow or unreachable.";
            }
            
            return res.status(500).json({
                message: errorMessage,
                error: errorDetails,
                debug: process.env.NODE_ENV === 'development' ? err.stack : undefined
            })
        })
}

const addQuestion = (req, res) => {
    console.log("Incoming payload", req.body)
    console.log("Admin email from token:", req.user?.email)

    const { subject, duration, marks, correctAnswer, totalQuestion, questionText, optionA, optionB, optionC, optionD, score, description } = req.body
    
    // Get admin email from verified JWT token
    const adminEmail = req.user?.email;
    if (!adminEmail) {
        return res.status(401).json({
            message: "Admin email not found in token. Please sign in again."
        })
    }
    
    // If subject is provided as string (name), we need to either:
    // 1. Store it as is, or
    // 2. Look it up in Subject collection to get the ID
    // For now, we'll create the question with the subject name
    Question.create({
        subject,  // Store subject name for now
        adminEmail,  // Store the admin's email
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
            console.log("Saved question for admin:", adminEmail)
            console.log("Saved question:", newQuestion)
            res.status(201).json({
                message: "Question successfully added",
                question: newQuestion
            })
        })
        .catch((err) => {
            console.error("Error adding question:", err);
            res.status(500).json({
                message: "Failed to add question",
                error: err.message
            })
        })
}

const getAllQuestions = (req, res) => {
    const adminEmail = req.user?.email;
    
    if (!adminEmail) {
        return res.status(401).json({
            message: "Admin email not found in token. Please sign in again."
        })
    }
    
    // Filter questions by current admin OR questions without adminEmail (for backwards compatibility)
    // This handles existing questions that were created before the adminEmail field was added
    Question.find({
        $or: [
            { adminEmail: adminEmail },  // Questions created by this admin
            { adminEmail: { $exists: false } }  // Old questions without adminEmail (assign to current admin)
        ]
    })
        .then((questionsArray) => {
            console.log(`Retrieved ${questionsArray.length} questions for admin: ${adminEmail}`)
            
            // For questions without adminEmail, assign them to the current admin
            const updates = questionsArray
                .filter(q => !q.adminEmail)
                .map(q => Question.findByIdAndUpdate(q._id, { adminEmail: adminEmail }, { new: true }))
            
            // Wait for all updates to complete
            Promise.all(updates).then(() => {
                res.status(200).json({
                    questionsArray
                })
            }).catch((err) => {
                console.error("Error updating old questions:", err)
                res.status(200).json({
                    questionsArray
                })
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
    // Students can access questions from any admin for a given subject
    // Admin isolation is only in the admin dashboard (getAllQuestions)
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

const updateQuestion = (req, res) => {
    const { id } = req.params
    const adminEmail = req.user?.email
    const { subject, duration, marks, correctAnswer, totalQuestion, questionText, optionA, optionB, optionC, optionD, score, description } = req.body

    // First, find the question to verify ownership
    Question.findById(id)
        .then((question) => {
            if (!question) {
                return res.status(404).json({
                    message: "Question not found"
                })
            }

            // Verify that the admin owns this question
            if (question.adminEmail !== adminEmail) {
                return res.status(403).json({
                    message: "You can only update your own questions",
                    detail: "This question was created by another admin"
                })
            }

            // Update the question
            return Question.findByIdAndUpdate(
                id,
                {
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
                },
                { new: true }
            )
        })
        .then((updatedQuestion) => {
            if (!updatedQuestion) {
                return res.status(404).json({
                    message: "Question not found"
                })
            }

            console.log("Question updated successfully by admin:", adminEmail)
            res.status(200).json({
                message: "Question updated successfully",
                question: updatedQuestion
            })
        })
        .catch((err) => {
            console.error("Error updating question:", err);
            res.status(500).json({
                message: "Failed to update question",
                error: err.message
            })
        })
}

const deleteQuestion = (req, res) => {
    const { id } = req.params
    const adminEmail = req.user?.email

    // First, find the question to verify ownership
    Question.findById(id)
        .then((question) => {
            if (!question) {
                return res.status(404).json({
                    message: "Question not found"
                })
            }

            // Verify that the admin owns this question
            if (question.adminEmail !== adminEmail) {
                return res.status(403).json({
                    message: "You can only delete your own questions",
                    detail: "This question was created by another admin"
                })
            }

            // Delete the question
            return Question.findByIdAndDelete(id)
        })
        .then((deletedQuestion) => {
            if (!deletedQuestion) {
                return res.status(404).json({
                    message: "Question not found"
                })
            }
            console.log("Question deleted successfully by admin:", adminEmail)
            res.status(200).json({
                message: "Question deleted successfully",
                question: deletedQuestion
            })
        })
        .catch((err) => {
            console.error("Error deleting question:", err);
            res.status(500).json({
                message: "Failed to delete question",
                error: err.message
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
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Student Email:", studentEmail);
    console.log("Subject:", subject);
    console.log("Total Questions:", totalQuestions);
    console.log("Correct Answers:", correctAnswers);
    console.log("Time Spent:", timeSpent);

    // Validate required fields and provide detailed error
    const missingFields = [];
    if (!studentEmail) missingFields.push("studentEmail");
    if (!subject) missingFields.push("subject");
    if (totalQuestions === undefined || totalQuestions === null || totalQuestions === "") missingFields.push("totalQuestions");
    if (correctAnswers === undefined || correctAnswers === null || correctAnswers === "") missingFields.push("correctAnswers");

    if (missingFields.length > 0) {
        console.error("VALIDATION FAILED - Missing required fields:", missingFields);
        return res.status(400).json({
            message: `Missing required fields: ${missingFields.join(", ")}`,
            missingFields: missingFields,
            receivedData: { studentEmail, subject, totalQuestions, correctAnswers }
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

    try {
        const newExamResult = new ExamResult(examResultData)
        console.log("✅ Exam result object created successfully");
        console.log("Document before save:", newExamResult);

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
                console.error("Error name:", err.name);
                console.error("Error message:", err.message);
                console.error("Error code:", err.code);
                console.error("Validation errors:", err.errors);
                console.error("Stack trace:", err.stack);
                
                return res.status(500).json({
                    message: "Failed to save exam result",
                    error: err.message,
                    details: err.errors ? Object.keys(err.errors).map(k => `${k}: ${err.errors[k].message}`) : err.toString()
                })
            })
    } catch (error) {
        console.error("EXCEPTION while creating exam result:");
        console.error("Error message:", error.message);
        console.error("Stack trace:", error.stack);
        
        return res.status(500).json({
            message: "Failed to create exam result",
            error: error.message
        })
    }
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

// Get all exam results (for admin dashboard)
const getAllExamResults = (req, res) => {
    console.log("Admin fetching all exam results")

    return ExamResult.find({})
        .sort({ submittedAt: -1 })
        .then((results) => {
            console.log(`✅ Found ${results.length} total exam results`)
            return res.status(200).json({
                message: "All exam results fetched successfully",
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
            console.error("Error fetching all exam results:", err)
            return res.status(500).json({
                message: "Failed to fetch exam results",
                error: err.message
            })
        })
}

module.exports = { getStudentSignUp, postStudentSignUp, postAdminSignUp, getStudentSignin, getDashboard, postSignin, postAdminSignin, adminSignin, addQuestion, getAllQuestions, getQuestionById, getQuestionBySubject, updateQuestion, deleteQuestion, getDashboardStats, createAdminInvitation, validateInvitation, getPendingInvitations, revokeInvitation, saveExamResult, getStudentExamResults, getAllExamResults }