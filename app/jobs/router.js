import express from "express";
import nodemailer from "nodemailer";
import db from "../db.js";

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

// router.get("/", (req, res) => {
//   const query = "SELECT id, title, location, salary, posted AS posted FROM jobs";
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching jobs:", err);
//       return res.status(500).send("An error occurred");
//     }
//     res.render("index", { jobs: results });
//   });
// });

router.get("/:id", (req, res) => {
  const jobId = req.params.id;
  const query = "SELECT * FROM jobs WHERE id = ?";

  db.query(query, [jobId], (err, results) => {
    if (err) {
      console.error("Error fetching job:", err);
      return res.status(500).send("An error occurred");
    }

    if (results.length === 0) {
      return res.status(404).send("Job not found");
    }

    res.render("job", { job: results[0] });
  });
});

router.post("/add-job", (req, res) => {
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

router.post("/:id/apply", (req, res) => {
  const { fullname, email, phone, dob, coverletter } = req.body;
  const jobId = req.params.id;
  const query = "SELECT * FROM jobs WHERE id = ?";

  db.query(query, [jobId], (err, results) => {
    if (err) {
      console.error("Error fetching job:", err);
      return res.status(500).send("An error occurred");
    }

    if (results.length === 0) {
      return res.status(404).send("Job not found");
    }

    if (!fullname || !email || !phone || !dob || !coverletter) {
      return res.status(400).send("All fields are required");
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
});

export default router;
