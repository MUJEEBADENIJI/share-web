<template>
  <div class="file-share">
    <h2>File Sharing</h2>

    <!-- Navigation Pills for Share and Receive Buttons -->
    <ul class="nav nav-pills justify-content-center">
      <li class="nav-item">
        <a
          class="nav-link file-button"
          :class="{ active: isActive === 'share' }"
          @click="selectFiles"
        >
          Share Files
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link file-button"
          :class="{ active: isActive === 'receive' }"
          @click="startReceiving"
        >
          Receive Files
        </a>
      </li>
    </ul>

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

<script>
export default {
  data() {
    return {
      isActive: '', // Track active state (either 'share' or 'receive')
      files: [],    // Store selected files
      ws: null,     // WebSocket instance
    };
  },
  created() {
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onmessage = (event) => {
      const blob = new Blob([event.data]);
      const url = URL.createObjectURL(blob);
      this.downloadFile(url);
    };
  },
  methods: {
    selectFiles() {
      this.isActive = 'share';
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const selectedFiles = Array.from(event.target.files);
      this.files = selectedFiles;
      this.sendFiles();
    },
    sendFiles() {
      if (this.files.length > 0) {
        this.files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.ws.send(e.target.result);
          };
          reader.readAsArrayBuffer(file);
        });
      } else {
        alert('No files selected for sharing.');
      }
    },
    startReceiving() {
      this.isActive = 'receive';
      alert('Ready to receive files.');
    },
    downloadFile(url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'received-file';
      a.click();
      URL.revokeObjectURL(url);
    }
  }
};
</script>

<style scoped>
.file-share {
  text-align: center;
  margin-top: 240px;
}

.nav-pills .file-button {
  border-radius: 50px;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #007bff; /* Blue color */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.nav-pills .file-button:hover {
  transform: scale(1.05);
}

.nav-pills .file-button.active {
  background-color: #0056b3; /* Darker blue for active state */
}

.nav-pills .nav-link:not(.active) {
  background-color: #007bff; /* Reset background color for inactive links */
}
</style>
