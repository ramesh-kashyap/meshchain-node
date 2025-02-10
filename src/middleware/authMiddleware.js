const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]; // Or wherever your token is sent

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access Denied. No token provided!" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token part
  console.log("Extracted Token:", token); // ✅ Check extracted token

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
      req.user = decoded;
      console.log("Decoded Token Data:", req.user); // ✅ Check decoded user data
      next();
  } catch (error) {
      return res.status(403).json({ error: "Invalid or expired token!" });
  }
};


module.exports = verifyToken;
