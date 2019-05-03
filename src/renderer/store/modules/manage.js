const state = {
  iframeSrc: "",
  safeCode: ""
}

const mutations = {
  UPDATE_IFRAME_SRC(state, value) {
    state.iframeSrc = value;
  },
  UPDATE_SAFE_CODE(state, value) {
    state.safeCode = value;
  }
}

const actions = {
  updateIframeSrc({ commit }, iframeSrc) {
    // do something
    commit('UPDATE_IFRAME_SRC', iframeSrc)
  },
  updateSafeCode({ commit }, safeCode) {
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
