<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <p>This is your first Vue.js page.</p>
    <router-link to="/about">Go to About Page</router-link>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
