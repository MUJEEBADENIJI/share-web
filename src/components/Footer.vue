<template>
  <footer>
    <div class="footer-container">
      <div class="footer-item">
        <router-link to="/password-manager">
          <i class="fa fa-key fa-2x"></i>
          <p>Password Manager</p>
        </router-link>
      </div>

      <div class="footer-item">
        <router-link to="/group-chat">
          <i class="fa fa-comments fa-2x"></i>
          <p>Group Chat</p>
        </router-link>
      </div>

      <div class="footer-item">
        <router-link to="/">
          <i class="fa fa-folder fa-2x"></i>
          <p>File Sharing</p>
        </router-link>
      </div>
    </div>

    <div class="copyright">
      <p class="sign">
        Copyright &copy; 
        <a href="/" class="sign">HappyCode</a> 2024 - 
        {{ currentYear }}, All Rights Reserved BOT
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
footer {
  background-color: grey;
  color: white;
  padding: 12px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 120px;
}

.footer-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.footer-item {
  text-align: center;
}

.footer-item p {
  margin-top: 5px;
  font-size: 14px;
  color: white;
}

.copyright {
  margin-top: 5px;
  margin-bottom:0%;
  text-align:center;
}

.sign {
  color: white;
  text-decoration: none;
  font-size:12px;
}

.sign:hover {
  text-decoration: underline;
}

.fa{
  color:white;
  font-size:25px;
  
}
</style>
