import { createApp } from 'vue';
import pinia from '@/stores/index';
import App from '@/App.vue';
import router from '@/router';
import { directive } from '@/directive/index';
import formatTime from './directive/formatTime';
import auth from './directive/auth';
import i18n from '@/i18n/index';
import other from '@/utils/other';
import "virtual:svg-icons-register";
import '@/theme/index.scss';
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus';

import "uno.css";
const app = createApp(App);


directive(app);
other.elSvg(app);

app.use(pinia).use(router).use(ElementPlus).use(formatTime).use(auth).use(i18n).mount('#app');
app.config.errorHandler = (err, instance, info) => {
  console.log(err, instance, info)
}