<template>
  <div class="container mt-5">
    <h2 class="text-center">Create a New Group</h2>
    
    <!-- Group Name Input -->
    <div class="form-group">
      <label for="groupName">Group Name:</label>
      <input v-model="groupName" id="groupName" type="text" class="form-control" placeholder="Enter group name" required />
    </div>

    <!-- Group Profile Picture Input -->
    <div class="form-group">
      <label for="profilePic">Group Profile Picture:</label>
      <input @change="onFileChange" id="profilePic" type="file" class="form-control-file" />
    </div>

    <!-- Button to Create Group -->
    <button @click="createGroup" class="btn btn-primary mt-3">Create Group</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupName: '',
      profilePicture: null,
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profilePicture = e.target.result; // Convert image to base64
        };
        reader.readAsDataURL(file);
      }
    },

    createGroup() {
      // Check if Wi-Fi is active before creating the group
      if ('connection' in navigator) {
        const connectionType = navigator.connection.type;

        if (connectionType !== 'wifi') {
          alert("Please turn on your Wi-Fi or Hotspot to create a group.");
          return; // Prevent group creation if not on Wi-Fi
        } 
      }

      if (this.groupName) {
        // Redirect to the ChatRoom with groupName as a route parameter and profilePic as a query parameter
        this.$router.push({
          name: 'ChatRoom',
          params: { groupName: this.groupName },
          query: { profilePic: this.profilePicture }
        });
      } else {
        alert('Please enter a group name.');
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.mt-5 {
  margin-top: 3rem;
}
</style>
