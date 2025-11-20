// routes/trendyol.routes.js

const express = require("express");
const router = express.Router();

// DOSYA UZANTISI ZORUNLU! (.js)
const { saveTrendyolKeys, getProducts } = require("../controllers/trendyol.controller.js");

router.post("/save-keys", saveTrendyolKeys);
router.get("/products", getProducts);

module.exports = router;
