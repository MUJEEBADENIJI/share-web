<template>
  <div class="file-share">
    <h2>File Sharing</h2>

    <!-- Navigation Pills for Share and Receive Buttons -->
    <ul class="nav nav-pills justify-content-center">
      <li class="nav-item">
        <!-- Share Files Pill -->
        <a
          class="nav-link"
          :class="{ active: isActive === 'share' }"
          @click="generateOffer"
        >
          Share Files
        </a>
      </li>
      <li class="nav-item">
        <!-- Receive Files Pill -->
        <a
          class="nav-link"
          :class="{ active: isActive === 'receive' }"
          @click="startReceiving"
        >
          Receive Files
        </a>
      </li>
    </ul>

    <!-- Display QR code after generating an offer -->
    <div v-if="qrCodeData" class="qr-code-container">
      <h3>Scan this QR Code to Connect:</h3>
      <canvas ref="qrCanvas"></canvas>
    </div>

    <!-- Hidden File Input for selecting files -->
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      style="display: none;"
      multiple
    />
  </div>
</template>


import QRCode from 'qrcode';

export default {
  data() {
    return {
      isActive: '', // Track active state (either 'share' or 'receive')
      files: [],    // Store selected files
      peerConnection: null, // WebRTC peer connection instance
      ws: null,     // WebSocket instance
      qrCodeData: null, // Store QR code data
    };
  },
  methods: {
    // Generate WebRTC offer when "Share Files" is clicked
    async generateOffer() {
      this.isActive = 'share'; // Mark "Share Files" as active
      
      // Create a new WebRTC peer connection
      this.peerConnection = new RTCPeerConnection();
      
      // Generate the offer for WebRTC connection
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      // Generate a QR code with the offer
      this.qrCodeData = offer.sdp;
      this.generateQRCode(this.qrCodeData);
    },

    // Generate the QR code for the offer
    generateQRCode(data) {
      const canvas = this.$refs.qrCanvas;
      QRCode.toCanvas(canvas, data, function (error) {
        if (error) console.error(error);
        console.log('QR code generated!');
      });
    },

    // Trigger file selection dialog when "Share Files" is clicked
    selectFiles() {
      this.$refs.fileInput.click(); // Open file dialog
    },

    // Handle selected files and trigger sending them via WebSocket
    onFileChange(event) {
      const selectedFiles = Array.from(event.target.files); // Get selected files
      this.files = selectedFiles; // Store the selected files
      this.sendFiles(); // Send files after selection
    },

    // Send selected files via WebSocket
    sendFiles() {
      if (this.files.length > 0) {
        this.files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.ws.send(e.target.result); // Send file data through WebSocket
          };
          reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
        });
      } else {
        alert('No files selected for sharing.');
      }
    },

    // Start receiving files (this sets the app into a receiving state)
    startReceiving() {
      this.isActive = 'receive'; // Mark "Receive Files" as active
      alert('Ready to receive files.');
    }
  }
};


<style scoped>
.file-share {
  text-align: center;
  margin-top: 240px;
  margin-left: 35px;
  margin-right: 35px;
}

.nav-pills .nav-link {
  margin: 10px;
  padding: 10px 30px;
  font-size: 16px;
  cursor: pointer;
}

.nav-pills .nav-link.active {
  background-color: #007bff; /* Bootstrap's primary color for active state */
  color: white;
}

/* Add spacing around the QR code */
.qr-code-container {
  margin-top: 20px;
}
</style>
