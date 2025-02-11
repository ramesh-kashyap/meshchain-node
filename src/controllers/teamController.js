const pool = require('../config/connectDB');

// Helper function: My Level Team
const myLevelTeam = async (userId) => {
    const [rows] = await pool.query('SELECT id FROM users WHERE sponsor_id = ?', [userId]);
    return rows.map(row => row.id);
};

// Get Team Data
exports.team = async (req, res) => {
    try {
        const userId = req.user.id; // Authenticated User ID
        const ids = await myLevelTeam(userId);

        let genTeams = {};

        for (let i = 1; i <= 5; i++) {
            genTeams[i] = await myLevelTeam(userId);
        }

        // Users Query
        let [users] = await pool.query(`SELECT * FROM users WHERE id IN (?) ORDER BY id DESC`, [ids]);

        // Fetch Generational Teams
        for (let i = 1; i <= 5; i++) {
            let [team] = await pool.query(`SELECT * FROM users WHERE id IN (?) ORDER BY id DESC`, [genTeams[i]]);
            genTeams[i] = team.map(user => user.username);
        }

        // Income Data Calculation
        let teamIncome = {};
        for (let i = 1; i <= 5; i++) {
            if (genTeams[i].length > 0) {
                let [[{ recharge }]] = await pool.query(
                    `SELECT SUM(amount) AS recharge FROM investments WHERE status = 'Active' AND user_id_fk IN (?)`, 
                    [genTeams[i]]
                );
                
                let [[{ withdraw }]] = await pool.query(
                    `SELECT SUM(amount) AS withdraw FROM withdraws WHERE status = 'Approved' AND user_id_fk IN (?)`, 
                    [genTeams[i]]
                );

                let [[{ earning }]] = await pool.query(
                    `SELECT SUM(comm) AS earning FROM incomes WHERE user_id_fk IN (?)`, 
                    [genTeams[i]]
                );

                teamIncome[i] = {
                    recharge: recharge || 0,
                    withdraw: withdraw || 0,
                    earning: earning || 0
                };
            } else {
                teamIncome[i] = { recharge: 0, withdraw: 0, earning: 0 };
            }
        }

        return res.json({
            users,
            genTeams,
            teamIncome
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
