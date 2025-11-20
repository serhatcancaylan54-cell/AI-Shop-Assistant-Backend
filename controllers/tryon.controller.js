const axios = require("axios");

exports.tryOn = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: "imageBase64 zorunlu",
      });
    }

    const prompt = `
You are a professional fashion try-on AI.
Analyze the uploaded clothing image.
Return ONLY valid JSON.
    `;

    const ollamaRes = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llava",
        prompt,
        images: [imageBase64],
        format: "json",
        stream: false,
      },
      { timeout: 120000 }
    );

    const raw = ollamaRes.data?.response;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.json({
        success: false,
        error: "Model geçerli JSON döndürmedi",
        raw,
      });
    }

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (err) {
    console.log("TRYON ERROR:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
