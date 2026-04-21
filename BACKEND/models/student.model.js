const mongoose = require("mongoose")

const studentDetails = mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const student = mongoose.model("studentInfo", studentDetails)
module.exports = student;