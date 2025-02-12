const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database Name
  process.env.DB_USER,       // Database User
  process.env.DB_PASSWORD,   // Database Password
  {
    host: process.env.DB_HOST,
    dialect: "mysql",       // Using MySQL
    logging: false,         // Disable logs (optional)
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch(err => console.error("❌ Database Connection Error:", err));

module.exports = sequelize;

