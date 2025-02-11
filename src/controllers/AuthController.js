const db = require("../config/connectDB");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Register User Function
const register = async (req, res) => {
    console.log(req.body);
    try {        
        const { name, phone, email, password, sponsor } = req.body;
        
        if (!name || !phone || !email || !password || !sponsor) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const [existingUser] = await db.execute(
            "SELECT * FROM users WHERE email = ? OR phone = ?", [email, phone]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email or Phone already exists!" });
        }

        const [sponsorUser] = await db.execute(
            "SELECT * FROM users WHERE username = ?", [sponsor]
        );
        if (sponsorUser.length === 0) {
            return res.status(400).json({ error: "Sponsor does not exist!" });
        }

        const username = Math.random().toString(36).substring(2, 10);
        const tpassword = Math.random().toString(36).substring(2, 8);

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedTPassword = await bcrypt.hash(tpassword, 10);

        const [lastUser] = await db.execute("SELECT id FROM users ORDER BY id DESC LIMIT 1");
        const parentId = lastUser.length > 0 ? lastUser[0].id : null;

        const sponsorLevel = (sponsorUser[0].level !== undefined && sponsorUser[0].level !== null)
            ? sponsorUser[0].level
            : 0;

        const newUser = {
            name,
            phone,
            email,
            username,
            password: hashedPassword,
            tpassword: hashedTPassword,
            PSR: password,
            TPSR: tpassword,
            sponsor: sponsorUser[0].id,
            level: sponsorLevel + 1,  // Default to 0 if sponsor level is not defined, then add 1
            ParentId: parentId
        };

        console.log("New User Data:", newUser);

        await db.execute("INSERT INTO users SET ?", newUser);

        return res.status(201).json({ message: "User registered successfully!", username });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};






// Login User Function

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and Password are required!" });
        }

        // Check if user exists
        const [user] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

        if (user.length === 0) {
            return res.status(400).json({ error: "User not found!" });
        }

        const userData = user[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        // Generate JWT token (Secret key should be in .env file)
        const token = jwt.sign(
            { id: userData.id, username: userData.username },
            process.env.JWT_SECRET || "your_secret_key",  // Secret key from environment variables
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful!",
            token,  // Return token instead of storing username in localStorage
        });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};





const logout = async (req, res) => {
    try {
        return res.json({ message: "User logged out successfully!" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


const sendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = new Date(Date.now() + 10 * 60000); // 10-minute expiry

        console.log("Received Email:", email);
        console.log("Generated Code:", code);
        console.log("Code Expiry Time:", expiryTime);

        // ✅ Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.log("Email Not Found:", email);
            return res.status(404).json({ message: 'Email not found' });
        }

        console.log("User Found:", users);

        // ✅ Update verification code in database
        await db.query('UPDATE users SET verification_code = ?, code_expires_at = ? WHERE email = ?', [code, expiryTime, email]);
        console.log("Verification code updated in database");

        // ✅ Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        console.log("Nodemailer transporter configured");

        // ✅ Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset Code',
            text: `Your verification code is ${code}. This code will expire in 10 minutes.`
        };

        // ✅ Send email
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully to:", email);

        return res.json({ message: 'Verification code sent successfully' });

    } catch (error) {
        console.error("Error in sendCode function:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

// ✅ Verify Code & Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;
        console.log("Received Request for Reset Password");
        console.log("Email:", email);
        console.log("Verification Code:", code);

        // ✅ Step 1: Check if the code is valid and not expired
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? AND verification_code = ? AND code_expires_at > NOW()', 
            [email, code]
        );

        if (users.length === 0) {
            console.log("Invalid or expired verification code for:", email);
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        console.log("User Found:", users[0].email);

        // ✅ Step 2: Update the password and reset the verification code
        await db.query(
            'UPDATE users SET password = ?, verification_code = NULL, code_expires_at = NULL WHERE email = ?', 
            [password, email]
        );

        console.log("Password updated successfully for:", email);

        return res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error("Error in resetPassword function:", error.message);
        return res.status(500).json({ error: error.message });
    }
};

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ User ID from JWT Token
        console.log("sagar",userId);

        const [rows] = await db.query("SELECT id, name, email FROM users WHERE id = ?", [userId]);

        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows[0]); // ✅ Return user data
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update User Name
const updateUserProfile = async (req, res) => {
    try {
        console.log("Request User:", req.user); // 🔥 Debugging ke liye

        if (!req.user || !req.user.userId) {  // ✅ Fix yahan hai
            return res.status(400).json({ error: "User not authenticated" });
        }

        const userId = req.user.userId;  // ✅ Correct field name use karein
        const { name } = req.body;

        console.log("User ID:", userId);  // ✅ Check karein ki ID sahi aa rahi hai
        
        const [result] = await db.query("UPDATE users SET name = ? WHERE id = ?", [name, userId]);
        console.log("Update result:", result);  

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found or no changes made" });
        }

        res.json({ message: "Profile updated successfully", name });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ error: error.message });
    }
};




// module.exports = { logout };

module.exports = { login, register, logout, sendCode, resetPassword, updateUserProfile,getUserProfile};

