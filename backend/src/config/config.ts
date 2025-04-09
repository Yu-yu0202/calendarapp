import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
  port: number;
  db: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
  jwt: {
    secret: string;
  };
  ssl: {
    enabled: boolean;
    sslkeypath: string;
    sslcertpath: string;
  }
}

const validateConfig = () => {
  const requiredEnvVars = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

validateConfig();

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  ssl: {
    enabled: process.env.SSL_ENABLED === 'true',
    sslkeypath: process.env.SSL_KEY_PATH || './ssl/Devkey.pem',
    sslcertpath: process.env.SSL_CERT_PATH || './ssl/Devcert.pem'
  }
};

export default config;