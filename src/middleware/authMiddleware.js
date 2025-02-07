const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]; // Or wherever your token is sent

  if (!token) {
    return res.status(403).json({ success: false, message: "No token provided." });
  }

        // Token Verify Karna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // User Fetch Karna
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        req.user = user; // ✅ `req.user` me login user store karein
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token", details: error.message });
    }
};

module.exports = authMiddleware;
