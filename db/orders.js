const client = require("./client");

async function createOrder({ userId }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
    INSERT INTO orders ("userId")
    VALUES ($1)
    RETURNING *
    `,
      [userId]
    );

    if (order) {
      return order;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAllOrders() {
  try {
    const { rows: orders } = await client.query(
      `
    SELECT * 
    FROM orders 
    `
    );

    return orders;
  } catch (err) {
    console.error(err);
  }
}

async function getOrderById(id) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
    SELECT * 
    FROM orders 
    WHERE id=$1;
    `,
      [id]
    );

    return order;
  } catch (err) {
    console.error(err);
  }
}

async function getOrdersByUserId(userId) {
  try {
    const { rows: orders } = await client.query(
      `
    SELECT * 
    FROM orders 
    WHERE "userId"=$1;
    `,
      [userId]
    );

    return orders;
  } catch (err) {
    console.error(err);
  }
}

async function updateOrder({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [order],
    } = await client.query(
      `
    UPDATE orders
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );

    return order;
  } catch (error) {
    console.error(err);
  }
}

//get by email when tables joined

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
};
