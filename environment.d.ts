declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      EXPRESS_PORT: number;
      PORT: number;
      EMAIL_ID: string;
      EMAIL_PASSWORD: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
      MYSQL_HOST: string;
      MYSQL_DB: string;
      MYSQL_PORT: number;
    }
  }
}

export {};
