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
/// STUDENTS
app.get("/students", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

   const rows = await conn.query(`
  	SELECT * FROM tbl_students
    `);

    res.json(rows);
  } catch (err) {
    console.log("STUDENTS ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});
// PROGRAMS
app.get("/programs", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_programs");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// SUBJECTS
app.get("/subjects", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_subjects");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// CURRICULUM
app.get("/curriculum", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_curriculum");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// GRADES
app.get("/grades", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_grades");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// HONOR CRITERIA
app.get("/honor-criteria", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_honor_criteria");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// AWARDS
app.get("/awards", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_awards");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// USERS
app.get("/users", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_users");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// ADMINS
app.get("/admins", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_admins");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});
app.get("/activity-log", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_activity_log");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});
app.get("/password-reset-tokens", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT * FROM tbl_password_reset_token"
    );

    res.json(rows);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);

  } finally {
    if (conn) conn.release();
  }
});
// GET password reset token
app.get("/password-reset-tokens/:token", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT * FROM tbl_password_reset_token WHERE token = ?",
      [req.params.token]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Token not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log("TOKEN GET ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// CREATE password reset token
app.post("/password-reset-tokens", async (req, res) => {
  let conn;
  const { user_id, token, expiry } = req.body;

  try {
    conn = await pool.getConnection();

    await conn.query(
      "INSERT INTO tbl_password_reset_token (user_id, token, expiry) VALUES (?, ?, ?)",
      [user_id, token, expiry]
    );

    res.status(201).json({ message: "Token created" });
  } catch (err) {
    console.log("TOKEN POST ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// DELETE password reset token
app.delete("/password-reset-tokens/:token", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    await conn.query(
      "DELETE FROM tbl_password_reset_token WHERE token = ?",
      [req.params.token]
    );

    res.json({ message: "Token deleted" });
  } catch (err) {
    console.log("TOKEN DELETE ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// UPDATE user password
app.put("/users/:userId", async (req, res) => {
  let conn;
  const { password } = req.body;

  try {
    conn = await pool.getConnection();

    await conn.query(
      "UPDATE tbl_users SET password = ? WHERE user_id = ?",
      [password, req.params.userId]
    );

    res.json({ message: "Password updated" });
  } catch (err) {
    console.log("PASSWORD UPDATE ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});
// QR Certificate Verification
app.get("/verify", async (req, res) => {
  let conn;
  const certificateId = req.query.id;

  if (!certificateId) {
    return res.status(400).json({
      status: "MISSING_CERTIFICATE_ID",
      message: "Please provide a certificate ID."
    });
  }

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT student_name, list_type, academic_year FROM tbl_certificates WHERE certificate_id = ?",
      [certificateId]
    );

    if (rows.length > 0) {
      return res.status(200).json({
        status: "VERIFIED",
        system_name: "PUP Student Honor Management System",
        verification_date: new Date().toISOString().split("T")[0],
        certificate_details: {
          certificate_number: certificateId,
          student_name: rows[0].student_name,
          award: rows[0].list_type,
          academic_year: rows[0].academic_year
        }
      });
    }

    return res.status(404).json({
      status: "INVALID_CERTIFICATE",
      message: "This certificate record could not be found in the SHMS Portal registry."
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) conn.release();
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});