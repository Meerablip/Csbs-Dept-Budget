import { pool } from "../lib/db.js";

/**
 * 1. Total expenses per category
 */
export const expensesByCategory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        c.name AS category,
        SUM(e.amount) AS total_spent
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = $1
      GROUP BY c.name
      ORDER BY total_spent DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Failed to fetch category report" });
  }
};

/**
 * 2. Monthly expenses
 */
export const monthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        DATE_TRUNC('month', date) AS month,
        SUM(amount) AS total_spent
      FROM expenses
      WHERE user_id = $1
      GROUP BY month
      ORDER BY month
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Monthly report error:", err);
    res.status(500).json({ error: "Failed to fetch monthly report" });
  }
};

/**
 * 3. Budget vs spent
 */
export const budgetVsSpent = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        b.id AS budget_id,
        c.name AS category,
        b.allotted_amount,
        COALESCE(SUM(e.amount), 0) AS spent,
        (b.allotted_amount - COALESCE(SUM(e.amount), 0)) AS remaining
      FROM budgets b
      JOIN categories c ON b.category_id = c.id
      LEFT JOIN expenses e ON e.budget_id = b.id
      WHERE b.user_id = $1
      GROUP BY b.id, c.name, b.allotted_amount
      ORDER BY b.id
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Budget report error:", err);
    res.status(500).json({ error: "Failed to fetch budget report" });
  }
};
