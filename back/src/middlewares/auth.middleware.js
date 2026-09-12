import AppError from "../utils/AppError.js";
import { verifyToken } from "../lib/token.js";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";

export const protectRoute = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    throw new AppError(401, "Unauthorized - No Token Provided");
  }

  const decoded = verifyToken(token);
  if (!decoded?.userId) {
    throw new AppError(401, "Unauthorized - Invalid Token");
  }

  const user = await User.existingUser(decoded.userId);
  if (!user) {
    throw new AppError(401, "Unauthorized - User not found");
  }

  if (!user.isActive) {
    throw new AppError(403, "Unauthorized - Account is deactivated");
  }

  req.user = user;
  next();
});
