import { pool } from "../lib/db.js";

export const addBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, year, planned_amount, allotted_amount } = req.body;

    const result = await pool.query(
      `INSERT INTO budgets 
      (user_id, category_id, year, planned_amount, allotted_amount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [userId, category_id, year, planned_amount, allotted_amount]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add budget" });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM budgets WHERE user_id=$1",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
};
