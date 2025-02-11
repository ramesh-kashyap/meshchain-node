const db = require("../config/db");

const Investment = {
  // ✅ Create a new investment
  create: async (investmentData) => {
    const [result] = await db.query("INSERT INTO investments SET ?", [investmentData]);
    return result.insertId;
  },

  // ✅ Get investment by ID
  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM investments WHERE id = ?", [id]);
    return rows[0];
  },

  // ✅ Get all investments of a user
  getUserInvestments: async (userId) => {
    const [rows] = await db.query("SELECT * FROM investments WHERE user_id = ?", [userId]);
    return rows;
  },

  // ✅ Update investment status
  updateStatus: async (id, status) => {
    await db.query("UPDATE investments SET status = ? WHERE id = ?", [status, id]);
    return true;
  },

  // ✅ Delete an investment record
  delete: async (id) => {
    await db.query("DELETE FROM investments WHERE id = ?", [id]);
    return true;
  }
};

module.exports = Investment;
