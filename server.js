const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New user connected.');

  // Broadcast incoming messages to all connected clients
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);

    // Send the message to all connected users except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('User disconnected');
  });
});

console.log('WebSocket server is running on ws://127.0.0.1:8080');
