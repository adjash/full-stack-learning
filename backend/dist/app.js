"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
sqlite3_1.default.verbose();
const app = (0, express_1.default)();
const port = 3000;
const db = new sqlite3_1.default.Database("./user.db", (err) => {
    if (err) {
        console.error("Database connection error:", err);
    }
    else {
        console.log("Connected to user.db");
    }
});
app.get("/", (req, res) => {
    db.run("INSERT INTO user VALUES ('adam.hardie13@gmail.com', 'password1', 'adjash');", (err) => {
        if (err) {
            if (err.code === "SQLITE_CONSTRAINT") {
                res.status(409).send("Email already exists.");
            }
            else {
                res.status(500).send("Database error: " + err.message);
            }
        }
        else {
            res.send("User inserted!");
        }
    });
});
app.get("/users", (req, res) => {
    db.all("SELECT * FROM user", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.json(rows);
        }
    });
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map