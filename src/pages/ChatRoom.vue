<template>
  <div class="chat-container">
    <!-- Left div: Group info and active users -->
    <div class="left-panel">
      <div class="group-info">
        <img :src="profilePic" alt="Group Profile Picture" class="profile-pic" v-if="profilePic" />
        <h5>{{ groupName }}</h5>
      </div>
      <hr />
      <div class="active-users">
        <h6>Active Users</h6>
        <ul>
          <!-- Assuming you have an array of active users -->
          <li v-for="user in activeUsers" :key="user.id">
            {{ user.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Right div: Chat area -->
    <div class="right-panel">
      <div class="messages-display">
        <!-- Ongoing messages -->
        <div v-for="message in messages" :key="message.id" class="message">
          <strong>{{ message.sender }}:</strong> {{ message.content }}
        </div>
      </div>

      <!-- Input area for new messages -->
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
      activeUsers: [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
        { id: 3, name: 'User3' }
      ],
      messages: [
        { id: 1, sender: 'User1', content: 'Hello there!' },
        { id: 2, sender: 'User2', content: 'Hi!' }
      ],
      newMessage: ''
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage) {
        this.messages.push({
          id: this.messages.length + 1,
          sender: 'You',
          content: this.newMessage
        });
        this.newMessage = '';
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
  margin-bottom: 200px;
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
