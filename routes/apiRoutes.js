
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const UserConnection = require('../models/UserConnection');




router.get('/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 }
    ]
  }).sort({ timestamp: 1 });
  res.json(messages);
});

router.get('/online-users', async (req, res) => {
  const users = await UserConnection.find({ isConnected: true });
  res.json(users);
  
});

module.exports = router;