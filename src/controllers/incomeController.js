
const db = require("../config/connectDB");

exports.getDirectIncome = async (req, res) => {
  try {
      const userId = req.user.userId; // ✅ Use correct field name

      if (!userId) {
          return res.status(400).json({ error: "User ID is missing from token" });
      }

      console.log("Fetching Direct Income for User ID:", userId); // ✅ Debugging

      // Fetch Direct Income from DB
      const [income] = await db.execute(
          "SELECT * FROM incomes WHERE user_id = ? AND remarks = 'Direct Income'", 
          [userId]
      );

      console.log("Income Data:", income); // ✅ Debugging database result

      return res.status(200).json({ success: true, data: income });
  } catch (error) {
      console.error("Error fetching income:", error.message);
      return res.status(500).json({ error: "Server error", details: error.message });
  }
};


exports.getLevelIncome = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ Use correct field name
  
        if (!userId) {
            return res.status(400).json({ error: "User ID is missing from token" });
        }
  
        console.log("Fetching Level Income for User ID:", userId); // ✅ Debugging
  
        // Fetch Level Income from DB
        const [income] = await db.execute(
            "SELECT * FROM incomes WHERE user_id = ? AND remarks = 'Level Income'", 
            [userId]
        );
  
        console.log("Income Data:", income); // ✅ Debugging database result
  
        return res.status(200).json({ success: true, data: income });
    } catch (error) {
        console.error("Error fetching income:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
  };
  
