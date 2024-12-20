import express from "express";
import nodemailer from "nodemailer";
import pool from "../db.js";

const router = express.Router();

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

// router.get("/", async (req, res) => {
//   const query = "SELECT id, title, location, salary, posted FROM jobs";
//   try {
//     const connection = await pool.getConnection();
//     const [results] = await connection.query(query);
//     connection.release();
//     res.render("index", { jobs: results });
//   } catch (err) {
//     console.error("Error fetching jobs:", err);
//     res.status(500).send("An error occurred");
//   }
// });

router.get("/:id", async (req, res) => {
  const jobId = req.params.id;
  const query = "SELECT * FROM jobs WHERE id = ?";
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(query, [jobId]);
    connection.release();
    if (results.length === 0) {
      return res.status(404).send("Job not found");
    }
    res.render("job", { job: results[0] });
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).send("An error occurred");
  }
});

router.post("/add-job", async (req, res) => {
  const { title, location, salary, posted } = req.body;
  if (!title || !location || !salary || !posted) {
    return res.status(400).send("All fields are required");
  }

  const query = "INSERT INTO jobs (title, location, salary, posted) VALUES (?, ?, ?, ?)";
  const values = [title, location, salary, posted];
  try {
    const connection = await pool.getConnection();
    await connection.query(query, values);
    connection.release();
    res.send("Job added successfully");
  } catch (err) {
    console.error("Error inserting job:", err);
    res.status(500).send("An error occurred");
  }
});

router.post("/:id/apply", async (req, res) => {
  const { fullname, email, phone, dob, coverletter } = req.body;
  const jobId = req.params.id;
  const query = "SELECT * FROM jobs WHERE id = ?";

  if (!fullname || !email || !phone || !dob || !coverletter) {
    return res.status(400).send("All fields are required");
  }

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(query, [jobId]);
    connection.release();
    if (results.length === 0) {
      return res.status(404).send("Job not found");
    }

    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: process.env.EMAIL_ID,
      subject: `New Application for ${results[0].title}`,
      html: `
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date of Birth:</strong> ${dob}</p>
        <p><strong>Letter:</strong> ${coverletter}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        res.status(200).render("applicationStatus");
      }
    });
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).send("An error occurred");
  }
});

export default router;
