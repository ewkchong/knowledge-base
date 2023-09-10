declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_USER: string;
    DATABASE_PASS: string;
    DATABASE_NAME: string;
    DATABASE_PORT: string;
	ACCESS_TOKEN_SECRET: string;
  }
}
