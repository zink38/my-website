import dotenv from "dotenv";
dotenv.config();

interface Config {
  express: {
    port: number;
  };
  db: {
    user: string;
    password: string;
    host: string;
    database: string;
    port: number;
  };
  email: {
    service: string;
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

const PRODUCTION = process.env.NODE_ENV === "production";

const config: Config = {
  express: {
    port: parseInt(process.env.EXPRESS_PORT || "3000", 10),
  },
  db: {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DB,
    port: parseInt(process.env.MYSQL_PORT, 10)
  },
  email: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
};
if (PRODUCTION) {
}

export default config;
