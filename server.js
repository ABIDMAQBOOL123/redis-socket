// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');
// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');
// const { setupWebSocketServer } = require('./ws/websocketServer');
// const apiRoutes = require('./routes/apiRoutes');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
// const PORT = 3001;

// mongoose.connect('mongodb://localhost:27017/chat-app')
//   .then(() => console.log('MongoDB connected'))
//   .catch(console.error);

// app.use(express.json());

// app.use('/api', apiRoutes);

// setupWebSocketServer(wss);

// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { setupWebSocketServer } = require("./ws/websocketServer");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3001;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/chat-app";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.use(express.json());
app.use("/api", apiRoutes);

setupWebSocketServer(wss);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
