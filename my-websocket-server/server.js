// server.js
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set(); // To keep track of connected clients

wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    ws.on('message', (message) => {
        // Broadcast incoming messages to all clients
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

// Serve your static files if necessary
app.use(express.static('public')); // Assuming your frontend is in a 'public' folder

server.listen(8080, () => {
    console.log('WebSocket server is listening on ws://localhost:8080');
});
