const admin = require("../firebase");
const db = admin.firestore();

// MAĞAZA AYARLARI KAYDET
exports.updateShopSettings = async (req, res) => {
  try {
    const { shopId, aiPrompt } = req.body;

    if (!shopId) {
      return res.status(400).json({ error: "shopId required" });
    }

    await db.collection("shops").doc(shopId).set(
      {
        aiPrompt: aiPrompt || "",
      },
      { merge: true }
    );

    res.json({ success: true, message: "Ayar kaydedildi" });
  } catch (err) {
    console.error("Shop settings error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// MAĞAZA AYARLARI GETİR
exports.getShopSettings = async (req, res) => {
  try {
    const { shopId } = req.params;

    const doc = await db.collection("shops").doc(shopId).get();
    if (!doc.exists) {
      return res.json({ aiPrompt: "" });
    }

    res.json(doc.data());
  } catch (err) {
    console.error("Get shop settings error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
