// controllers/ai.controller.js

const axios = require("axios");

// =========================================
// HEPSIBURADA AI ASSISTANT (Local AI - Ollama)
// =========================================
exports.hepsiburadaAssistant = async (req, res) => {
  try {
    const { shopId, message } = req.body;

    if (!shopId || !message) {
      return res.status(400).json({
        success: false,
        error: "shopId ve message zorunludur"
      });
    }

    // --------------------------
    // OLLAMA LOCAL AI REQUEST
    // --------------------------
    const ollamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "qwen2.5:7b-instruct", // ← MODEL ADI BURASI
        prompt: `
Sen bir mağaza asistanısın. Müşteriye gerçek bir tezgahtar gibi yardımcı ol.
Kullanıcının sorusu: "${message}"
Cevabı samimi, kısa ve yardımcı şekilde ver.
        `,
        stream: false
      },
      {
        timeout: 20000
      }
    );

    const aiText =
      ollamaResponse?.data?.response || "Cevap üretilemedi.";

    return res.json({
      success: true,
      reply: aiText
    });

  } catch (err) {
    console.error("🛑 AI ERROR:", err.message);

    return res.status(500).json({
      success: false,
      reply: "Cevap üretilemedi."
    });
  }
};
