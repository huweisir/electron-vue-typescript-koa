const state = {
  iframeSrc: "",
  safeCode: ""
}

const mutations = {
  UPDATE_IFRAME_SRC(state: any, value: string) {
    state.iframeSrc = value;
  },
  UPDATE_SAFE_CODE(state: any, value: string) {
    state.safeCode = value;
  }
}

const actions = {
  updateIframeSrc({ commit }: any, iframeSrc: string) {
    // debugger
    // do something
    commit('UPDATE_IFRAME_SRC', iframeSrc)
  },
  updateSafeCode({ commit }: any, safeCode: string) {
    // debugger
    // do something
    commit('UPDATE_SAFE_CODE', safeCode)
  }
}

export default {
  state,
  mutations,
  actions
}
