<template>
  <div class="file-share">
    <h2>File Sharing</h2>
    
    <!-- File Input -->
    <input type="file" @change="onFileChange" ref="fileInput" multiple />
    
    <!-- Share Button -->
    <button @click="sendFiles" :disabled="files.length === 0">Share Files</button>

    <!-- Display Sent Files -->
    <div v-if="files.length">
      <h3>Files Selected:</h3>
      <ul>
        <li v-for="(file, index) in files" :key="index">{{ file.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [], // Store selected files
      ws: null, // WebSocket instance
    };
  },
  created() {
    // Connect to the WebSocket server
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onmessage = (event) => {
      const blob = new Blob([event.data]);
      const url = URL.createObjectURL(blob);
      this.downloadFile(url);
    };
  },
  methods: {
    // Handle file selection
    onFileChange(event) {
      const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
      this.files = this.files.concat(selectedFiles); // Add selected files to the array
    },
    // Send the selected files
    sendFiles() {
      if (this.files.length > 0) {
        this.files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.ws.send(e.target.result); // Send file data through WebSocket
          };
          reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
        });
        // Optionally, you could clear the selected files after sending
        this.files = []; // Clear the file list after sending
        this.$refs.fileInput.value = ''; // Clear the file input
      } else {
        alert('No files selected for sharing.'); // Message when no files are selected
      }
    },
    // Download received file
    downloadFile(url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'received-file'; // You can dynamically set this to file name
      a.click();
      URL.revokeObjectURL(url); // Clean up
    }
  },
};
</script>

<style scoped>
.file-share {
  text-align: center;
}
</style>
