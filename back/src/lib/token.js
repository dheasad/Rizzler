import jwt from "jsonwebtoken";
import config from "../config/app.config.js";
import AppError from "../utils/AppError.js";

const verifyWithSecret = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(401, "Token has expired");
    }
    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      throw new AppError(401, "Invalid token");
    }
    throw new AppError(401, "Unauthorized - Invalid Token");
  }
};

export const verifyToken = (token) => verifyWithSecret(token, config.jwt.key);

export const verifyRefreshToken = (token) =>
  verifyWithSecret(token, config.jwtRefresh.key);
