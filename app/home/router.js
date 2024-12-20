import express from 'express';
import db from '../db.js'; // Import your database connection

const router = express.Router();

router.get('/', (req, res) => {
  const query = "SELECT id, title, location, salary, posted AS posted FROM jobs";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      return res.status(500).send("An error occurred");
    }
    res.render("home", { jobs: results }); // Render the home.mustache template
  });
});

export default router;
