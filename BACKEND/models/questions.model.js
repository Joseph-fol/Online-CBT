const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'A subject is required']
    },

    adminEmail: {
        type: String,
        required: [true, 'Admin email is required'],
        index: true
    },

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

    description : {
        type: String,
        required: true
    },
    
    correctAnswer: {
        type: String,
        required: true,
        enum: ['A','B','C','D']
    },
    
    duration: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
},{timestamps: true})

module.exports = mongoose.model("Question", questionSchema)