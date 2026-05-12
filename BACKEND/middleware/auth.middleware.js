const jsonwebtoken = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) {
        return res.status(401).json({
            message: "No token provided. Please sign in first."
        });
    }

    jsonwebtoken.verify(token, process.env.jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid or expired token. Please sign in again."
            });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };
