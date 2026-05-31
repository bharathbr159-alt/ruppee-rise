const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");


// Replace with this:
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const app = express();

app.use(cors());

// ✅ Rate limiting
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { error: 'Too many requests, please try again later.' }
}));

app.use(bodyParser.json());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "..")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// ✅ Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed:", err.message);
    } else {
        console.log("Database Connected");
    }
});

// ✅ REGISTER
app.post("/register", async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        db.query("SELECT id FROM users WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length > 0) return res.status(400).json({ error: "Email already registered" });

            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
            db.query(sql, [fullname, email, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({ error: "Registration failed" });
                res.status(200).json({
                    success: true,
                    message: "User registered successfully",
                    user: { fullname, email }
                });
            });
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(401).json({ error: "Invalid email or password" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        });
    });
});

// ✅ Rupi AI chat route
app.post("/api/chat", (req, res) => {
    console.log("Chat request received");

    const body = JSON.stringify(req.body);

    const options = {
        hostname: "api.groq.com",
        path: "/openai/v1/chat/completions",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.GROQ_API_KEY,
            "Content-Length": Buffer.byteLength(body)
        }
    };

    const request = https.request(options, (response) => {
        let data = "";
        response.on("data", (chunk) => data += chunk);
        response.on("end", () => {
            try {
                res.json(JSON.parse(data));
            } catch (e) {
                res.status(500).json({ error: "Parse error" });
            }
        });
    });

    request.on("error", (err) => {
        console.log("Error:", err.message);
        res.status(500).json({ error: "AI request failed" });
    });

    request.write(body);
    request.end();
});

// ✅ Save planner data
app.post("/save-finance", (req, res) => {
    const { user_id, salary, savings, food, rent, petrol, bills,
            shopping, entertainment, emi, loanOutstanding, risk, years, score, sip } = req.body;

    if (!user_id) return res.status(400).json({ error: "Not logged in" });

    const sql = `INSERT INTO users_finance 
(user_id, salary, savings, food, rent, petrol, bills, shopping, entertainment, emi, loanOutstanding, risk, years, score, sip)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [user_id, salary, savings, food, rent, petrol, bills,
        shopping, entertainment, emi, loanOutstanding, risk, years, score, sip], (err) => {
        if (err) { console.log(err); return res.status(500).json({ error: "Save failed" }); }
        res.json({ message: "Saved successfully" });
    });
});

// ✅ Load planner data
app.get("/load-finance/:user_id", (req, res) => {
    db.query("SELECT * FROM users_finance WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [req.params.user_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Load failed" });
        res.json(results[0] || {});
    });
});

// ✅ Get user history
app.get("/history/:user_id", (req, res) => {
    const sql = `
        SELECT score, sip, created_at
        FROM users_finance
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 10
    `;

    db.query(sql, [req.params.user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "History load failed" });
        }
        res.json(result);
    });
});

// ✅ Market data proxy
app.get("/api/market/:symbol", (req, res) => {
    const symbol = req.params.symbol;
    const options = {
        hostname: "query1.finance.yahoo.com",
        path: `/v8/finance/chart/${symbol}?interval=1d&range=1d`,
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json"
        }
    };

    const request = https.request(options, (response) => {
        let data = "";
        response.on("data", chunk => data += chunk);
        response.on("end", () => {
            try { res.json(JSON.parse(data)); }
            catch(e) { res.status(500).json({ error: "Parse error" }); }
        });
    });

    request.on("error", err => res.status(500).json({ error: err.message }));
    request.end();
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});