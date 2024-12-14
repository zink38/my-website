require("dotenv").config();
const nodemailer = require("nodemailer");
const bodyparser = require("body-parser");
const express = require("express");
const path = require("path");
const mustacheExpress = require("mustache-express");
const JOBS = require("./jobs");

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//express mustache config
app.set("views", path.join(__dirname, "pages"));
app.set("view engine", "mustache");
app.engine("mustache", mustacheExpress());

app.get("/", (req, res) => {
  res.render("index", { jobs: JOBS });
});

app.get("/jobs/:id", (req, res) => {
  const id = req.params.id;
  const matchedJob = JOBS.find((job) => job.id.toString() === id);
  res.render("job", { job: matchedJob });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
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
      res.status(200).render('applicationStatus');
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
