const { OAuth2Client } = require('google-auth-library');
const db = require("../config/connectDB");

const jwt = require('jsonwebtoken');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(req, res) {
    try {
      // Ensure token is a string
      const { token } = req.body;
      console.log("Token received:", token);
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token: Expected a non-empty string");
      }
  
      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
  
      // ====================== ADDED: Save user data in users table ======================
      // Extract the unique Google user ID, email, and name from the payload
      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name || '';
  
      // Check if the user already exists in your users table (using a unique identifier, e.g., google_id)
      const [rows] = await db.query('SELECT * FROM users WHERE google_id = ?', [googleId]);
      let user;
      if (rows.length === 0) {
        // If the user doesn't exist, insert the new user into the users table
        const insertQuery = 'INSERT INTO users (google_id, email, name) VALUES (?, ?, ?)';
        const [result] = await db.execute(insertQuery, [googleId, email, name]);
        // Create a user object using the newly inserted user's ID
        user = { id: result.insertId, google_id: googleId, email, name };
      } else {
        // If the user exists, use the existing record
        user = rows[0];
      }
      // ===================================================================================
  
      // Create your own JWT token using the user data from your database
      const jwtToken = jwt.sign(
        {
          userId: user.id,       // your internal user ID from the users table
          googleId: user.google_id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      console.log('JWT Token generated:', jwtToken);
  
      return res.status(201).json({ success: true, jwtToken });
    } catch (error) {
      console.error('Error verifying Google token:', error);
      // Ensure we return a proper HTTP response even in error
      return res.status(401).json({ success: false, error: 'Invalid Google token' });
    }
  }
  

module.exports = { verifyGoogleToken };
