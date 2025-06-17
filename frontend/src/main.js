import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from './router';

createApp(App).use(PrimeVue).use(router).mount('#app');
