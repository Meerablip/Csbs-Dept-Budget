import express from "express";
import { exportExpensesExcel } from "../controllers/reportExportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { exportExpensesPDF } from "../controllers/reportExportController.js";

const router = express.Router();

router.get("/expenses/excel", authMiddleware, exportExpensesExcel);
router.get("/expenses/pdf", authMiddleware, exportExpensesPDF);



export default router;

