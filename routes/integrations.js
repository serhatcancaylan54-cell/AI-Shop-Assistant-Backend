// routes/integrations.js
const express = require("express");
const router = express.Router();

const { getShopifyProducts } = require("../integrations/shopify");
const { handleShopierWebhook } = require("../integrations/shopier");

// ----------------------------------------------------
// SHOPIFY ÜRÜN ÇEKME
// ----------------------------------------------------
router.get("/shopify/products", async (req, res) => {
  try {
    const { shopDomain, token } = req.query;

    if (!shopDomain || !token) {
      return res.status(400).json({
        success: false,
        error: "shopDomain ve token zorunludur",
      });
    }

    const products = await getShopifyProducts(shopDomain, token);

    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Shopify ürünleri alınamadı",
      details: err.response?.data || err.message,
    });
  }
});

// ----------------------------------------------------
// SHOPIER WEBHOOK
// ----------------------------------------------------
router.post("/shopier/webhook", handleShopierWebhook);

module.exports = router;
