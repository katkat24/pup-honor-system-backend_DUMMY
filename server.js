const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get("/", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("SELECT 1");
    res.send("Database Connected ✅");
  } catch (err) {
    console.log("DB ERROR:", err);
    res.status(500).send("Database NOT connected ❌");
  } finally {
    if (conn) conn.release();
  }
});

app.get("/students", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const rows = await conn.query(`
      SELECT
        studentID,
        surname,
        givenname AS givenName,
        program,
        college,
        gwa,
        semester,
        academicYear,
        yearlevel AS yearLevel,
        failedSubjects,
        incSubjects AS incompleteSubjects,
        dropSubjects AS droppedSubjects,
        withdrawnSubjects,
        unitsEnrolled,
        requiredUnits,
        lowestGrade,
        entryType,
        studentStatus,
        cumulativeGwa
      FROM students
    `);

    res.json(rows);
  } catch (err) {
    console.log("STUDENTS ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});