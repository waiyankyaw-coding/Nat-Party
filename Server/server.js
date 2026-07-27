const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { TikTokLiveConnection } = require('tiktok-live-connector');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Replace with your exact TikTok handle (Must be live when connecting)
const TIKTOK_USERNAME = 'your_tiktok_username';
const tiktokConnection = new TikTokLiveConnection(TIKTOK_USERNAME, {});

tiktokConnection.connect().then(state => {
  console.log(`Connected to TikTok Live Room ID: ${state.roomId}`);
}).catch(err => {
  console.error('Failed to connect to TikTok Live:', err);
});

tiktokConnection.on('gift', (data) => {
  if (data.giftType === 1 && data.repeatEnd === false) return;

  const username = data.uniqueId;
  const giftCoins = data.diamondCount * data.repeatCount;
  const isVIP = giftCoins >= 500;

  io.emit('giftReceived', {
    username,
    isVIP,
    giftCoins,
    giftName: data.giftName,
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});