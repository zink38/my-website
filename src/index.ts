import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mustacheExpress from "mustache-express";
import homeRouter from "./home/home-router.js";
import jobsRouter from "./jobs/job-router.js";
import errors from "./errors/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// Configure mustache
const mustache = mustacheExpress(path.join(__dirname, "site", "partial-views"));
app.engine("mustache", mustache);
app.set("views", [
  path.join(__dirname, "home"),
  path.join(__dirname, "jobs"),
  path.join(__dirname, "errors"),
]);

app.set("view engine", "mustache");

// Routes
app.use("/", homeRouter);
app.use("/jobs", jobsRouter);

// Error handling middleware
app.use(errors.notFound);
app.use(errors.internalServerError);
app.use(errors.emailError);

export default app;
