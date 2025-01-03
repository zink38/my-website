import config from "../config.js";
import { JobModel } from "./job-model.js";
import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from "express";

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

export class JobController {
  // Methods for job management
  static async getJobsPage(req: Request, res: Response) {
    try {
      const jobs = await JobModel.getAllJobs();
      res.render("jobs", { jobs });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  static async getJobApplicationById(req: Request, res: Response) {
    try {
      const job = await JobModel.getJobById(parseInt(req.params.id));

      if (!job.length) {
        res.status(404).send("job not found");
      } else {
        res.render("job-application", { job: job[0] });
      }
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  static async createJob(req: Request, res: Response) {
    console.log(req.body);
    try {
      const jobs = await JobModel.getAllJobs();
      if(jobs.length < 10) {
        const { title, salaryCurrency, salaryAmount, locationCity, locationCountry } = req.body;
        const location = `${locationCity}, ${locationCountry}`;
        const salary = `${salaryCurrency} ${salaryAmount}`;
        const posted = new Date().toISOString();
  

      const newJob = await JobModel.createJob(title, location, salary, posted);
      }

      res.redirect('/jobs');
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }

  static async updateJob(req: Request, res: Response) {
    try {
      await JobModel.updateJob(parseInt(req.params.id), req.body);
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  static async deleteJob(req: Request, res: Response) {
    try {
      await JobModel.deleteJob(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }

  // Method for handling job applications
  static async applyForJob(req: Request, res: Response, next: NextFunction) {
    const { fullname, email, phone, dob, coverletter } = req.body;
    const jobId = parseInt(req.params.id);

    if (!fullname || !email || !phone || !dob) {
      res.status(400).send("All fields are required");
    } else {
      try {
        const job = await JobModel.getJobById(jobId);
        if (job.length === 0) {
          res.status(404).send("Job not found");
        } else {
          const mailOptions = {
            from: config.email.auth.user,
            to: config.email.auth.user,
            subject: `New Application for ${job[0].title}`,
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
              next(err);
            } else {
              console.log("here");
              res.status(200).render("job-application-status");
            }
          });
        }
      } catch (error) {
        next(error);
      }
    }
  }
}
