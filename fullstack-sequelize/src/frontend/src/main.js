import Vue from 'vue';
import App from './App.vue';
import EventBus from './event-bus';

// import 'env';
import './style/app.css';

import './plugins/element.js';

Vue.config.productionTip = false;

Vue.prototype.$EventBus = EventBus;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
