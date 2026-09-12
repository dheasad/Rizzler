import express from "express";
const router = express.Router();

import authConfig from "../config/auth.config.js";
import {
  validateSignup,
  validateLogin,
} from "../middlewares/validation.middleware.js";
import {
  signup,
  login,
  logout,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

router.post(authConfig.endpoints.signup.path, validateSignup, signup);
router.post(authConfig.endpoints.login.path, validateLogin, login);
router.post(authConfig.endpoints.logout.path, protectRoute, logout);

export default router;