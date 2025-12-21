import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/add", authMiddleware, addCategory);
router.get("/", authMiddleware, getCategories);

export default router;
