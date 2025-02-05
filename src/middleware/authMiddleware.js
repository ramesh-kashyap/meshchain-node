import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ success: false, message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.raj12345);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Failed to authenticate token." });
  }
};

export default authMiddleware; // ✅ Correct Export
