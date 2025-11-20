const express = require("express");
const router = express.Router();

// 🔥 DOĞRU OLAN BU:
const { sendMessage } = require("../controllers/chat.controller");

router.post("/send", sendMessage);

module.exports = router;
