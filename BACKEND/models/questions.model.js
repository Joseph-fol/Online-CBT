const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'A subject is required']
    },

    duration: { type: Number },
    marks: { type: Number },
    score: { type: Number },
    totalQuestion:{ type: Number},

    questionText: {
        type: String,
        required: [true, 'Question text is required']
    },

    options: {
        A: {
            type: String, 
            required: true
        },
        B: {
            type: String, 
            required: true
        },
        C: {
            type: String, 
            required: true
        },
        D: {
            type: String, 
            required: true
        },
    }, 
    correctAnswer: {
        type: String,
        required: true,
        enum: ['A','B','C','D']
    },
},{timestamps: true})

module.exports = mongoose.model("Question", questionSchema)