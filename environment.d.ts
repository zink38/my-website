declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string | undefined;
      EXPRESS_PORT: string | undefined;
      PORT: string | undefined;
      EMAIL_ID: string | undefined;
      EMAIL_PASSWORD: string | undefined;
      MYSQL_USER: string | undefined;
      MYSQL_PASSWORD: string | undefined;
      MYSQL_HOST: string | undefined;
      MYSQL_DB: string | undefined;
      MYSQL_PORT: string | undefined;
    }
  }
}

export {};
