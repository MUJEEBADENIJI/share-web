<template>
    <div>
      <button @click="startConnection">Start WebRTC Connection</button>
      <input v-model="message" placeholder="Type message" />
      <button @click="sendMessage">Send Message</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        peerConnection: null,
        dataChannel: null,
        websocket: null,
        message: "",
      };
    },
    methods: {
      async startConnection() {
        // Setup WebSocket signaling
        this.websocket = new WebSocket('ws://localhost:8080');
        
        this.websocket.onmessage = async (event) => {
          const message = JSON.parse(event.data);
  
          if (message.type === 'offer') {
            await this.peerConnection.setRemoteDescription(message.offer);
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.websocket.send(JSON.stringify({ type: 'answer', answer }));
          }
  
          if (message.type === 'answer') {
            await this.peerConnection.setRemoteDescription(message.answer);
          }
  
          if (message.type === 'ice-candidate') {
            await this.peerConnection.addIceCandidate(message.candidate);
          }
        };
  
        // Setup WebRTC peer connection
        this.peerConnection = new RTCPeerConnection();
  
        // Setup data channel
        this.dataChannel = this.peerConnection.createDataChannel('chat');
        this.dataChannel.onmessage = (event) => {
          console.log('Received:', event.data);
        };
  
        // Send ICE candidates via WebSocket
        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.websocket.send(JSON.stringify({
              type: 'ice-candidate',
              candidate: event.candidate,
            }));
          }
        };
  
        // Create an offer to start the connection
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.websocket.send(JSON.stringify({ type: 'offer', offer }));
      },
  
      sendMessage() {
        this.dataChannel.send(this.message);
        console.log('Sent:', this.message);
      },
    },
  };
  </script>
  