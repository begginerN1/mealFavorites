import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipeId: {
      type: String,
      ref: "Recipe",
      required: true,
    },
    title: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    cookTime: {
      type: String,
      require: true,
    },
    servings: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;
