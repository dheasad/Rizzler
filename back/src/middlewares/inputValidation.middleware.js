import AppError from "../utils/AppError.js";

export const validateRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError(400, "Request body is missing");
  }
  next();
};
