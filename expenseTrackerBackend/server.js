import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import connectDB from "./DB/db.js";
import {
  generalLimiter,
  authLimiter,
} from "./middlewares/rateLimiting.middlewares.js";
import {
  notFound,
  errorHandler,
} from "./middlewares/errorHandler.middlewares.js";

dotenv.config();

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);


app.use(generalLimiter);

// CORS configuration - Allow all origins in development
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN || "https://yourdomain.com"
      : true, // Allow ANY origin in development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, req.body);
  }
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
import UserRouter from "./routers/user.routers.js";
import ExpenseRouter from "./routers/expenses.routers.js";

app.use("/api/v1/users", authLimiter, UserRouter);
app.use("/api/v1/expenses", ExpenseRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is running!",
    version: "1.0.0",
    docs: "/api/v1/docs",
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("App ERROR:", error);
      throw error;
    });

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access at: http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `CORS: ${
          process.env.NODE_ENV === "production"
            ? "Restricted origins"
            : "All origins allowed"
        }`
      );
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("Process terminated");
        process.exit(0);
      });
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

export default app;