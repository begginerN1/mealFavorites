import express from "express";

import {
  checkAuth,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  logOutUser,
  storeUser,
  updateUser,
  getSIngleUser,
} from "../controllers/userController.js";
import { adminOnly, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/logout", logOutUser);
router.get("/auth", verifyUser, getUser);
router.get("/", verifyUser, getUsers);
router.get("/:id", verifyUser, getSIngleUser);
router.post("/", storeUser);
router.patch("/:id", verifyUser, adminOnly, updateUser);
router.delete("/:id", verifyUser, adminOnly, deleteUser);
router.post("/login", loginUser);
router.get("/check", checkAuth);

export default router;
