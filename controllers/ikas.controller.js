const admin = require("firebase-admin");
const axios = require("axios");
const db = admin.firestore();

// =======================================================
// 1) İKAS API Anahtarlarını Kaydet
// =======================================================

exports.saveIkasKeys = async (req, res) => {
  try {
    const { shopId, apiKey, secretKey } = req.body;

    if (!shopId || !apiKey || !secretKey) {
      return res.status(400).json({
        success: false,
        error: "shopId, apiKey ve secretKey zorunlu",
      });
    }

    await db
      .collection("shops")
      .doc(shopId)
      .collection("integrations")
      .doc("ikas")
      .set({
        apiKey,
        secretKey,
        updatedAt: new Date(),
      });

    return res.json({
      success: true,
      message: "İKAS API bilgileri kaydedildi",
    });

  } catch (err) {
    console.log("IKAS SAVE ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// =======================================================
// 2) İKAS Ürünlerini Çekme API
// =======================================================

exports.fetchIkasProducts = async (req, res) => {
  try {
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: "shopId zorunlu",
      });
    }

    // Firestore’dan İKAS API keyleri çek
    const ikasDoc = await db
      .collection("shops")
      .doc(shopId)
      .collection("integrations")
      .doc("ikas")
      .get();

    if (!ikasDoc.exists) {
      return res.status(400).json({
        success: false,
        error: "Bu mağaza için İKAS API bilgisi bulunamadı",
      });
    }

    const { apiKey, secretKey } = ikasDoc.data();

    // =======================================================
    // İKAS API → Ürün Listesini Çek
    // =======================================================

    const response = await axios.get("https://api.ikas.com/v1/products", {
      headers: {
        "X-Ikas-Api-Key": apiKey,
        "X-Ikas-Api-Secret": secretKey,
      },
    });

    const products = response.data.items || [];

    // =======================================================
    // Firestore’a kaydet
    // =======================================================

    const batch = db.batch();
    const ref = db.collection("shops").doc(shopId).collection("products");

    products.forEach((item) => {
      batch.set(ref.doc(item.id.toString()), item);
    });

    await batch.commit();

    return res.json({
      success: true,
      count: products.length,
      products,
    });

  } catch (err) {
    console.log("IKAS FETCH ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};
