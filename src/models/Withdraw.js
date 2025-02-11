const db = require("../config/db");

const Withdraw = {
  // ✅ Insert a new withdrawal request
  create: async (withdrawData) => {
    const [result] = await db.query("INSERT INTO withdraws SET ?", [withdrawData]);
    return result.insertId;
  },

  // ✅ Get withdrawal by ID
  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM withdraws WHERE id = ?", [id]);
    return rows[0];
  },

  // ✅ Get all withdrawals of a user
  getUserWithdrawals: async (userId) => {
    const [rows] = await db.query("SELECT * FROM withdraws WHERE user_id = ?", [userId]);
    return rows;
  },

  // ✅ Update withdrawal status
  updateStatus: async (id, status) => {
    await db.query("UPDATE withdraws SET status = ? WHERE id = ?", [status, id]);
    return true;
  },

  // ✅ Delete a withdrawal record
  delete: async (id) => {
    await db.query("DELETE FROM withdraws WHERE id = ?", [id]);
    return true;
  }
};

module.exports = Withdraw;
