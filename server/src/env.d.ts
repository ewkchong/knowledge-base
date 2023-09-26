declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_USER: string;
    DATABASE_PASS: string;
    DATABASE_NAME: string;
    DATABASE_PORT: string;
	DATABASE_HOST: string;
	ACCESS_TOKEN_SECRET: string;
	SSL_CERT_PATH: string;
	NODE_ENV: string
  }
}
