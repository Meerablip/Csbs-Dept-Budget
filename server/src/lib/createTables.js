import { pool } from "./db.js";

const createTables = async () => {
  try {
    // Users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Categories
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );
    `);

    // Budgets
    await pool.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        category_id INT REFERENCES categories(id),
        year INT NOT NULL,
        planned_amount NUMERIC(12,2) NOT NULL,
        allotted_amount NUMERIC(12,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Expenses
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        budget_id INT REFERENCES budgets(id),
        category_id INT REFERENCES categories(id),
        amount NUMERIC(12,2) NOT NULL,
        description TEXT,
        vendor VARCHAR(100),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Receipts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        id SERIAL PRIMARY KEY,
        expense_id INT REFERENCES expenses(id),
        file_url TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    pool.end();
  }
};

createTables();
