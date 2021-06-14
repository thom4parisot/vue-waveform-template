import Vue from 'vue'
import Vuex from 'vuex'

import store from './store.js'
import App from './App.vue'

Vue.use(Vuex)

new Vue({
  store,
  components: { App },
  render: (createElement) => createElement(App),
}).$mount('#app')
