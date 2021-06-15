import Vue from 'vue'

import store from './store/index.js'
import App from './App.vue'

new Vue({
  store,
  components: { App },
  render: (createElement) => createElement(App),
}).$mount('#app')
