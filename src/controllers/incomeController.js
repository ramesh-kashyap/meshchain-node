const db = require('../config/connectDB'); // Adjust path if needed

const getDirectIncome = async (req, res) => {
  try {
    const userId = req.user.id; // Get Logged-in User ID from JWT Token

    // Fetch Direct Income from DB
    const [income] = await db.execute(
        "SELECT * FROM incomes WHERE user_id = ? AND remarks = 'Direct Income'", 
        [userId]
    );

    return res.status(200).json({ success: true, data: income });
} catch (error) {
    console.error("Error fetching income:", error.message);
    return res.status(500).json({ error: "Server error", details: error.message });
}
};


module.exports = { getDirectIncome };





