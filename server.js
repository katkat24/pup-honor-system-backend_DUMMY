const express = require("express");
const mariadb = require("mariadb");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

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
  ssl: { rejectUnauthorized: false }
});


async function updateRecord(conn, table, idColumn, idValue, body) {
  const columns = await conn.query(`SHOW COLUMNS FROM \`${table}\``);
  const validColumns = columns.map(col => col.Field).filter(col => col !== idColumn);

  const keys = Object.keys(body).filter(key => validColumns.includes(key));

  if (keys.length === 0) {
    return { error: "No valid fields to update" };
  }

  const setClause = keys.map(key => `\`${key}\` = ?`).join(", ");
  const values = keys.map(key => body[key]);

  const result = await conn.query(
    `UPDATE \`${table}\` SET ${setClause} WHERE \`${idColumn}\` = ?`,
    [...values, idValue]
  );

  return { result, updatedFields: keys };
}

async function deleteRecord(conn, table, idColumn, idValue) {
  return await conn.query(
    `DELETE FROM \`${table}\` WHERE \`${idColumn}\` = ?`,
    [idValue]
  );
}

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

// GET ROUTES
app.get("/students", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_students");
    res.json(rows);
  } catch (err) {
    console.log("STUDENTS ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/programs", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_programs");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/subjects", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_subjects");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/curriculum", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_curriculum");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/grades", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_grades");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/honor-criteria", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_honor_criteria");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/awards", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_awards");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/users", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_users");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.get("/admins", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_admins");
    res.json(rows);
  } catch (err) {
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
    res.status(500).json(err);
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

// PASSWORD RESET TOKENS
app.get("/password-reset-tokens", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM tbl_password_reset_token");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

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
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// REQUEST PASSWORD RESET
app.post("/password-reset-tokens", async (req, res) => {
  let conn;

  const { email } = req.body;

  try {
    conn = await pool.getConnection();

    // find user by email
    const users = await conn.query(
      "SELECT * FROM tbl_users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    // generate token
    const token = uuidv4();

    // token expiry (1 hour)
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    // save token
    await conn.query(
      `INSERT INTO tbl_password_reset_token
      (user_id, token, expiry)
      VALUES (?, ?, ?)`,
      [user.user_id, token, expiry]
    );

    // temporary demo response
    res.json({
      message: "Reset email sent",
      resetToken: token
    });

  } catch (err) {
    console.log("PASSWORD RESET TOKEN ERROR:", err);
    res.status(500).json(err);

  } finally {
    if (conn) conn.release();
  }
});
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
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// RESET PASSWORD
app.post("/reset-password", async (req, res) => {
  let conn;

  const { token, newPassword } = req.body;

  try {
    conn = await pool.getConnection();

    // find token
    const rows = await conn.query(
      `SELECT *
       FROM tbl_password_reset_token
       WHERE token = ?`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Invalid token"
      });
    }

    const resetRecord = rows[0];

    // check if token expired
    if (new Date(resetRecord.expiry) < new Date()) {
      return res.status(400).json({
        message: "Token expired"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password
    await conn.query(
      `UPDATE tbl_users
       SET password = ?
       WHERE user_id = ?`,
      [hashedPassword, resetRecord.user_id]
    );

    // remove token after use
    await conn.query(
      `DELETE FROM tbl_password_reset_token
       WHERE token = ?`,
      [token]
    );

    res.json({
      message: "Password updated successfully"
    });

  } catch (err) {
    console.log("RESET PASSWORD ERROR:", err);
    res.status(500).json(err);

  } finally {
    if (conn) conn.release();
  }
});


// QR VERIFY HTML
app.get("/verify/:id", async (req, res) => {
  let conn;
  const certificateId = req.params.id;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      "SELECT student_name, list_type, academic_year FROM tbl_certificates WHERE certificate_id = ?",
      [certificateId]
    );

    if (rows.length > 0) {
      const cert = rows[0];

      return res.send(`
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
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).send("<h1>Internal Server Error</h1>");
  } finally {
    if (conn) conn.release();
  }
});

// AWARDS CRUD
app.post("/awards", async (req, res) => {
  let conn;
  git add .
git commit -m "Add gwa computed to awards"
git push

    res.status(201).json({ message: "Award added successfully" });
  } catch (err) {
    console.log("ADD AWARD ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

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
       SET student_id = ?, award_type = ?, period_earned = ?, certificate_id = ?, date_generated = ?
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

    res.json({ message: "Award updated successfully" });
  } catch (err) {
    console.log("UPDATE AWARD ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

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
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// CERTIFICATES CRUD
app.post("/certificates", async (req, res) => {
  let conn;
  const {
    certificate_id,
    student_id,
    student_name,
    list_type,
    academic_year,
    semester
  } = req.body;

  try {
    conn = await pool.getConnection();

    await conn.query(
      `INSERT INTO tbl_certificates
      (certificate_id, student_id, student_name, list_type, academic_year, semester)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        certificate_id,
        student_id,
        student_name,
        list_type,
        academic_year,
        semester
      ]
    );

    res.status(201).json({ message: "Certificate added successfully" });
  } catch (err) {
    console.log("ADD CERTIFICATE ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.put("/certificates/:certificateId", async (req, res) => {
  let conn;
  const {
    student_name,
    list_type,
    academic_year,
    semester
  } = req.body;

  try {
    conn = await pool.getConnection();

    await conn.query(
      `UPDATE tbl_certificates
       SET student_name = ?, list_type = ?, academic_year = ?, semester = ?
       WHERE certificate_id = ?`,
      [
        student_name,
        list_type,
        academic_year,
        semester,
        req.params.certificateId
      ]
    );

    res.json({ message: "Certificate updated successfully" });
  } catch (err) {
    console.log("UPDATE CERTIFICATE ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/certificates/:certificateId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();

    await conn.query(
      "DELETE FROM tbl_certificates WHERE certificate_id = ?",
      [req.params.certificateId]
    );

    res.json({ message: "Certificate deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

// GENERIC UPDATE + DELETE ROUTES
app.put("/students/:studentId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await updateRecord(conn, "tbl_students", "student_id", req.params.studentId, req.body);

    if (result.error) return res.status(400).json(result);

    res.json({ message: "Student updated successfully", updatedFields: result.updatedFields });
  } catch (err) {
    console.log("UPDATE STUDENT ERROR:", err);
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/students/:studentId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await deleteRecord(conn, "tbl_students", "student_id", req.params.studentId);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.put("/grades/:gradeId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await updateRecord(conn, "tbl_grades", "grade_id", req.params.gradeId, req.body);

    if (result.error) return res.status(400).json(result);

    res.json({ message: "Grade updated successfully", updatedFields: result.updatedFields });
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
    await deleteRecord(conn, "tbl_grades", "grade_id", req.params.gradeId);
    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.put("/admins/:employeeId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await updateRecord(conn, "tbl_admins", "employee_id", req.params.employeeId, req.body);

    if (result.error) return res.status(400).json(result);

    res.json({ message: "Admin updated successfully", updatedFields: result.updatedFields });
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
    await deleteRecord(conn, "tbl_admins", "employee_id", req.params.employeeId);
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.put("/users/:userId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await updateRecord(conn, "tbl_users", "user_id", req.params.userId, req.body);

    if (result.error) return res.status(400).json(result);

    res.json({ message: "User updated successfully", updatedFields: result.updatedFields });
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
    await deleteRecord(conn, "tbl_users", "user_id", req.params.userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.put("/curriculum/:curriculumId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await updateRecord(conn, "tbl_curriculum", "curriculum_id", req.params.curriculumId, req.body);

    if (result.error) return res.status(400).json(result);

    res.json({ message: "Curriculum updated successfully", updatedFields: result.updatedFields });
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
    await deleteRecord(conn, "tbl_curriculum", "curriculum_id", req.params.curriculumId);
    res.json({ message: "Curriculum deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.put("/subjects/:subjectId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await updateRecord(conn, "tbl_subjects", "subject_id", req.params.subjectId, req.body);

    if (result.error) return res.status(400).json(result);

    res.json({ message: "Subject updated successfully", updatedFields: result.updatedFields });
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
    await deleteRecord(conn, "tbl_subjects", "subject_id", req.params.subjectId);
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (conn) conn.release();
  }
});

app.put("/programs/:programId", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await updateRecord(conn, "tbl_programs", "program_id", req.params.programId, req.body);

    if (result.error) return res.status(400).json(result);

    res.json({ message: "Program updated successfully", updatedFields: result.updatedFields });
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
    await deleteRecord(conn, "tbl_programs", "program_id", req.params.programId);
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