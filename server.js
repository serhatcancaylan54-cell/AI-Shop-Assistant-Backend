const express = require("express");
const cors = require("cors");
const axios = require("axios");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// GOOGLE SERVICE ACCOUNT (ENV’den al)
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ---------------------------
// AI ENDPOINT (WORKS ON VERCEL)
// ---------------------------
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt, storeId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt zorunludur",
      });
    }

    // Şimdilik test amaçlı
    return res.json({
      success: true,
      reply: `AI cevabı → ${prompt}`,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "AI hatası",
      details: err.message,
    });
  }
});

// --------------------------------
// Vercel serverless export
// --------------------------------
module.exports = app;
