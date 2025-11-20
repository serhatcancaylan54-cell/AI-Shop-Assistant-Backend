// integrations/shopier.js
const admin = require("firebase-admin");
const db = admin.firestore();

async function handleShopierWebhook(req, res) {
  try {
    const data = req.body;

    console.log("📩 Shopier Webhook Geldi:", data);

    await db.collection("shopier_orders").add({
      invoice_id: data.invoice_id || null,
      product_name: data.product_name || null,
      buyer_name: data.buyer_name || null,
      buyer_email: data.buyer_email || null,
      status: data.status || null,
      raw: data,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Shopier webhook alındı",
    });

  } catch (err) {
    console.error("Shopier Webhook Error:", err);
    return res.status(500).json({
      success: false,
      error: "Shopier webhook error",
      details: err.message,
    });
  }
}

module.exports = { handleShopierWebhook };
