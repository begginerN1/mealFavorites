import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import errorHandler from "../middleware/errorMiddleware.js";
import User from "../models/User.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden!"));

    const userdata = await User.findById(user.id);
    if (!userdata) {
      next(errorHandler(404, "user not found"));
    }

    req.user = userdata;
    next();
  });
});

// admin only

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(errorHandler(401, ` Unauthorized! contact your admin`));
  }
};
