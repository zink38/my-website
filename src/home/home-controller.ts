import config from "../config.js";
import { Request, Response, NextFunction } from "express";
import { JobModel } from "../jobs/job-model.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: config.email.service,
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass,
  },
});

export class HomeController {
  static async getHomePage(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await JobModel.getAllJobs();
      res.render("home", { jobs });
    } catch (error) {
      // Log the error
      console.error("Failed to fetch jobs:", error);
      // Optionally, you can pass an error message to the view
      // jobs = null; // Indicate that jobs could not be fetched
    }
  }
  // Method for handling job applications
  static async contactMe(req: Request, res: Response, next: NextFunction) {
    const { name, email, phone, message, terms } = req.body;

    if (!name || !email || !terms) {
      res.status(400).send("Missing Required Feilds");
    } else {
      try {
        const mailOptions = {
          from: config.email.auth.user,
          to: config.email.auth.user,
          subject: `My-Website Contact Me`,
          html: `
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Message:</strong> ${message}</p>
                             <p><strong>Terms:</strong> ${terms}</p>
                        `,
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            next(err);
          } else {
            res.status(200).render("contact-status");
          }
        });
      } catch (error) {
        next(error);
      }
    }
  }
}
