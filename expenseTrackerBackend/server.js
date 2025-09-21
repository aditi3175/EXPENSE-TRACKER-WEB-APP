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
import UserRouter from "./routers/user.routers.js";
import ExpenseRouter from "./routers/expenses.routers.js";
import { fileURLToPath } from "url";
import { dirname, join} from "path";

dotenv.config();

// ---------------- Create Express App ----------------
const app = express();

// ---------------- Security & Middleware ----------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https://expense-tracker-web-app-nott.onrender.com",
        ],
      },
    },
  })
);

app.use(generalLimiter);

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN ||
        "https://expense-tracker-web-app-nott.onrender.com"
      : true,
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

// ---------------- Health Check ----------------
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---------------- API Routes ----------------
app.use("/api/v1/users", authLimiter, UserRouter);
app.use("/api/v1/expenses", ExpenseRouter);

// ---------------- Serve React Frontend ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from frontend build
app.use(express.static(join(__dirname, "dist")));

// Fallback to index.html for non-API requests
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) return next(); // skip API routes
  res.sendFile(join(__dirname, "dist", "index.html"));
});

// ---------------- Error Handling ----------------
app.use(notFound);
app.use(errorHandler);

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
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
