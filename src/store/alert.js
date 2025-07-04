const alert = {
  namespaced: true,
  state: {
    alert: false,
    text: '',
    btn: '',
    choice: [],
    response: null,
  },
  getters: {
    getAlert: (state) => state.alert,
    getText: (state) => state.text,
    getBtn: (state) => state.btn,
    getChoice: (state) => state.choice,
    getResponse: (state) => state.response,
  },
  mutations: {
    setAlert(state) {
      state.alert = !state.alert
    },
    setText(state, payload) {
      state.text = payload
    },
    setBtn(state, payload) {
      state.btn = payload
    },
    setChoice(state, payload) {
      state.choice = payload
    },
    setResponse(state, payload) {
      state.response = payload
    },
  },
  actions: {
    reset({ commit }) {
      commit('setText', '')
      commit('setBtn', '')
      commit('setChoice', [])
      commit('setResponse', null)
    },
  },
}

export default alert
