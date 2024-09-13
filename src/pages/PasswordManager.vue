<template>
  <div class="container mt-5">
    <h2 class="text-center">Add New Password</h2>

     <!-- Success or error message -->
     <div v-if="message" class="alert" :class="{'alert-success': isSuccess, 'alert-danger': !isSuccess}" role="alert">
      {{ message }}
    </div>
    <br>

    <form @submit.prevent="addPassword" class="password-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="newPassword.title" id="title" type="text" class="form-control" placeholder="Enter a title" required />
      </div>

      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="newPassword.username" id="username" type="text" class="form-control" placeholder="Enter your username" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="newPassword.password" id="password" type="password" class="form-control" placeholder="Enter your password" required />
      </div>

      <button type="submit" class="btn btn-primary btn-block black">Add Password</button>
    </form>

    <button class="btn btn-link mt-3" @click="goToPasswordList">View Saved Passwords</button>
    <!-- Button to go to the Password Generator page -->
    <router-link to="/Suggestbox" class="btn btn-primary mt-3">Go to Password Generator</router-link>

  
  </div>
</template>

<script>
import { ref } from 'vue';
import { openDB } from 'idb';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';

export default {
  setup() {
    const router = useRouter();
    const encryptionKey = 'ManagerOnLock';
    const newPassword = ref({
      title: '',
      username: '',
      password: ''
    });

    const message = ref(''); // Message to show success or error
    const isSuccess = ref(false); // Track if message is success or error

    const dbPromise = openDB('passwordManagerDB', 1, {
      upgrade(db) {
        db.createObjectStore('passwords', { keyPath: 'id', autoIncrement: true });
      }
    });

    async function addPassword() {
      const db = await dbPromise;
      try {
           // Encrypt the password before saving
        const encryptedPassword = CryptoJS.AES.encrypt(newPassword.value.password, encryptionKey).toString();

        await db.put('passwords', {
          title: newPassword.value.title,
          username: newPassword.value.username,
          password: encryptedPassword // Save the encrypted password
        });
        message.value = 'Password added successfully'; // Set success message
        isSuccess.value = true;
        newPassword.value = { title: '', username: '', password: '' }; // Clear the form
      } catch (error) {
        console.error('Failed to add password', error);
        message.value = 'Error adding password'; // Set error message
        isSuccess.value = false;
      }

      // Hide message after 3 seconds
      setTimeout(() => {
        message.value = '';
      }, 3000);
    }

    function goToPasswordList() {
      router.push('/password-list');
    }

    return {
      newPassword,
      addPassword,
      goToPasswordList,
      message,
      isSuccess
    };
  }
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

.alert {
  margin-top: 20px;
}

.black{
  background-color: grey;
  border: 1px solid white;
}
</style>
