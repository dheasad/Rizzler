import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const trimEnv = (value, fallback) => {
  if (value == null || String(value).trim() === "") return fallback;
  return String(value).trim();
};

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const nodeEnv = trimEnv(process.env.NODE_ENV, "development");

/**
 * Application configuration
 * Centralizes all configuration settings and provides defaults
 */
export default {
  port: parsePositiveInt(process.env.PORT, 3000),
  nodeEnv,

  mongodb: {
    uri:
      trimEnv(process.env.MONGODB_URI, null) ||
      "mongodb://localhost:27017/smart-commerce",
  },

  api: {
    prefix: "/api",
    version: "v1",
  },

  json: {
    limit: trimEnv(process.env.JSON_LIMIT, "10kb"),
  },

  cors: {
    origin: trimEnv(process.env.CORS_ORIGIN, "http://localhost:3000"),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },

  jwt: {
    key: trimEnv(process.env.JWT_SECRET, "123456789"),
    expiresIn: trimEnv(process.env.JWT_EXPIRES_IN, "1d"),
    cookieOptions: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: nodeEnv === "production" ? "none" : "lax",
      secure: nodeEnv === "production",
      path: "/",
    },
    name: trimEnv(process.env.JWT_NAME || process.env.TOKEN_NAME, "token"),
  },

  jwtRefresh: {
    key: trimEnv(process.env.JWT_REFRESH_SECRET, "987654321"),
    expiresIn: trimEnv(process.env.JWT_REFRESH_EXPIRES_IN, "7d"),
    cookieOptions: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: nodeEnv === "production" ? "none" : "lax",
      secure: nodeEnv === "production",
      path: "/",
    },
    name: trimEnv(
      process.env.JWT_REFRESH_NAME || process.env.TOKEN_REFRESH_NAME,
      "refreshToken"
    ),
  },

  logging: {
    level: trimEnv(process.env.LOG_LEVEL, "info"),
  },

  bcrypt: {
    saltRounds: parsePositiveInt(
      process.env.BCRYPT_SALT_ROUNDS || process.env.SALT,
      10
    ),
  },

  passLen: {
    min: 8,
    max: 72,
  },
};
