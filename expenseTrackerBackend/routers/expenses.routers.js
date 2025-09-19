import express from "express";
import protect from "../middlewares/auth.middlewares.js";
import {
  addExpenses,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controllers.js";

const router = express.Router();

router.route("/").post(protect, addExpenses);
router.route("/").get(protect, getExpenses);
router.route("/:id").put(protect, updateExpense);
router.route("/:id").delete(protect, deleteExpense);

export default router;
