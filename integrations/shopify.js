// integrations/shopify.js
const axios = require("axios");

async function getShopifyProducts(shopDomain, token) {
  try {
    const url = `https://${shopDomain}/admin/api/2024-10/products.json`;


    const res = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json"
      }
    });

    return res.data;
  } catch (error) {
    console.error("Shopify API ERROR:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getShopifyProducts };
