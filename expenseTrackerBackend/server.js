import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./DB/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import UserRouter from "./routers/user.routers.js";
app.use("/api/v1/users", UserRouter);

import ExpenseRouter from "./routers/expenses.routers.js";
app.use("/api/v1/expenses", ExpenseRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR:", error);
      throw error;
    });

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access your server at: http://localhost:${PORT}`);
    });

    // Add error handling for the server
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use. Try a different port.`);
      } else {
        console.log("Server error:", error);
      }
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  });

export default app;