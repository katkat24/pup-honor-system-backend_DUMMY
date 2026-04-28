const fs = require("fs");

// CHANGE this to your CSV path
const inputPath = "C:/Users/cathe/sis-api/sis-api/database/SHMS Database.csv";
const outputPath = "C:/Users/cathe/sis-api/sis-api/database/students_full.sql";

const lines = fs.readFileSync(inputPath, "utf8").split(/\r?\n/).filter(Boolean);

// skip header
const data = lines.slice(1);

function esc(v) {
  if (v === undefined || v === null) return "NULL";
  v = v.trim();
  if (v === "") return "NULL";
  // numeric?
  if (!isNaN(v) && v.indexOf("-") === -1) return v;
  // escape quotes
  return "'" + v.replace(/'/g, "''") + "'";
}

let sql =
`INSERT INTO students
(studentID,name,program,college,gwa,semester,academicYear,yearLevel,failedSubjects,incompleteSubjects,droppedSubjects,withdrawnSubjects,unitsEnrolled,requiredUnits,honorStatus)
VALUES
`;

const values = data.map(row => {
  const cols = row.split(","); // works if your CSV doesn’t have commas inside quotes
  return `(${cols.map(esc).join(",")})`;
});

sql += values.join(",\n") + ";\n";

fs.writeFileSync(outputPath, sql);
console.log("SQL file created at:", outputPath);