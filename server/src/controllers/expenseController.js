import { pool } from "../lib/db.js";

export const addExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      budget_id,
      category_id,
      amount,
      date,
      description,
      vendor,
      parent_expense_id
    } = req.body;

    const result = await pool.query(
      `INSERT INTO expenses 
       (user_id, budget_id, category_id, amount, date, description, vendor, parent_expense_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        budget_id,
        category_id,
        amount,
        date,
        description,
        vendor,
        parent_expense_id || null
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Expense error:", err);
    res.status(500).json({ error: "Failed to add expense" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get expenses error:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const getExpensesTree = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM expenses
      WHERE user_id = $1
      ORDER BY parent_expense_id NULLS FIRST, id
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Expense tree error:", err);
    res.status(500).json({ error: "Failed to fetch expenses tree" });
  }
};
