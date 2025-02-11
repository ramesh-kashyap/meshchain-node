const db = require("../config/db");

// Insert Income Record
async function addIncome(data) {
    const sql = `INSERT INTO incomes 
        (user_id, user_id_fk, amt, comm, remarks, ttime, level, tleft, tright, rname, fullname, invest_id, credit_type)
        VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.user_id, data.user_id_fk, data.amt, data.comm, 
        data.remarks, data.level, data.tleft, data.tright, 
        data.rname, data.fullname, data.invest_id, data.credit_type
    ];

    const [result] = await db.execute(sql, values);
    return result;
}

// Get Income Records by User ID
async function getIncomeByUserId(userId) {
    const sql = `SELECT * FROM incomes WHERE user_id = ? ORDER BY id DESC`;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
}

// Update Income Record
async function updateIncome(incomeId, amount) {
    const sql = `UPDATE incomes SET amt = ? WHERE id = ?`;
    const [result] = await db.execute(sql, [amount, incomeId]);
    return result;
}

// Delete Income Record
async function deleteIncome(incomeId) {
    const sql = `DELETE FROM incomes WHERE id = ?`;
    const [result] = await db.execute(sql, [incomeId]);
    return result;
}

module.exports = { addIncome, getIncomeByUserId, updateIncome, deleteIncome };
