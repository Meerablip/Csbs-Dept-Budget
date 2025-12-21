import express from "express";
import {
  expensesByCategory,
  monthlyExpenses,
  budgetVsSpent
} from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/expenses-by-category", authMiddleware, expensesByCategory);
router.get("/monthly-expenses", authMiddleware, monthlyExpenses);
router.get("/budget-vs-spent", authMiddleware, budgetVsSpent);

export default router;
