import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controllers.js";
let validateUser, validateLogin;

try {
  const validation = await import("../middlewares/validation.middlewares.js");
  validateUser = validation.validateUser;
  validateLogin = validation.validateLogin;
} catch (error) {
  console.log("⚠️  Validation middleware not found, using basic validation");

  validateUser = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters" });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    next();
  };

  validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    next();
  };
}

const router = Router();

router.route("/register").post(validateUser, registerUser);
router.route("/login").post(validateLogin, loginUser);

export default router;