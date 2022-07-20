import {
  createApp,
} from 'vue';
// import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import App from './App.vue';
import router from './router';
import store from './state/index';
import appAxios from './utils/appAxios';
import '@/assets/scss/config/creative/app.scss';
import i18n from '../i18n';

const app = createApp(App);
app.use(router);
app.use(store);
app.config.globalProperties.$store = store;
app.config.globalProperties.$appAxios = appAxios.appAxios;
app.use(i18n);
app.mount('#app');
