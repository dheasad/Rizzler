import express from "express";
import config from "./config/app.config.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import AppError from "./utils/AppError.js";
import routes from "./routes/index.js";
import { sanitizeResponseMiddleware } from "./middlewares/sanitizeResponse.middleware.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cors(config.cors));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: config.json.limit }));

app.use(sanitizeResponseMiddleware);

app.use(config.api.prefix, routes);

app.all("/{*any}", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

const normalizeError = (err) => {
  if (err.name === "CastError") {
    return new AppError(400, `Invalid ${err.path}: ${err.value}`);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return new AppError(400, `${field} already exists`);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return new AppError(400, messages.join(". "));
  }

  return err;
};

app.use((err, req, res, next) => {
  const error = normalizeError(err);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (config.nodeEnv === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      error,
      message: error.message,
      stack: error.stack,
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  console.error("ERROR 💥", error);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
});

export default app;
