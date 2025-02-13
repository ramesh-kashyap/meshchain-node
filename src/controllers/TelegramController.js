const mysql = require('../config/connectDB'); // Adjust path if needed
let timeNow = Date.now();

const getUserByTelegramId = async (req, res) => {
    try {
        const { telegram_id } = req.body;
        // console.log(telegram_id);

        if (!telegram_id) {
            return res.status(200).json({
                message:"Telegram ID is required",
                status: false,
                timeStamp: timeNow,
            });
        }
        const query = `
            SELECT 
                tu.telegram_id, tu.tusername, tu.tname, tu.tlastname,
                u.id AS user_id, u.email, u.name, u.username
            FROM telegram_users tu
            LEFT JOIN users u ON tu.id = u.telegram_id
            WHERE tu.telegram_id = ?;
        `;

        const [results] = await mysql.execute(query, [telegram_id]);

        if (results.length === 0) {
            return res.status(200).json({
                message:"User not found",
                status: false,
                timeStamp: timeNow,
            });
        }

        return res.status(200).json({ user: results[0],status: true,
            timeStamp: timeNow });

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(200).json({
            message:"Internal Server Error",
            status: false,
            timeStamp: timeNow,
        });
    }
};

module.exports = { getUserByTelegramId };
