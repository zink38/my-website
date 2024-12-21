import express from 'express';
import connection from '../db.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  const query = 'SELECT id, title, location, salary, posted FROM jobs';

  connection.query(query, (err, results) => {
    if (err) {
      return next(err);
    }
    res.render('home', { jobs: results });
  });
});

export default router;

