// routes/email.js
const express = require("express");
const router = express.Router();
const { checkShopierEmails } = require("../integrations/email");

// Geçici test endpoint'i:
// POST /api/email/test-shopier
// Body:
// {
//   "host": "imap.gmail.com",
//   "port": 993,
//   "secure": true,
//   "user": "mailadresin",
//   "password": "sifreVeyaAppPassword"
// }
router.post("/email/test-shopier", async (req, res) => {
  try {
    const { host, port, secure, user, password } = req.body;

    if (!host || !port || secure === undefined || !user || !password) {
      return res.status(400).json({
        success: false,
        error: "host, port, secure, user, password zorunludur"
      });
    }

    await checkShopierEmails({ host, port, secure, user, password });

    return res.json({
      success: true,
      message: "Shopier mailleri kontrol edildi, uygun olanlar Firestore'a kaydedildi."
    });
  } catch (err) {
    console.error("Email test error:", err);
    return res.status(500).json({
      success: false,
      error: "Email kontrol sırasında hata oluştu",
      details: err.message
    });
  }
});

module.exports = router;
