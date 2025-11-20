// routes/hepsiburada.routes.js

const express = require("express");
const router = express.Router();

const {
  getProducts,
  getOrders,
  getOrderDetail
} = require("../controllers/hepsiburada.controller.js");

router.get("/products", getProducts);
router.get("/orders", getOrders);
router.get("/order/:id", getOrderDetail);

module.exports = router;
