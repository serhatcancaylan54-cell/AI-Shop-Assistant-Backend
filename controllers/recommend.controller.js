const axios = require("axios");

exports.textRecommend = async (req, res) => {
  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({
        success: false,
        error: "item zorunlu",
      });
    }

    const prompt = `
You are a professional fashion stylist AI.
User gives a clothing item description. 
Based on this give ONLY valid JSON:

{
  "category": "",
  "style": "",
  "vibe": "",
  "suggestions": []
}

NO explanation. NO extra text.
Item: "${item}"
`;

    const result = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llava",
        prompt,
        stream: false,
      }
    );

    let raw = result.data.response;

    let jsonData = {};
    try {
      jsonData = JSON.parse(raw);
    } catch (err) {
      return res.json({
        success: false,
        error: "Geçerli JSON değil",
        raw,
      });
    }

    return res.json({
      success: true,
      data: jsonData,
    });

  } catch (err) {
    console.log("TEXT RECOMMEND ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
