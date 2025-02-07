const db = require('../config/connectDB'); // Database connection

const income = async (req, res) => {
    try {
        // Username query params (for GET) or body (for POST) se le rahe hain
        const username = req.query.username || req.body.username;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        // Fetch Direct Income of the logged-in user based on username
        const [rows] = await db.query(
            `SELECT incomes.user_id_fk, incomes.amt, incomes.comm, incomes.remarks, incomes.ttime, incomes.level
            FROM incomes
            JOIN users ON users.id = incomes.user_id_fk
            WHERE incomes.remarks = 'Direct Income' AND users.username = ?`,
            [username]
        );

        res.json(rows);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { income };
