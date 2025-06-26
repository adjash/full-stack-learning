import express from "express";
import sqlite3 from "sqlite3";
sqlite3.verbose();

const app = express();
const port = 3000;
app.use(express.json());
interface SqliteError extends Error {
  code?: string;
}
const db = new sqlite3.Database("./user.db", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to user.db");
  }
});

app.get("/", (req, res) => {
  db.all("SELECT * FROM user", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post("/register", (req, res) => {
  if (req.body) {
    const { email, password, username } = req.body;
    db.run(
      `INSERT INTO user 
      VALUES ('${email}', '${password}', '${username}');`,
      (err: SqliteError) => {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            res.status(409).send("Email already exists.");
          } else {
            res.status(500).send("Database error: " + err.message);
          }
        } else {
          res.send("User inserted!");
        }
      }
    );
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
