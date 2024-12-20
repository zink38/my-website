import express from 'express';
import pool from '../db.js'; // Import your database connection

const router = express.Router();

router.get('/', async (req, res) => {
  const query = "SELECT id, title, location, salary, posted FROM jobs";
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(query);
    connection.release();
    res.render("home", { jobs: results }); // Render the home.mustache template
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).send("An error occurred while fetching jobs");
  }
});

export default router;
