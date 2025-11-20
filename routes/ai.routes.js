// routes/ai.routes.js
const express = require("express");
const router = express.Router();

const { hepsiburadaAssistant } = require("../controllers/ai.controller.js");

router.post("/hepsiburada-assistant", hepsiburadaAssistant);

module.exports = router;
