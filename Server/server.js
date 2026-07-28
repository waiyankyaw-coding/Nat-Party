const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { TikTokLiveConnection } = require('tiktok-live-connector');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const TIKTOK_USERNAME = 'your_tiktok_username';
const tiktokConnection = new TikTokLiveConnection(TIKTOK_USERNAME, {});

tiktokConnection.connect().then(state => {
  console.log(`Connected to TikTok Live Room ID: ${state.roomId}`);
}).catch(err => {
  console.error('Failed to connect to TikTok Live:', err);
});

// 1. Trigger when a user joins the live stream
tiktokConnection.on('member', (data) => {
  // Extract correct fields based on your payload structure
  const username = data.user?.nickname || data.uniqueId || 'Viewer';
  const avatarUrl = data.user?.avatarThumb?.urlList?.[0] || '';

  console.log(`User joined -> Name: ${username}, Avatar: ${avatarUrl ? 'Found' : 'Missing'}`);

  io.emit('userJoined', {
    username,
    avatarUrl,
    isVIP: false,
  });
});

// 2. Trigger when a gift is received
tiktokConnection.on('gift', (data) => {
  if (data.giftType === 1 && data.repeatEnd === false) return;

  const username = data.user?.nickname || data.uniqueId || 'Gifter';
  const avatarUrl = data.user?.avatarThumb?.urlList?.[0] || '';
  const giftCoins = data.diamondCount * data.repeatCount;
  const isVIP = giftCoins >= 500;

  console.log(`Gift received -> Name: ${username}, Coins: ${giftCoins}, VIP: ${isVIP}`);

  io.emit('userJoined', {
    username,
    avatarUrl,
    isVIP,
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});