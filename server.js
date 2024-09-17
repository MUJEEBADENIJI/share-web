const WebSocket = require('ws');

// Start a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected.');

  // Relay signaling messages between clients
  ws.on('message', (message) => {
    console.log('Received:', message);

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
  });
});
