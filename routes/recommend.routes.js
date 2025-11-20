const express = require("express");
const router = express.Router();

const { textRecommend } = require("../controllers/recommend.controller");

router.post("/text", textRecommend);   // sadece metin tabanlı öneri

module.exports = router;
