const express = require("express");
const router = express.Router();

// 🔥 DOĞRU IMPORT → controller ismi: tryon.controller.js
const { tryOn } = require("../controllers/tryon.controller");

router.post("/analyze", tryOn);

module.exports = router;
