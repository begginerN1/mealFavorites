import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import errorHandler from "../middleware/errorMiddleware.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// ------------------------------------- login user -------------------------------------
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate user
  if (!email || !password) {
    next(errorHandler(400, "please type email and/or password"));
  }

  // check if user exist
  const isUser = await User.findOne({ email });
  if (!isUser) {
    return next(errorHandler(400, "invalid credentials"));
  }

  const validPass = await bcrypt.compare(password, isUser.password);
  if (!validPass) {
    return next(errorHandler(400, "incorrect credentials, try again"));
  }

  if (!isUser.isVerified) {
    return next(errorHandler(400, "email is not verified! try again later"));
  }

  const token = generateToken(isUser._id);

  res.cookie("access_token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    // secure: true,
    sameSite: "lax",
  });

  res.status(200).json({
    token,
    user: { id: isUser._id, email: isUser.email, role: isUser.role },
  });
});

// ------------------------------------- log out user -------------------------------------
export const logOutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("access_token");
  res.status(200).json("user has been logged out");
});

// ------------------------------------- get user -------------------------------------
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(errorHandler(400, "no such user found!"));
  }

  res
    .status(200)
    .json({ user: { id: user._id, email: user.email, role: user.role } });
});
// ------------------------------------- get user -------------------------------------
export const getSIngleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(errorHandler(400, "no such user found!"));
  }

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});
// ------------------------------------- get users -------------------------------------
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  if (!users) {
    return next(errorHandler(400, "no such user found!"));
  }

  res.status(200).json(users);
});
// ------------------------------------- delete user -------------------------------------
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    return next(errorHandler(400, "no such user found!"));
  }

  res.status(301).json({ message: "user was deleted successfully" });
});

// ------------------------------------- Check Authentication Status -------------------------------------
export const checkAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(200).json({ isAuthenticated: false, user: null });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(200).json({ isAuthenticated: false, user: null });
    }

    return res.status(200).json({
      isAuthenticated: true,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    // Token is invalid or expired
    return res.status(200).json({ isAuthenticated: false, user: null });
  }
});

// ------------------------------------- update user -------------------------------------
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Get the user before update
  const userBefore = await User.findById(id);
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedUser) {
    return next(errorHandler(400, "failed to update user data"));
  }

  if (
    typeof req.body.isVerified !== "undefined" &&
    !userBefore.isVerified &&
    updatedUser.isVerified
  ) {
    sendUsernNotificationEmail(updatedUser);
  }
  const { password, ...rest } = updatedUser._doc;
  res.status(200).json(rest);
});

// ------------------------------------- register User -------------------------------------
export const storeUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //validate the request
  if (!name || !email || !password) {
    return next(errorHandler(400, "please, fill in all required fields!"));
  }
  if (password.length < 6) {
    return next(errorHandler(400, "Password must be up to 6 character!"));
  }
  // check duplicates
  const isUser = await User.findOne({ email });
  if (isUser) {
    res.status(400);
    throw new Error("choose a different email");
  }

  const hashadPass = await bcrypt.hash(password, 10);
  //create a new user
  const user = await User.create({
    name,
    email,
    password: hashadPass,
  });

  // generate tokem
  if (user) {
    res
      .status(200)
      .json({ success: true, message: "user was registered successfully" });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});
