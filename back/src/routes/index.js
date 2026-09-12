import express from "express";
import config from "../config/app.config.js";
import authRoutes from "./auth.route.js";

const router = express.Router();

router.use(`/${config.api.version}/auth`, authRoutes);

router.get(`/${config.api.version}/health`, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
