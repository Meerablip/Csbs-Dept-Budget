// models/expenseModel.js
import pool from "../config/db.js";

export const createExpense = async (data) => {
  const query = `
    INSERT INTO expenses (user_id, budget_id, category_id, amount, date, description, vendor)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    data.user_id,
    data.budget_id,
    data.category_id,
    data.amount,
    data.date,
    data.description,
    data.vendor
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getExpensesByUser = async (userId) => {
  const query = `
    SELECT * FROM expenses
    WHERE user_id = $1
    ORDER BY date DESC;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};
