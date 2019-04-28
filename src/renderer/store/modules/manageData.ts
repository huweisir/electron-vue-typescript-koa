const state: any = {
  main: 0
}

const mutations = {
  UPDATE_IFRAME_SRC(state: any, value: string) {
    state.iframe_src = value;
  },
  INCREMENT_MAIN_COUNTER(state: any) {
    state.main++
  }
}

const actions = {
  someAsyncTask({ commit }: any) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
