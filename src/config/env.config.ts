import * as dotenv from 'dotenv';
dotenv.config();

type IEnv = {
  NODE_ENV: string;
  DB_PASSWORD: string;
  DB_USERNAME: string;
  DB_NAME: string;
  PORT: string;
  DB_PORT: string;
  DB_HOST: string;
  TOKEN_SECRET: string;
  JWT_SECRET: string;
  TOKEN_LENGTH: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  EMAIL_SECURE: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  APPLE_CLIENT_ID: string;
  LOGGING: string;
  APP_ICON_URL: string;
  ENABLE_DB_SSL: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  SHA_512_HASH: string;
  RESEND_API_KEY: string;
  SENTRY_DNS: string;
  SENTRY_ENV: string;
};

const env: IEnv = process.env as IEnv;
type EnvType = 'local' | 'development' | 'test' | 'production' | 'pipeline';

export const appEnv: EnvType = (env.NODE_ENV as EnvType) || 'development';
export const envIsDev = appEnv === 'development';
export const JWT_TOKEN_SECRET: string = env.TOKEN_SECRET;
export const PORT: string | number = env.PORT || 9876;
export const DB_PORT = parseInt(env.DB_PORT);
export const DB_USERNAME = env.DB_USERNAME;
export const DB_PASSWORD = env.DB_PASSWORD;
export const DB_NAME = env.DB_NAME;
export const DB_HOST = env.DB_HOST;
export const DEFAULT_PAGE_LIMIT = 50;
export const datasource = {
  host: DB_HOST,
  port: DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  caKey: process.env.CA_KEY,
  sslMode: process.env.SSL_MODE,
};
export type DatasourceConfig = typeof datasource;
export const jwtConstants = {
  secret: env.JWT_SECRET,
};
export const tokenLength = env.TOKEN_LENGTH || 4;
export const email = {
  host: env.EMAIL_HOST || 'smtp.ethereal.email',
  port: env.EMAIL_PORT || 587,
  secure: !!env.EMAIL_SECURE,
  user: env.EMAIL_USER,
  password: env.EMAIL_PASSWORD,
};
export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
export const APPLE_CLIENT_ID = env.APPLE_CLIENT_ID;
export const PRESIGNED_URL_TTL = 60 * 10;
export const LOGGING = env.LOGGING
  ? env.LOGGING === 'true' || env.LOGGING === '1'
  : false;
export const OTP_TTL_SECONDS = 60 * 6; // 6 minutes
export const ENABLE_DB_SSL = env.ENABLE_DB_SSL;
export const CLOUDINARY_API_KEY = env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME;
export const SHA_512_HASH = env.SHA_512_HASH;
export const RESEND_API_KEY = env.RESEND_API_KEY;
export const SENTRY_DNS = env.SENTRY_DNS;
export const SENTRY_ENV = env.SENTRY_ENV;
