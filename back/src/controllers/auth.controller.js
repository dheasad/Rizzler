import asyncHandler from "express-async-handler";
import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";
import config from "../config/app.config.js";
import {
  formatLoginResponse,
  formatSignupResponse,
} from "../dto/auth.dto.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullname, phone, password } = req.body;

  const existingUser = await User.existingUser(phone);
  if (existingUser) {
    throw new AppError(400, "User already exists");
  }

  const user = await User.create({
    fullName: fullname.toLowerCase().trim(),
    password,
    phone,
  });

  res.status(201).json({
    statusMessage: "User signed up successfully",
    data: formatSignupResponse(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.existingUser(identifier, { includePassword: true });
  if (!user) {
    throw new AppError(400, "Invalid Credentials");
  }

  if (!user.isActive) {
    throw new AppError(403, "Account is deactivated");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError(400, "Invalid Credentials");
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.cookie(
    config.jwtRefresh.name,
    refreshToken,
    config.jwtRefresh.cookieOptions
  );

  res.status(200).json({
    statusMessage: "Logged in successfully",
    data: formatLoginResponse(user),
    token,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(config.jwtRefresh.name, config.jwtRefresh.cookieOptions);
  res.status(200).json({
    statusMessage: "Logged out successfully",
    token: "",
  });
});
