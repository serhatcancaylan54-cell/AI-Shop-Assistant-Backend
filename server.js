// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const admin = require("firebase-admin");
const path = require("path");

const app = express();

// ---------------------------------------------------
// 1) MANUEL CORS HEADER FIX (NGROK + SHOPIFY için şart)
// ---------------------------------------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");  // En garantili çözüm
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Shopify preflight için
  }

  next();
});

// ---------------------------------------------------
// 2) CORS Middleware (geniş izinli)
// ---------------------------------------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));

// ---------------------------------------------------
// FIREBASE ADMIN
// ---------------------------------------------------
const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ---------------------------------------------------
// ROUTES
// ---------------------------------------------------
const integrationsRoutes = require("./routes/integrations");
const emailRoutes = require("./routes/email");

app.use("/api", integrationsRoutes);
app.use("/api", emailRoutes);

// ---------------------------------------------------
// AI (Ollama) ROUTE
// ---------------------------------------------------
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt, storeId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt zorunludur",
      });
    }

    console.log("💬 Gelen Mesaj:", prompt, "| Mağaza:", storeId);

    // AI modeli (Ollama)
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "qwen2.5:3b",
      prompt: `Bu mesaj ${storeId} mağazasına ait bir müşteri için yazılıyor.\nMüşteri sorusu: ${prompt}`,
      stream: false,
    });

    return res.json({
      success: true,
      reply: response.data.response,
    });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    return res.status(500).json({
      success: false,
      error: "AI yanıt üretme hatası",
      details: err.message,
    });
  }
});

// ---------------------------------------------------
// HEALTH CHECK
// ---------------------------------------------------
app.get("/", (req, res) => {
  res.send("AI Shop Assistant API running...");
});

// ---------------------------------------------------
// GLOBAL ERROR HANDLER
// ---------------------------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: err.message,
  });
});

// ---------------------------------------------------
// START SERVER
// ---------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
