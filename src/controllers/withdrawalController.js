const jwt = require('jsonwebtoken');
const pool = require("../config/connectDB"); // MySQL connection pool
// Controller function to handle the withdrawal creation
const createWithdrawal = async (req, res) => {
    const { payment_mode, address, amount } = req.body;
    const userId = req.user.userId;  // Extracted userId from the token
    console.log(userId);
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {

        const [user] = await pool.query("SELECT username FROM users WHERE id = ?", [userId]);

        if (!user || !user[0]) {
            return res.status(404).json({ message: "User not found" });
        }

        const username = user[0].username;
        // Insert withdrawal with userId in the MySQL query
        const [result] = await pool.query(
            "INSERT INTO withdraws (payment_mode, address, amount, user_id, user_id_fk) VALUES (?, ?, ?, ?,?)",
            [payment_mode, address, amount, userId, username]
        );

        res.status(201).json({
            message: 'Withdrawal created successfully!',
            withdrawalId: result.insertId, // Return the insert ID
        });
    } catch (error) {
        console.error("Error inserting withdrawal:", error);
        res.status(500).json({
            message: 'Failed to create withdrawal',
            error: error.message
        });
    }
};


const getWithdrawalHistory = async (req, res) => {
    const userId = req.user.userId; // Extracted userId from the token

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Query the withdrawals table to get all withdrawals for the logged-in user
        const [withdrawals] = await pool.query(
            "SELECT address, amount, user_id_fk, created_at FROM withdraws WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );

        if (withdrawals.length === 0) {
            return res.status(404).json({ message: "No transactions found" });
        }

        // Send back the list of withdrawals
        res.status(200).json({ withdrawals });
    } catch (error) {
        console.error("Error fetching withdrawal history:", error);
        res.status(500).json({ message: "Failed to fetch withdrawal history", error: error.message });
    }
};

module.exports = { createWithdrawal,getWithdrawalHistory  }; // Export the controller function