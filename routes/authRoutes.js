// backend/routes/chatRoutes.js
const router = require('express').Router();
const {
  handleChat,
  handleImageChat,
  getConversations,
} = require('../controllers/chatController');

// Normal metin sohbeti
router.post('/chat', handleChat);

// Görsel analiz (image chat)
router.post('/chat/image', handleImageChat);

// Konuşma geçmişi
router.get('/conversations/:shopId', getConversations);

module.exports = router;
