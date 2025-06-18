import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import favRoutes from "./routes/favRoute.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(express.json());

app.use("/api/favorite", favRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on PORT:", PORT);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "intenal server error...";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
