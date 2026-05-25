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
// Endpoint for QR Verification: /verify/CERT-12345
app.get("/verify/:id", async (req, res) => {
  let conn;
  const certificateId = req.params.id;

  if (!certificateId) {
    return res.status(400).send(`
      <h1>Missing Certificate ID</h1>
      <p>Please provide a certificate ID.</p>
    `);
  }

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT student_name, list_type, academic_year FROM tbl_certificates WHERE certificate_id = ?",
      [certificateId]
    );

    if (rows.length > 0) {
      const cert = rows[0];

      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificate Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f4f6f8;
              padding: 30px;
              text-align: center;
            }
            .card {
              background: white;
              max-width: 500px;
              margin: auto;
              padding: 25px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.12);
            }
            .verified {
              color: #15803d;
              font-size: 28px;
              font-weight: bold;
            }
            .label {
              color: #555;
              margin-top: 15px;
              font-size: 14px;
            }
            .value {
              font-size: 18px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="verified">VERIFIED ✅</div>
            <h2>PUP Student Honor Management System</h2>

            <div class="label">Certificate Number</div>
            <div class="value">${certificateId}</div>

            <div class="label">Student Name</div>
            <div class="value">${cert.student_name}</div>

            <div class="label">Award</div>
            <div class="value">${cert.list_type}</div>

            <div class="label">Academic Year</div>
            <div class="value">${cert.academic_year}</div>

            <div class="label">Verification Date</div>
            <div class="value">${new Date().toISOString().split("T")[0]}</div>
          </div>
        </body>
        </html>
      `);
    }

    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invalid Certificate</title>
      </head>
      <body style="font-family: Arial; text-align: center; padding: 40px; background: #fff1f2;">
        <div style="background: white; max-width: 500px; margin: auto; padding: 25px; border-radius: 12px;">
          <h1 style="color: #dc2626;">INVALID ❌</h1>
          <p>This certificate record could not be found in the SHMS Portal registry.</p>
          <p><b>Certificate ID:</b> ${certificateId}</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.log("VERIFY ERROR:", error);
    return res.status(500).send("<h1>Internal Server Error</h1>");
  } finally {
    if (conn) conn.release();
  }
});
app.get("/certificates", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_certificates");
    res.json(rows);
  } catch (err) {
    console.log("GET CERTIFICATES ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// ADD award
app.post("/awards", async (req, res) => {
  let conn;

  const {
    student_id,
    award_type,
    period_earned,
    certificate_id,
    date_generated
  } = req.body;

  try {
    conn = await pool.getConnection();

    await conn.query(
      `INSERT INTO tbl_awards
      (student_id, award_type, period_earned, certificate_id, date_generated)
      VALUES (?, ?, ?, ?, ?)`,
      [
        student_id,
        award_type,
        period_earned,
        certificate_id,
        date_generated
      ]
    );

    res.status(201).json({
      message: "Award added successfully"
    });

  } catch (err) {
    console.log("ADD AWARD ERROR:", err);
    res.status(500).json(err);

  } finally {
    if (conn) conn.release();
  }
});

// UPDATE award
app.put("/awards/:awardId", async (req, res) => {
  let conn;

  const {
    student_id,
    award_type,
    period_earned,
    certificate_id,
    date_generated
  } = req.body;

  try {
    conn = await pool.getConnection();

    await conn.query(
      `UPDATE tbl_awards
       SET
         student_id = ?,
         award_type = ?,
         period_earned = ?,
         certificate_id = ?,
         date_generated = ?
       WHERE award_id = ?`,
      [
        student_id,
        award_type,
        period_earned,
        certificate_id,
        date_generated,
        req.params.awardId
      ]
    );

    res.json({
      message: "Award updated successfully"
    });

  } catch (err) {
    console.log("UPDATE AWARD ERROR:", err);
    res.status(500).json(err);

  } finally {
    if (conn) conn.release();
  }
});

// DELETE award
app.delete("/awards/:awardId", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    await conn.query(
      "DELETE FROM tbl_awards WHERE award_id = ?",
      [req.params.awardId]
    );

    res.json({ message: "Award deleted successfully" });
  } catch (err) {
    console.log("DELETE AWARD ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});
// UPDATE student
app.put("/students/:studentId", async (req, res) => {
  let conn;
  const data = req.body;

  try {
    conn = await pool.getConnection();

    await conn.query(
      "UPDATE tbl_students SET ? WHERE student_id = ?",
      [data, req.params.studentId]
    );

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.log("UPDATE STUDENT ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// DELETE student
app.delete("/students/:studentId", async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    await conn.query(
      "DELETE FROM tbl_students WHERE student_id = ?",
      [req.params.studentId]
    );

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.log("DELETE STUDENT ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// GRADES
app.put("/grades/:gradeId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE tbl_grades SET ? WHERE grade_id = ?", [req.body, req.params.gradeId]);
    res.json({ message: "Grade updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/grades/:gradeId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM tbl_grades WHERE grade_id = ?", [req.params.gradeId]);
    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// ADMINS
app.put("/admins/:employeeId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE tbl_admins SET ? WHERE employee_id = ?", [req.body, req.params.employeeId]);
    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/admins/:employeeId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM tbl_admins WHERE employee_id = ?", [req.params.employeeId]);
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// USERS
app.put("/users/:userId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE tbl_users SET ? WHERE user_id = ?", [req.body, req.params.userId]);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/users/:userId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM tbl_users WHERE user_id = ?", [req.params.userId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// CURRICULUM
app.put("/curriculum/:curriculumId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE tbl_curriculum SET ? WHERE curriculum_id = ?", [req.body, req.params.curriculumId]);
    res.json({ message: "Curriculum updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/curriculum/:curriculumId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM tbl_curriculum WHERE curriculum_id = ?", [req.params.curriculumId]);
    res.json({ message: "Curriculum deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// SUBJECTS
app.put("/subjects/:subjectId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE tbl_subjects SET ? WHERE subject_id = ?", [req.body, req.params.subjectId]);
    res.json({ message: "Subject updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/subjects/:subjectId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM tbl_subjects WHERE subject_id = ?", [req.params.subjectId]);
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// PROGRAMS
app.put("/programs/:programId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE tbl_programs SET ? WHERE program_id = ?", [req.body, req.params.programId]);
    res.json({ message: "Program updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/programs/:programId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM tbl_programs WHERE program_id = ?", [req.params.programId]);
    res.json({ message: "Program deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});