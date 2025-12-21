import { pool } from "../lib/db.js";
import ExcelJS from "exceljs";

// Excel export
export const exportExpensesExcel = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT e.id, e.amount, e.description, e.date, c.name AS category
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = $1`,
      [userId]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Expenses");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Description", key: "description", width: 30 },
      { header: "Date", key: "date", width: 15 },
      { header: "Category", key: "category", width: 20 },
    ];

    sheet.addRows(result.rows);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="expenses.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ error: "Failed to export Excel" });
  }
};

import PDFDocument from "pdfkit";


export const exportExpensesPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required" });
    }

    // 1. Budget summary
    const budgetSummary = await pool.query(
      `
      SELECT 
        c.name AS category,
        b.planned_amount,
        b.allotted_amount,
        COALESCE(SUM(e.amount), 0) AS spent
      FROM budgets b
      JOIN categories c ON b.category_id = c.id
      LEFT JOIN expenses e 
        ON e.budget_id = b.id
        AND EXTRACT(MONTH FROM e.date) = $1
        AND EXTRACT(YEAR FROM e.date) = $2
      WHERE b.user_id = $3
      GROUP BY c.name, b.planned_amount, b.allotted_amount
      ORDER BY c.name
      `,
      [month, year, userId]
    );

    // 2. Expense details
    const expenses = await pool.query(
      `
      SELECT e.date, c.name AS category, e.description, e.vendor, e.amount
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = $1
        AND EXTRACT(MONTH FROM e.date) = $2
        AND EXTRACT(YEAR FROM e.date) = $3
      ORDER BY e.date
      `,
      [userId, month, year]
    );

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="monthly_report_${month}_${year}.pdf"`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Department Budget Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Month: ${month} / ${year}`);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`);
    doc.moveDown(2);

    // Budget Summary
    doc.fontSize(14).text("Budget Summary");
    doc.moveDown();

    budgetSummary.rows.forEach((row) => {
      const remaining = row.allotted_amount - row.spent;
      doc.fontSize(11).text(
        `${row.category} | Planned: ${row.planned_amount} | Allotted: ${row.allotted_amount} | Spent: ${row.spent} | Remaining: ${remaining}`
      );
    });

    doc.moveDown(2);

    // Expense Details
    doc.fontSize(14).text("Expense Details");
    doc.moveDown();

    expenses.rows.forEach((exp) => {
      doc.fontSize(11).text(
        `${exp.date.toISOString().split("T")[0]} | ${exp.category} | ${exp.description || "-"} | ${exp.vendor || "-"} | ${exp.amount}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("Monthly report PDF error:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
