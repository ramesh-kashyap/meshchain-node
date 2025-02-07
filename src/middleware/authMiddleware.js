const jwt = require("jsonwebtoken");

// Middleware for JWT Authentication
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from headers

    if (!token) {
        return res.status(401).json({ error: "Access Denied. No token provided!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        req.user = decoded; // Store user data in request object
        next(); // Continue to the next middleware
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token!" });
    }
};

module.exports = verifyToken;
