const mongoose = require("mongoose")

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        unique: [true, 'Subject name must be unique'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration (in minutes) is required']
    }
}, { timestamps: true })

module.exports = mongoose.model("Subject", subjectSchema)
