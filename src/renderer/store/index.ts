import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
import createLogger from 'vuex/dist/logger'


import modules from './modules'

Vue.use(Vuex)

const devTool = process.env.NODE_ENV !== 'production' ? [createLogger()] : []
console.log("devTool===>", devTool)

var store = new Vuex.Store({
  modules,
  plugins: [
    //同步数据到localStorage或sessionStorage插件，持久化的state
    createPersistedState(),
    createSharedMutations(),
    // log
    ...devTool
  ],
  strict: process.env.NODE_ENV !== 'production'
})


export default store
