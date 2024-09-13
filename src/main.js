import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; 

// Import Bootstrap 4 CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import jQuery, Popper.js, and Bootstrap 4 JS
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

createApp(App).use(router).mount('#app');
