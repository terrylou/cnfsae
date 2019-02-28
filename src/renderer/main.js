import Vue from 'vue';
import axios from 'axios';
import Vuetify from 'vuetify';
import db from './datastore';

import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import MavonEditor from 'mavon-editor';
import App from './App';
import router from './router';
import store from './store';

Vue.use(Vuetify);
Vue.use(MavonEditor);
if (!process.env.IS_WEB) {
    Vue.use(require('vue-electron'));
}
Vue.http = Vue.prototype.$http = axios;
Vue.db = Vue.prototype.$db = db;
Vue.EventBus = Vue.prototype.$EventBus = new Vue();
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app');
