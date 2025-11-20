const express = require("express");
const router = express.Router();

const { 
  saveIkasKeys,
  fetchIkasProducts
} = require("../controllers/ikas.controller");

// İKAS API Key kaydetme
router.post("/save-keys", saveIkasKeys);

// İKAS ürünlerini çekme
router.post("/fetch-products", fetchIkasProducts);

module.exports = router;
