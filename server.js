const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ PUT YOUR DATABASE CONNECTION HERE
const pool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "admin123",
  database: "registrar_system"
});

// ✅ TEST ROUTE
app.get("/", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SELECT 1");
    conn.release();

    res.send("Database Connected ✅");
  } catch (err) {
    console.log(err);
    res.send("Database NOT connected ❌");
  }
});

// ✅ YOUR STUDENTS ROUTE
app.get("/students", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const rows = await conn.query("SELECT * FROM shms_students");

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// ✅ START SERVER


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});