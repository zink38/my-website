import express from "express";
import nodemailer from "nodemailer";
import connection from "../db.js";
import errors from "../errors/errors.js";

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

router.get("/:id", (req, res, next) => {
  const jobId = req.params.id;
  const query = "SELECT * FROM jobs WHERE id = ?";
  
  connection.query(query, [jobId], (err, results) => {
    if (err) {
      return next(err);
    }
    if (results.length === 0) {
      return next(errors.notFound);
    }
    res.render("job", { job: results[0] });
  });
});

router.post("/add-job", (req, res, next) => {
  const { title, location, salary, posted } = req.body;
  if (!title || !location || !salary || !posted) {
    return res.status(400).send("All fields are required");
  }

  const query =
    "INSERT INTO jobs (title, location, salary, posted) VALUES (?, ?, ?, ?)";

  connection.query(query, [title, location, salary, posted], (err) => {
    if (err) {
      return next(err);
    }
    res.send("Job added successfully");
  });
});

router.post("/:id/apply", (req, res, next) => {
  const { fullname, email, phone, dob, coverletter } = req.body;
  const jobId = req.params.id;

  if (!fullname || !email || !phone || !dob) {
    return res.status(400).send("All fields are required");
  }

  const jobQuery = "SELECT * FROM jobs WHERE id = ?";

  connection.query(jobQuery, [jobId], (err, results) => {
    if (err) {
      return next(err);
    }
    if (results.length === 0) {
      return next(errors.notFound);
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
        <p><strong>Cover Letter:</strong> ${coverletter}</p>
      `,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).render("applicationStatus");
    });
  });
});

export default router;
