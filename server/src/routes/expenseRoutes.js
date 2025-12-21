import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addExpense, getExpenses } from "../controllers/expenseController.js";
import { getExpensesTree } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/add", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/tree", authMiddleware, getExpensesTree);

export default router;

