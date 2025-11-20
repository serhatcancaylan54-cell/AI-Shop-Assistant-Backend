const axios = require("axios");

exports.sendMessage = async (req, res) => {
  try {
    const { message, storePrompt } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Mesaj eksik.",
      });
    }

    const prompt = `
Mağaza Persona:
${storePrompt || "Genel mağaza"}

Kullanıcı Mesajı:
${message}

Mağaza asistanı olarak kısa, net ve yardımcı şekilde cevap ver.
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const aiText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Bir hata oluştu.";

    return res.json({
      success: true,
      reply: aiText,
    });
  } catch (err) {
    console.error("CHAT ERROR:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
