
const { redis, pub, sub } = require('../utils/redisClient');
const Message = require('../models/Message');
const UserConnection = require('../models/UserConnection');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');

const instanceId = uuidv4();
const connectedUsers = new Map();

function setupWebSocketServer(wss) {

  sub.pSubscribe('chat:*', async (message, channel) => {
    const [, userId] = channel.split(':');
    const ws = connectedUsers.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });


  wss.on('connection', (ws) => {
    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data);

        if (msg.type === 'register') {
          const { userId } = msg;
          ws.userId = userId;
          connectedUsers.set(userId, ws);
          await redis.set(`connected:${userId}`, instanceId);

          await UserConnection.updateOne(
            { userId },
            { isConnected: true, connectedServer: instanceId, lastSeen: new Date() },
            { upsert: true }
          );
          console.log(`User ${userId} connected`);
        }

        if (msg.type === 'chat') {
          const { senderId, receiverId, message } = msg;
          const chatMessage = new Message({ senderId, receiverId, message });
          await chatMessage.save();

          await pub.publish(`chat:${receiverId}`, JSON.stringify({
            from: senderId,
            message,
            timestamp: new Date()
          }));
        }

      } catch (err) {
        console.error('WebSocket error:', err);
      }
    });

    ws.on('close', async () => {
      const userId = ws.userId;
      if (userId) {
        connectedUsers.delete(userId);
        await redis.del(`connected:${userId}`);
        await UserConnection.updateOne(
          { userId },
          { isConnected: false, lastSeen: new Date() }
        );
        console.log(`User ${userId} disconnected`);
      }
    });
  });
}

module.exports = { setupWebSocketServer };
