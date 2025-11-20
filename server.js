const express = require("express");
const cors = require("cors");
const axios = require("axios");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// Firebase
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// TEST API ROUTE
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend çalışıyor!" });
});

// AI ROUTE
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    return res.json({
      success: true,
      reply: "AI çalışıyor. Mesaj: " + prompt,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Vercel export
module.exports = app;
