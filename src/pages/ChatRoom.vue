<template>
  <div class="chat-container">
    <div class="left-panel">
      <div class="group-info">
        <img :src="profilePic" alt="Group Profile Picture" class="profile-pic" v-if="profilePic" />
        <h5>{{ groupName }}</h5>
      </div>
      <hr />
      <div class="active-users">
        <h6>Active Users</h6>
        <!-- Placeholder for active users -->
      </div>
    </div>

    <div class="right-panel">
      <div class="messages-display">
        <div v-for="message in messages" :key="message.id" class="message">
          <strong>{{ message.sender }}:</strong> {{ message.content }}
        </div>
      </div>

      <div class="message-input">
        <input v-model="newMessage" type="text" placeholder="Type your message here" />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['groupName', 'profilePic'],
  data() {
    return {
      messages: [],
      newMessage: '',
      ws: null,
      rtcPeerConnection: null,
      localStream: null
    };
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
      // Initialize WebSocket connection to signaling server
      this.ws = new WebSocket('ws://localhost:8080');
      this.ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        this.handleSignalData(data);
      };

      // Initialize WebRTC peer connection
      this.initWebRTC();
    },

    initWebRTC() {
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' } // Using Google's STUN server
        ]
      };
      this.rtcPeerConnection = new RTCPeerConnection(configuration);

      // Handle ICE candidates
      this.rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      };

      // Handle remote stream
      this.rtcPeerConnection.ontrack = (event) => {
        console.log('Receiving track:', event.streams[0]);
        // Handle receiving remote stream, e.g., display remote video
      };
    },

    async sendMessage() {
      if (this.newMessage) {
        // Send the message through WebSocket to other peers
        const message = {
          sender: 'You', // You can change this with actual user data
          content: this.newMessage
        };
        this.messages.push(message);
        this.ws.send(JSON.stringify(message)); // Send via WebSocket

        this.newMessage = '';
      }
    },

    async handleSignalData(data) {
      // Handle different types of signaling data
      if (data.type === 'offer') {
        await this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await this.rtcPeerConnection.createAnswer();
        await this.rtcPeerConnection.setLocalDescription(answer);
        this.ws.send(JSON.stringify({ type: 'answer', answer }));
      } else if (data.type === 'answer') {
        await this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.type === 'candidate') {
        await this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    },

    async createOffer() {
      const offer = await this.rtcPeerConnection.createOffer();
      await this.rtcPeerConnection.setLocalDescription(offer);
      this.ws.send(JSON.stringify({ type: 'offer', offer }));
    },

    async addLocalStream() {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.localStream.getTracks().forEach((track) => {
          this.rtcPeerConnection.addTrack(track, this.localStream);
        });
      } catch (error) {
        console.error('Error accessing local media:', error);
      }
    }
  }
};
</script>



<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
}

.left-panel {
  width: 25%;
  border-right: 1px solid #ccc;
  padding: 20px;
}

.group-info {
  text-align: center;
}

.profile-pic {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.active-users {
  margin-top: 20px;
}

.right-panel {
  width: 75%;
  display: flex;
  flex-direction: column;
}

.messages-display {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;

}

.message-input {
  display: flex;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ccc;
  margin-bottom: 150px;
}

.message-input input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.message-input button {
  margin-left: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.message {
  margin-bottom: 10px;
}

.message strong {
  color: #007bff;
}
</style>
