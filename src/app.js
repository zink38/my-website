import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bodyparser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';
import mustacheExpress from "mustache-express";
import mysql from "mysql2";

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  Port: process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  idleTimeout: 30000,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//express mustache config
app.set("views", path.join(__dirname, "pages"));
app.set("view engine", "mustache");
app.engine("mustache", mustacheExpress());

app.get("/", (req, res) => {
  const query =
    'SELECT id, title, location, salary, posted AS posted FROM jobs';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      return res.status(500).send("An error occurred");
    }
    res.render("index", { jobs: results });
  });
});

app.get('/jobs/:id', (req, res) => {
  const jobId = req.params.id;
  const query = 'SELECT * FROM jobs WHERE id = ?';

  db.query(query, [jobId], (err, results) => {
    if (err) {
      console.error('Error fetching job:', err);
      return res.status(500).send('An error occurred');
    }

    if (results.length === 0) {
      return res.status(404).send('Job not found');
    }

    res.render('job', { job: results[0] });
  });
});


app.post("/", (req, res) => {
  const { title, location, salary, posted } = req.body;
  if (title && location && salary && posted) {
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/add-job", (req, res) => {
  const { title, location, salary, posted } = req.body;
  console.log(req.body);
  if (!title || !location || !salary || !posted) {
    return res.status(400).send("All fields are required");
  }

  const query =
    "INSERT INTO jobs (title, location, salary, posted) VALUES (?, ?, ?, ?)";
  const values = [title, location, salary, posted];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting job:", err);
      return res.status(500).send("An error occurred");
    }
    res.send("Job added successfully");
  });
});

app.post("/jobs/:id/apply", (req, res) => {
  const { name, email, phone, dob, position, coverletter } = req.body;
  const id = req.params.id;
  const matchedJob = JOBS.find((job) => job.id.toString() === id);

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: process.env.EMAIL_ID,
    subject: `New Application for ${matchedJob.title}`,
    html: `
        <p><strong> Name:<\strong> ${name}</p>
        <p><strong> Email:<\strong> ${email}</p>
        <p><strong> Phone:<\strong> ${phone}</p>
        <p><strong> Date of Birth:<\strong> ${dob}</p>
        <p><strong> Letter:<\strong> ${coverletter}</p>
        `,
  };

  console.log(mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      res.status(200).render("applicationStatus");
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
