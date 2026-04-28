const mongoose = require("mongoose")

const studentDetails = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" }
})

const student = mongoose.model("studentInfo", studentDetails)
module.exports = student;