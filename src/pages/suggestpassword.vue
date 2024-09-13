<template>
    <div class="container mt-5">
      <h2 class="text-center">Password Generator</h2>
      <div class="form-group">
        <label for="passwordLength">Password Length:</label>
        <input v-model="passwordLength" id="passwordLength" type="number" class="form-control" min="5" max="30" />
      </div>
      <button @click="generatePassword" class="btn btn-primary">Generate Password</button>
  
      <div v-if="generatedPassword" class="mt-3">
        <h4>Generated Password:</h4>
        <input :value="generatedPassword" class="form-control" readonly />
        <button @click="copyToClipboard" class="btn btn-secondary mt-2">Copy Password</button>
        <!-- Button to go to the Password Manager page -->
         <router-link to="/password-manager" class="btn btn-secondary mt-3">Go to Password Manager</router-link>
        <!--<button @click="triggerAutoSave" class="btn btn-success mt-2">Save Password</button>-->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        passwordLength: 12, // Default password length
        generatedPassword: ''
      };
    },
    methods: {
      generatePassword() {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = '';
        for (let i = 0; i < this.passwordLength; i++) {
          password += charset[Math.floor(Math.random() * charset.length)];
        }
        this.generatedPassword = password;
      },
      copyToClipboard() {
        const copyText = document.createElement("textarea");
        copyText.value = this.generatedPassword;
        document.body.appendChild(copyText);
        copyText.select();
        document.execCommand("copy");
        document.body.removeChild(copyText);
        alert('Password copied to clipboard!');
      },
      triggerAutoSave() {
        // This simulates a login form to trigger browser's auto-save
        const form = document.createElement('form');
        form.action = '/fake-login'; // Placeholder action
        form.method = 'POST';
  
        const usernameField = document.createElement('input');
        usernameField.type = 'text';
        usernameField.name = 'username';
        usernameField.value = 'username'; // Placeholder username
  
        const passwordField = document.createElement('input');
        passwordField.type = 'password';
        passwordField.name = 'password';
        passwordField.value = this.generatedPassword;
  
        form.appendChild(usernameField);
        form.appendChild(passwordField);
        document.body.appendChild(form);
  
        form.submit(); // This triggers the browser's auto-save prompt
  
        // Clean up the form after submitting
        document.body.removeChild(form);
      }
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
  
  h4 {
    margin-top: 20px;
  }
  </style>
  