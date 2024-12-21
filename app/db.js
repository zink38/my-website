import mysql from 'mysql2'; // Using the promise-based client
import config from './config.js'; // Import config without destructuring

const connection = mysql.createConnection({
  ...config.db,
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
});

// Don't forget to close the connection when you're done
// connection.end();

export default connection;
