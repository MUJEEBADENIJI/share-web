<template>
  <div class="container mt-5">
    <h2 class="text-center">{{ isEditing ? 'Edit Password' : 'Add New Password' }}</h2>
    <form @submit.prevent="isEditing ? updatePassword() : addPassword()" class="password-form">
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

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea v-model="newPassword.notes" id="notes" class="form-control" placeholder="Additional notes (optional)"></textarea>
      </div>

      <button type="submit" class="btn btn-secondary btn-block">{{ isEditing ? 'Update Password' : 'Add Password' }}</button>
    </form>

    <!-- Password List -->
    <div class="mt-5">
      <h2 class="text-center">Passwords</h2>
      <ul class="list-group">
        <li class="list-group-item" v-for="(password, index) in passwords" :key="index">
          <div>
            <h4>{{ password.title }}</h4>
            <p><strong>Username:</strong> {{ password.username }}</p>
            <p><strong>Password:</strong> {{ password.password }}</p>
            <p><strong>Notes:</strong> {{ password.notes }}</p>
          </div>
          <div class="btn-group">
            <button @click="editPassword(index)" class="btn btn-secondary">Edit</button>
            <button @click="deletePassword(index)" class="btn btn-danger">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { openDB } from 'idb';

export default {
  name: 'PasswordManager',
  setup() {
    const dbPromise = openDB('passwordManagerDB', 1, {
      upgrade(db) {
        db.createObjectStore('passwords', { keyPath: 'id', autoIncrement: true });
      }
    });

    const passwords = ref([]);
    const newPassword = ref({
      title: '',
      username: '',
      password: '',
      notes: ''
    });
    const isEditing = ref(false);
    const currentEditIndex = ref(null);

    onMounted(async () => {
      const db = await dbPromise;
      const storedPasswords = await db.getAll('passwords');
      passwords.value = storedPasswords;
    });

    async function addPassword() {
      if (newPassword.value.title && newPassword.value.username && newPassword.value.password) {
        const db = await dbPromise;
        const id = await db.put('passwords', { ...newPassword.value });
        passwords.value.push({ id, ...newPassword.value });
        resetForm();
      }
    }

    async function deletePassword(index) {
      const db = await dbPromise;
      const passwordToDelete = passwords.value[index];
      await db.delete('passwords', passwordToDelete.id);
      passwords.value.splice(index, 1);
    }

    function editPassword(index) {
      newPassword.value = { ...passwords.value[index] };
      isEditing.value = true;
      currentEditIndex.value = index;
    }

    async function updatePassword() {
      const db = await dbPromise;
      const id = passwords.value[currentEditIndex.value].id;
      await db.put('passwords', { id, ...newPassword.value });
      passwords.value[currentEditIndex.value] = { id, ...newPassword.value };
      resetForm();
    }

    function resetForm() {
      newPassword.value = { title: '', username: '', password: '', notes: '' };
      isEditing.value = false;
      currentEditIndex.value = null;
    }

    return {
      passwords,
      newPassword,
      addPassword,
      deletePassword,
      editPassword,
      updatePassword,
      isEditing
    };
  }
};
</script>

<style scoped>
/* General form styling */
.password-form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.password-form .form-group {
  margin-bottom: 15px;
}

.password-form .btn {
  margin-top: 10px;
}

/* Saved passwords list */
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-group-item h4 {
  margin-bottom: 0;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.container {
  max-width: 600px;
  margin: auto;
}

.mt-5 {
  margin-top: 3rem;
  margin-bottom: 200px;
}
</style>