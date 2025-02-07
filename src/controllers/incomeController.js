const db = require('../config/connectDB'); // Adjust path if needed

const income = async (req, res) => {
  try {
      const [rows] = await db.query(
          "SELECT user_id_fk, amt, comm, remarks, ttime, level FROM incomes WHERE remarks = 'Direct Income'"
      );
      res.json(rows);
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { income };





