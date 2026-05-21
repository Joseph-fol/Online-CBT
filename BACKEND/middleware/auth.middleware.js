const jsonwebtoken = require("jsonwebtoken");
const student = require("../models/user.model");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            message: "No token provided. Please sign in first."
        });
    }

    jsonwebtoken.verify(token, process.env.jwtSecretKey, async (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid or expired token. Please sign in again."
            });
        }
        
        try {
            const foundUser = await student.findOne({ email: decoded.email });
            
            if (!foundUser || foundUser.activeToken !== token) {
                return res.status(401).json({
                    message: "Session expired or you logged in from another device. Please log in again."
                });
            }
            
            // Enrich req.user with role from DB, just in case token is missing it
            req.user = {
                ...decoded,
                role: foundUser.role
            };
            next();
        } catch (dbErr) {
            console.error("Auth Middleware DB Error:", dbErr);
            return res.status(500).json({ message: "Internal server error during authentication" });
        }
    });
};

const adminOnly = (req, res, next) => {
    // verifyToken should be called before this middleware
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    // Check if user role is admin
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin privileges required."
        });
    }
    next();
};

module.exports = { verifyToken, adminOnly };
