import mongoose from "mongoose";
import Fav from "../models/Favorite.js";
import asyncHandler from "express-async-handler";
import errorHandler from "../middleware/errorMiddleware.js";

export const getFavs = asyncHandler(async (req, res, next) => {
  const allFavs = await Fav.find({}).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: allFavs });
});

export const getFav = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const allFav = await Fav.findById(id);
  res.status(200).json({ success: true, data: allFav });
});

export const storeFav = asyncHandler(async (req, res, next) => {
  const fav = req.body;
  if ((!fav.userId || !fav.recipeId || !fav.title, !fav.cookTime, !fav.image)) {
    return next(errorHandler(400, "please, provide a valid data!"));
  }
  const newFav = new Fav(fav);

  await newFav.save();
  res.status(201).json({ success: true, data: newFav });
});

export const deleteFav = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(errorHandler(400, "no id found"));
  }

  await Fav.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "record was deleted" });
});
