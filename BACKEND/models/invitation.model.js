const mongoose = require("mongoose")
const crypto = require("crypto")

const invitationSchema = mongoose.Schema({
    token: {
        type: String,
        unique: true,
        required: true,
        default: () => crypto.randomBytes(32).toString('hex')
    },
    invitedBy: {
        type: String,
        required: true  // email of admin who created the invitation
    },
    invitedEmail: {
        type: String,
        default: null  // optional - can restrict to specific email
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "expired"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800  // Automatically delete after 7 days (604800 seconds)
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    acceptedBy: {
        type: String,
        default: null  // email of person who used the invitation
    }
})

const invitation = mongoose.model("adminInvitation", invitationSchema)
module.exports = invitation
