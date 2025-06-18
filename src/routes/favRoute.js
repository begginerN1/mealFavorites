import express from "express";

import {
  deleteFav,
  getFav,
  getFavs,
  storeFav,
} from "../controllers/favController.js";
import { adminOnly, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getFavs);
router.get("/:id", getFav);
router.post("/", storeFav);
router.delete("/:id", deleteFav);

export default router;
