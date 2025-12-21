import { pool } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";

export const uploadReceipt = async (req, res) => {
  try {
    const { expense_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "receipts",
    });

    const dbRes = await pool.query(
      `INSERT INTO receipts (expense_id, file_url)
       VALUES ($1, $2)
       RETURNING *`,
      [expense_id, result.secure_url]
    );

    res.json(dbRes.rows[0]);
  } catch (err) {
    console.error("Receipt error:", err);
    res.status(500).json({ error: "Failed to upload receipt" });
  }
};
