import mysql from 'mysql2/promise'; // Using the promise-based client
import config from './config.js'; // Import config without destructuring

const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  idleTimeout: 30000, // 30 seconds
});

pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err);
  });

export default pool;
