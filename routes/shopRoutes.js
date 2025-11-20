const router = require('express').Router();
const { updateShopSettings, getShopSettings } = require('../controllers/shopSettingsController');

// Mağaza ayarı kaydetme
router.post('/shop/settings', updateShopSettings);

// Mağaza ayarı çekme
router.get('/shop/settings/:shopId', getShopSettings);

module.exports = router;
