import express from "express";
import multer from "multer";
import { uploadReceipt } from "../controllers/receiptController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  authMiddleware,
  upload.single("receipt"),
  uploadReceipt
);

export default router;
