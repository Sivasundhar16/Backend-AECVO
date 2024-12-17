import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import authrouter from "./router/authroute.js";
import courseroute from "./router/courserouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1/auth", authrouter);
app.use("/api/v1/courses", courseroute);

const PORT = process.env.PORT || 5000; // Use Render's PORT variable

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server is running on port ${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start the server:", error.message);
  }
};

startServer();
