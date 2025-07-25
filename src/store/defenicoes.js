const defenicoes = {
  namespaced: true,
  state: {
    API_Key: '',
    Client_ID: '',
    PiscInt: '',
    PiscExt: '',
    Assinatura: '',
    Espacos: '',
    Lat: '',
    Long: '',
  },
  getters: {
    getAPI_Key: (state) => state.API_Key,
    getClient_ID: (state) => state.Client_ID,
    getPiscInt: (state) => state.PiscInt,
    getPiscExt: (state) => state.PiscExt,
    getAssinatura: (state) => state.Assinatura,
    getEspacos: (state) => state.Espacos,
    getLat: (state) => state.Lat,
    getLong: (state) => state.Long,
  },
  mutations: {
    setAPI_Key(state, payload) {
      state.API_Key = payload
    },
    setClient_ID(state, payload) {
      state.Client_ID = payload
    },
    setPiscInt(state, payload) {
      state.PiscInt = payload
    },
    setPiscExt(state, payload) {
      state.PiscExt = payload
    },
    setAssinatura(state, payload) {
      state.Assinatura = payload
    },
    setEspacos(state, payload) {
      state.Espacos = payload
    },
    setLat(state, payload) {
      state.Lat = payload
    },
    setLong(state, payload) {
      state.Long = payload
    },
  },
  actions: {
    reset({ commit }) {
      commit('setAPI_Key', '')
      commit('setClient_ID', '')
      commit('setPiscInt', '')
      commit('setPiscExt', '')
      commit('setAssinatura', '')
      commit('setEspacos', '')
      commit('setLat', '')
      commit('setLong', '')
      localStorage.removeItem('def')
    },
    setSettings({ commit }, payload) {
      commit('setAPI_Key', payload.API_Key || null)
      commit('setClient_ID', payload.Client_ID || null)
      commit('setPiscInt', payload.PiscInt || null)
      commit('setPiscExt', payload.PiscExt || null)
      commit('setEspacos', payload.Espacos || null)
      commit('setAssinatura', payload.Assinatura || null)
      commit('setLat', payload.Lat || null)
      commit('setLong', payload.Long || null)

      if (payload.store == 1) {
        // eslint-disable-next-line no-unused-vars
        const { store, ...cleaned } = payload
        localStorage.setItem('def', JSON.stringify(cleaned))
      }
    },
    getSettings({ commit, dispatch }) {
      let settings = JSON.parse(localStorage.getItem('def')) || {}
      let mapa = JSON.parse(localStorage.getItem('mapa'))
      commit('setMapa', mapa, { root: true })
      dispatch('setSettings', settings)
    },
    cache({ commit }) {
      commit('setGoogleCredential', null, { root: true })
      localStorage.removeItem('token')
      localStorage.removeItem('logs')
      localStorage.removeItem('logs1')
      localStorage.removeItem('logs2')
      localStorage.removeItem('reg_map')
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (let name of names) {
            caches.delete(name)
          }
        })
      }
      return true
    },
  },
}

export default defenicoes
