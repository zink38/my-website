import dotenv from 'dotenv';
dotenv.config();

const config = {};

const PRODUCTION = process.env.NODE_ENV === 'production';

config.express = {

};


config.db = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
};

config.email = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
};

if (PRODUCTION) {
}

export default config; // Export the config object using ES module syntax
