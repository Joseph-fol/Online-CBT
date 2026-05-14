const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema(
    {
        studentEmail: {
            type: String,
            required: true,
            index: true
        },
        subject: {
            type: String,
            required: true,
            index: true
        },
        totalQuestions: {
            type: Number,
            required: true
        },
        correctAnswers: {
            type: Number,
            required: true
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        answers: {
            type: Map,
            of: String,
            default: {}
        },
        timeSpent: {
            type: Number,
            description: "Time spent on exam in seconds"
        },
        submittedAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    { timestamps: true }
);

// Create index for faster queries by student and subject
examResultSchema.index({ studentEmail: 1, subject: 1 });

// Calculate percentage automatically
examResultSchema.pre('save', function (next) {
    if (this.totalQuestions > 0) {
        this.score = (this.correctAnswers / this.totalQuestions) * 100;
    }
    next();
});

module.exports = mongoose.model('ExamResult', examResultSchema);
