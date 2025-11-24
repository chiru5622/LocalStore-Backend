import pool from "../config/db.js";

/* =======================================================
   🔹 CREATE DAILY REPORT (Outlet)
======================================================= */
export const createReport = async (outletId, totalOrders, totalRevenue) => {
  const result = await pool.query(
    `
    INSERT INTO reports 
    (outlet_id, date, total_orders, total_revenue)
    VALUES ($1, NOW(), $2, $3)
    RETURNING *
    `,
    [outletId, totalOrders, totalRevenue]
  );

  return result.rows[0];
};

/* =======================================================
   🔹 GET OUTLET REPORTS
======================================================= */
export const getReportsByOutlet = async (outletId) => {
  const result = await pool.query(
    `SELECT * FROM reports WHERE outlet_id=$1 ORDER BY date DESC`,
    [outletId]
  );
  return result.rows;
};
