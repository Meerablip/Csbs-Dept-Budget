import { pool } from "./db.js";

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("DB connection error:", err);
  else console.log("DB connected:", res.rows);
  pool.end();
});
