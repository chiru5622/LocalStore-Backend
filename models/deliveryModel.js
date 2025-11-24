import pool from "../config/db.js";

/* =======================================================
   🔹 DELIVERY PARTNER ORDER ENTRY
======================================================= */
export const createDeliveryEntry = async (deliveryPartnerId, orderId) => {
  const result = await pool.query(
    `
    INSERT INTO delivery 
    (delivery_partner_id, order_id, status)
    VALUES ($1, $2, 'assigned')
    RETURNING *
    `,
    [deliveryPartnerId, orderId]
  );

  return result.rows[0];
};

/* =======================================================
   🔹 GET DELIVERY DETAILS
======================================================= */
export const getDeliveryByPartner = async (partnerId) => {
  const result = await pool.query(
    `SELECT * FROM delivery WHERE delivery_partner_id=$1`,
    [partnerId]
  );
  return result.rows;
};

/* =======================================================
   🔹 UPDATE DELIVERY STATUS
======================================================= */
export const updateDeliveryStatus = async (deliveryId, status, route) => {
  const result = await pool.query(
    `
    UPDATE delivery
    SET status=$1, route=$2, completed_at = CASE 
        WHEN $1 = 'delivered' THEN NOW() 
        ELSE completed_at
    END
    WHERE id=$3
    RETURNING *
    `,
    [status, JSON.stringify(route), deliveryId]
  );

  return result.rows[0];
};
