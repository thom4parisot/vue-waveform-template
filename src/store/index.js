import Vue from 'vue'
import Vuex from 'vuex'

import programme from './modules/programme.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    programme
  },
})
