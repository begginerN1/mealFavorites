import mongoose from "mongoose";
import { ENV } from "./env.js";
export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.DB_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(`MongoDb connection faild with Erro: ${err.message}`);
  }
};
