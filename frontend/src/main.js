import { createApp } from 'vue';
import { createPinia } from 'pinia';
const pinia = createPinia();
import App from './App.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from './router';

createApp(App).use(pinia).use(router).mount('#app');
