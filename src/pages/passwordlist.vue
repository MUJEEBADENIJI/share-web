<template>
  <div class="container mt-5">
    <h2 class="text-center">Saved Passwords</h2>

    <!-- Success or error message -->
    <div v-if="message" class="alert" :class="{'alert-success': isSuccess, 'alert-danger': !isSuccess}" role="alert">
      {{ message }}
    </div>
    <br>

    <ul class="list-group">
      <li class="list-group-item" v-for="(password, index) in passwords" :key="index">
        <div>
          <h4>{{ password.title }}</h4>
          <p><strong>Username:</strong> {{ password.username }}</p>
          <p><strong>Password:</strong> {{ decryptedPassword(password.password) }}</p>
        </div>
        <div class="btn-group">
          <button @click="openEditModal(password)" class="btn btn-secondary">Edit</button>
          <button @click="deletePassword(password.id, index)" class="btn btn-danger">Delete</button>
        </div>
      </li>
    </ul>

    <!-- Edit Password Modal -->
    <b-modal id="editPasswordModal" title="Edit Password" @hide="resetPasswordToEdit" @ok="updatePassword">
      <form @submit.prevent="updatePassword">
        <div class="form-group">
          <label for="editTitle">Title</label>
          <input v-model="passwordToEdit.title" id="editTitle" type="text" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="editUsername">Username</label>
          <input v-model="passwordToEdit.username" id="editUsername" type="text" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="editPassword">Password</label>
          <input v-model="passwordToEdit.password" id="editPassword" type="password" class="form-control" required />
        </div>
           <!-- Submit Button -->
        <button type="submit" class="btn btn-primary">Save Changes</button>
      </form>
    </b-modal>

    <router-link to="/password-manager" class="btn btn-link mt-3">Back to Password Manager</router-link>
  </div>
  <br>
  <br>
  <br>
  <br>
  <br>
</template>

<script>
import { ref, onMounted } from 'vue';
import { openDB } from 'idb';
import CryptoJS from 'crypto-js';

export default {
  setup() {
    const passwords = ref([]);
    const passwordToEdit = ref({
      title: '',
      username: '',
      password: '',
      id: null
    });
    const message = ref('');
    const isSuccess = ref(false);
    const encryptionKey = 'ManagerOnLock'; // Hardcoded key for now

    const dbPromise = openDB('passwordManagerDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('passwords')) {
          db.createObjectStore('passwords', { keyPath: 'id', autoIncrement: true });
        }
      }
    });

    onMounted(async () => {
      const db = await dbPromise;
      passwords.value = await db.getAll('passwords');
    });

    const openEditModal = (password) => {
      passwordToEdit.value = { ...password }; // Clone the password for editing
      this.$refs.editPasswordModal.show();
    };

    const updatePassword = async () => {
      const db = await dbPromise;
      try {
        const encryptedPassword = CryptoJS.AES.encrypt(passwordToEdit.value.password, encryptionKey).toString();
        await db.put('passwords', { ...passwordToEdit.value, password: encryptedPassword });
        const index = passwords.value.findIndex(p => p.id === passwordToEdit.value.id);
        if (index !== -1) {
          passwords.value.splice(index, 1, { ...passwordToEdit.value });
        }
        this.$refs.editPasswordModal.hide();
        message.value = 'Password updated successfully';
        isSuccess.value = true;
      } catch (error) {
        console.error('Failed to update password', error);
        message.value = 'Error updating password';
        isSuccess.value = false;
      }
      setTimeout(() => { message.value = ''; }, 3000);
    };

    const deletePassword = async (id, index) => {
      const db = await dbPromise;
      try {
        await db.delete('passwords', id);
        passwords.value.splice(index, 1);
        message.value = 'Password deleted successfully';
        isSuccess.value = true;
      } catch (error) {
        console.error('Failed to delete password', error);
        message.value = 'Error deleting password';
        isSuccess.value = false;
      }
      setTimeout(() => { message.value = ''; }, 3000);
    };

    const decryptedPassword = (encryptedPassword) => {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
      } catch {
        return 'Error decrypting';
      }
    };

    const resetPasswordToEdit = () => {
      passwordToEdit.value = {
        title: '',
        username: '',
        password: '',
        id: null
      };
    };

    return {
      passwords,
      passwordToEdit,
      openEditModal,
      updatePassword,
      deletePassword,
      decryptedPassword,
      message,
      isSuccess,
      resetPasswordToEdit
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

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-group {
  margin-top: 1rem;
}
</style>
