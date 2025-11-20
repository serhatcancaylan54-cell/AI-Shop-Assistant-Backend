// controllers/trendyol.controller.js

const axios = require("axios");
const admin = require("firebase-admin");
const db = admin.firestore();

/**
 * TRENDYOL API KEY SAVE
 */
exports.saveTrendyolKeys = async (req, res) => {
  try {
    const { supplierId, username, password } = req.body;

    if (!supplierId || !username || !password) {
      return res.status(400).json({
        success: false,
        error: "supplierId, username ve password zorunlu",
      });
    }

    await db.collection("trendyolIntegration").doc("keys").set({
      supplierId,
      username,
      password,
      updatedAt: Date.now(),
    });

    return res.json({
      success: true,
      message: "Trendyol API bilgileri kaydedildi",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * TRENDYOL PRODUCTS
 */
exports.getProducts = async (req, res) => {
  try {
    const doc = await db.collection("trendyolIntegration").doc("keys").get();

    if (!doc.exists) {
      return res.status(400).json({
        success: false,
        error: "API keys not found",
      });
    }

    const { supplierId, username, password } = doc.data();

    const auth = Buffer.from(`${username}:${password}`).toString("base64");

    // TRENDYOL API endpoint (doğru & zorunlu parametreli)
    const url = `https://api.trendyol.com/sapigw/suppliers/${supplierId}/products?approved=true&page=0&size=50`;

    console.log("TRENDYOL URL:", url);

    const result = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        "User-Agent": "AI-Shop-Assistant",
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });

    return res.json({
      success: true,
      rawResponse: result.data,
      status: result.status,
      headers: result.headers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
