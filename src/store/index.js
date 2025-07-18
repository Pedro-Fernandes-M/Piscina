import { createStore } from 'vuex'
import { gapi } from 'gapi-script'
import alert from './alert'
import defenicoes from './defenicoes'

const store = createStore({
  state: {
    googleCredential: null,
    piscina: 'Piscina Interior',
    page: 'home',
    tabela: [],
    spinner: false,
    linhas: [],
    change: [],
    restore: {
      ph: null,
      num_banhistas: null,
      horas: null,
      temperatura_agua: null,
      residual_desinfetante: null,
      total_residual: null,
      transparencia: null,
      volume: null,
      lavagem_filtros: null,
      observacoes: '',
    },
    edit: false,
  },
  getters: {
    getGoogleCredential(state) {
      return state.googleCredential
    },
    getPiscina(state) {
      return state.piscina
    },
    getPage(state) {
      return state.page
    },
    getTabela(state) {
      return state.tabela
    },
    getSpinner(state) {
      return state.spinner
    },
    getLinhas(state) {
      return state.linhas
    },
    getChange(state) {
      return state.change
    },
    getRestore(state) {
      return state.restore
    },
    getEdit(state) {
      return state.edit
    },
  },
  mutations: {
    setGoogleCredential(state, token) {
      state.googleCredential = token
    },
    setPiscina(state, payload) {
      state.piscina = payload
    },
    setPage(state, payload) {
      state.page = payload
    },
    setTabela(state, payload) {
      state.tabela = payload
    },
    setSpinner(state, payload) {
      state.spinner = payload
    },
    setLinhas(state, payload) {
      state.linhas = payload
    },
    setChange(state, payload) {
      state.change = payload
    },
    setRestore(state, payload) {
      state.restore = payload
    },
    setEdit(state, payload) {
      state.edit = payload
    },
  },
  actions: {
    solicitarToken({ getters, commit }) {
      return new Promise((resolve, reject) => {
        let finished = false

        const timeout = setTimeout(() => {
          if (!finished) {
            finished = true
            commit('alert/setBtn', 'alert')
            commit('alert/setText', `A autenticação expirou ou foi cancelada.`)
            commit('alert/setAlert')
            commit('setSpinner', false)
            return null
          }
        }, 12000) // 30 segundos de timeout

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: getters['defenicoes/getClient_ID'] || import.meta.env.VITE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/spreadsheets',
          callback: (tokenResponse) => {
            if (finished) return // ignora chamadas tardias

            finished = true
            clearTimeout(timeout)

            if (tokenResponse.error) {
              reject(tokenResponse)
            } else {
              resolve(tokenResponse.access_token)
            }
          },
        })

        tokenClient.requestAccessToken()
      })
    },
    async checkTokenValidity({ getters, commit }) {
      const storedToken = localStorage.getItem('token')

      if (getters.getGoogleCredential !== null) return true

      if (!storedToken) {
        commit('setGoogleCredential', null)
        localStorage.removeItem('token')
        localStorage.removeItem('logs')
        localStorage.removeItem('logs1')
        localStorage.removeItem('logs2')
        commit('alert/setBtn', 'alert')
        commit('alert/setText', 'Login expirado! Efetue login manualmente no botão Refresh.')
        commit('alert/setAlert')
      }
    },
    async preencherSheet({ getters, dispatch, commit }, payload) {
      commit('setSpinner', !getters.getSpinner)

      if (getters.getGoogleCredential === null) {
        const storedToken = localStorage.getItem('token')

        if (storedToken) {
          const parsedToken = JSON.parse(storedToken)
          const isValid = Date.now() - parsedToken.time < 3590 * 1000

          if (isValid) {
            commit('setGoogleCredential', parsedToken.access)
          } else {
            const newToken = await dispatch('solicitarToken')
            commit('setGoogleCredential', newToken)
            localStorage.setItem('token', JSON.stringify({ time: Date.now(), access: newToken }))
          }
        } else {
          const newToken = await dispatch('solicitarToken')
          commit('setGoogleCredential', newToken)
          localStorage.setItem('token', JSON.stringify({ time: Date.now(), access: newToken }))
        }
      }

      const apiKey = getters['defenicoes/getAPI_Key'] || import.meta.env.VITE_API_KEY
      const spreadsheetId =
        store.getters.getPiscina === 'Piscina Interior'
          ? getters['defenicoes/getPiscInt'] || import.meta.env.VITE_SPREADSHEET_ID
          : getters['defenicoes/getPiscExt'] || import.meta.env.VITE_SPREADSHEET_ID_1

      const spreadsheetId1 =
        getters['defenicoes/getEspacos'] || import.meta.env.VITE_SPREADSHEET_ID_2

      // Inicializa gapi client
      await new Promise((resolve) => gapi.load('client', resolve))
      await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      })

      gapi.client.setToken({ access_token: getters.getGoogleCredential })

      try {
        let range = null
        let values = null
        if (payload.options == 'piscina') {
          const readDias = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${payload.mes}!D:D`,
          })
          const dias = readDias.result.values || []
          // Lê a coluna F para verificar células vazias
          const readColF = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${payload.mes}!F:F`,
          })
          const colF = readColF.result.values || []

          // Filtra índices das linhas onde o dia bate com payload.dia
          const linhaDoDia = dias
            .map((row, idx) => ({ idx, dia: row[0] }))
            .filter((item) => item.dia == String(payload.dia))
            .map((item) => item.idx)

          const linhasDoDia = [
            linhaDoDia,
            (Number(linhaDoDia) + 1).toString(),
            (Number(linhaDoDia) + 2).toString(),
            (Number(linhaDoDia) + 3).toString(),
          ]
          // Procura a primeira linha do dia com coluna F vazia
          const linhaParaEscreverIdx = linhasDoDia.find((i) => {
            return !colF[i] || colF[i][0] === '' || colF[i][0] == null
          })

          if (linhaParaEscreverIdx === undefined) {
            commit('alert/setBtn', 'alert')
            commit(
              'alert/setText',
              `Não encontrou linha vazia na coluna F para o dia ${payload.dia}.`,
            )
            commit('alert/setAlert')
            console.error('Não encontrou linha vazia na coluna F para o dia', payload.dia)
            commit('setSpinner', !getters.getSpinner)
            const response = { status: 399 }
            return response
          }

          const linhaParaEscrever = (Number(linhaParaEscreverIdx) + 1).toString()

          // Define o range e os valores para atualizar
          range = `${payload.mes}!F${linhaParaEscrever}:P${linhaParaEscrever}`
          values = [
            [
              payload.horas.value,
              payload.ph.value,
              payload.temperatura_agua.value,
              payload.residual_desinfetante,
              payload.total_residual,
              payload.transparencia.value,
              payload.num_banhistas.value,
              payload.volume.value === 0 ? '' : payload.volume.value,
              payload.lavagem_filtros.value,
              getters['defenicoes/getAssinatura'] || 'Filipe Fernandes',
              payload.observacoes.value,
            ],
          ]
        } else {
          const readRes = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId1,
            range: `${payload.ano}!A:A`,
          })

          const rows = readRes.result.values || []

          const firstEmptyIndex = rows.findIndex((row, index) => {
            if (index <= 1) return false // ignora índice 0 e 1 (linhas 3 e 4)
            return !row[0] || row[0].trim() === ''
          })

          // Como estamos começando a leitura a partir da linha 3, ajustamos o índice
          const rowNumber =
            firstEmptyIndex >= 0
              ? firstEmptyIndex + 1
              : rows.length < 2
                ? rows.length + 2
                : rows.length + 1

          // Define a faixa e os valores a escrever
          range = `${payload.ano}!A${rowNumber}:J${rowNumber}`
          values = [
            [
              payload.data,
              payload.quarto,
              payload.temp_quente,
              payload.cloro_quente < 0.1 ? 'Low' : payload.cloro_quente,
              payload.ph_quente,
              payload.temp_fria,
              payload.cloro_fria < 0.1 ? 'Low' : payload.cloro_fria,
              payload.ph_fria,
              payload.comentarios,
              getters['defenicoes/getAssinatura'] || 'Filipe Fernandes',
            ],
          ]
        }

        let params = {}
        if (payload.options == 'quartos') {
          params = {
            spreadsheetId: spreadsheetId1,
            range,
            valueInputOption: 'RAW',
          }
        } else {
          params = {
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
          }
        }

        const resource = { values }

        const response = await gapi.client.sheets.spreadsheets.values.update(params, resource)
        if (response.status === 200) {
          commit('alert/setBtn', 'alert')
          commit('alert/setText', `Planilha atualizada com sucesso`)
          commit('alert/setAlert')
          commit('alert/setResponse', false)
        } else {
          commit('alert/setBtn', 'alert')
          commit('alert/setText', 'Erro' + response.status)
          commit('alert/setAlert')
        }
        commit('setSpinner', !getters.getSpinner)
        return response
      } catch (error) {
        console.error('Erro ao atualizar a planilha:', error)
        commit('setSpinner', !getters.getSpinner)
        throw error
      }
    },
    async lerPlanilha({ getters, commit, dispatch }, payload) {
      commit('setSpinner', true)

      if (getters.getGoogleCredential === null) {
        const storedToken = localStorage.getItem('token')

        if (storedToken) {
          const parsedToken = JSON.parse(storedToken)
          const isValid = Date.now() - parsedToken.time < 3590 * 1000

          if (isValid) {
            commit('setGoogleCredential', parsedToken.access)
          } else {
            if (payload.btn === true) {
              const newToken = await dispatch('solicitarToken')

              commit('setGoogleCredential', newToken)
              localStorage.setItem('token', JSON.stringify({ time: Date.now(), access: newToken }))
            } else {
              commit('setSpinner', false)
              return
            }
          }
        } else {
          if (payload.btn === true) {
            const newToken = await dispatch('solicitarToken')
            commit('setGoogleCredential', newToken)
            localStorage.setItem('token', JSON.stringify({ time: Date.now(), access: newToken }))
          } else {
            commit('alert/setBtn', 'alert')
            commit(
              'alert/setText',
              'Sem login efetuado! \nEfetue login manualmente no botão Refresh.',
            )
            commit('alert/setAlert')
            commit('setSpinner', false)
            return
          }
        }
      }

      const apiKey = getters['defenicoes/getAPI_Key'] || import.meta.env.VITE_API_KEY
      const spreadsheetId =
        store.getters.getPiscina === 'Piscina Interior'
          ? getters['defenicoes/getPiscInt'] || import.meta.env.VITE_SPREADSHEET_ID
          : getters['defenicoes/getPiscExt'] || import.meta.env.VITE_SPREADSHEET_ID_1

      // Inicializa gapi client
      await new Promise((resolve) => gapi.load('client', resolve))
      await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      })

      gapi.client.setToken({ access_token: getters.getGoogleCredential })

      let range = null
      let spreadsheetId1 = null
      let response = null
      try {
        if (payload.options == 'quartos') {
          spreadsheetId1 = getters['defenicoes/getEspacos'] || import.meta.env.VITE_SPREADSHEET_ID_2
          response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId1,
            range: `${payload.ano}!A:J`,
          })

          const linhas = response.result.values || []

          // Filtra as linhas e guarda os índices reais
          const linhasFiltradas = linhas
            .map((row, index) => ({ row, index }))
            .filter(({ row }) => row[0] === `${payload.dia}/${payload.mes}`)

          const respostaFiltrada = {
            ...response,
            result: {
              ...response.result,
              values: linhasFiltradas.map(({ row }) => row),
            },
          }

          // Só os números das linhas reais (lembrando do +1 pois começa em 1 no Sheets)
          const linhasIdx = linhasFiltradas.map(({ index }) => index + 1)

          commit('setLinhas', linhasIdx)

          response = respostaFiltrada
        } else {
          const readDias = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${payload.mes}!D:D`,
          })
          const dias = readDias.result.values || []

          // Filtra índices das linhas onde o dia bate com payload.dia
          const linhaDoDia = dias
            .map((row, idx) => ({ idx, dia: row[0] }))
            .filter((item) => item.dia == String(payload.dia))
            .map((item) => item.idx)

          const linhasTotais = [
            linhaDoDia[0] + 1,
            linhaDoDia[0] + 2,
            linhaDoDia[0] + 3,
            linhaDoDia[0] + 4,
          ]

          if (linhasTotais.length === 0) {
            console.error('Não encontrou linhas para o dia', payload.dia)
            commit('alert/setBtn', 'alert')
            commit('alert/setText', 'Não encontrou linhas para o dia')
            commit('alert/setAlert')
            commit('setSpinner', !getters.getSpinner)
            return { status: 400 }
          } else {
            commit('setLinhas', linhasTotais)
          }

          range = `${payload.mes}!F${linhasTotais[0]}:P${linhasTotais[linhasTotais.length - 1]}`

          const id = spreadsheetId1 === null ? spreadsheetId : spreadsheetId1
          response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: id,
            range,
          })
        }

        if (response.status === 200) {
          const dadosLinhas = response.result.values || []
          commit('setTabela', dadosLinhas)

          if (payload.options == 'quartos') {
            localStorage.setItem('logs2', JSON.stringify(dadosLinhas))
          } else if (store.getters.getPiscina === 'Piscina Interior') {
            localStorage.setItem('logs', JSON.stringify(dadosLinhas))
          } else {
            localStorage.setItem('logs1', JSON.stringify(dadosLinhas))
          }
        } else {
          commit('alert/setBtn', 'alert')
          commit('alert/setText', response.status)
          commit('alert/setAlert')
        }
        commit('setSpinner', !getters.getSpinner)
      } catch (error) {
        commit('alert/setBtn', 'alert')
        commit('alert/setText', 'Erro ao ler dados do Sheets:' + error)
        commit('alert/setAlert')
        commit('setSpinner', !getters.getSpinner)
        return { status: 500, error }
      }
    },
    async deleteLog({ getters, commit, dispatch }, payload) {
      commit('setSpinner', !getters.getSpinner)

      if (getters.getGoogleCredential === null) {
        const storedToken = localStorage.getItem('token')

        if (storedToken) {
          const parsedToken = JSON.parse(storedToken)
          const isValid = Date.now() - parsedToken.time < 3590 * 1000

          if (isValid) {
            commit('setGoogleCredential', parsedToken.access)
          } else {
            const newToken = await dispatch('solicitarToken')

            commit('setGoogleCredential', newToken)
            localStorage.setItem('token', JSON.stringify({ time: Date.now(), access: newToken }))
          }
        } else {
          const newToken = await dispatch('solicitarToken')

          commit('setGoogleCredential', newToken)
          localStorage.setItem('token', JSON.stringify({ time: Date.now(), access: newToken }))
        }
      }

      const apiKey = getters['defenicoes/getAPI_Key'] || import.meta.env.VITE_API_KEY
      const spreadsheetId =
        store.getters.getPiscina === 'Piscina Interior'
          ? getters['defenicoes/getPiscInt'] || import.meta.env.VITE_SPREADSHEET_ID
          : getters['defenicoes/getPiscExt'] || import.meta.env.VITE_SPREADSHEET_ID_1
      const spreadsheetId1 =
        getters['defenicoes/getEspacos'] || import.meta.env.VITE_SPREADSHEET_ID_2

      // Inicializa gapi client
      await new Promise((resolve) => gapi.load('client', resolve))
      await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      })

      let linha = null
      let range = null
      if (payload.options == 'quartos') {
        linha = getters.getLinhas[payload.index]

        range = `${payload.ano}!A${linha}:K${linha}`
      } else {
        linha = getters.getLinhas[payload.index]
        range = `${payload.mes}!F${linha}:P${linha}`
      }

      const id = payload.options == 'quartos' ? spreadsheetId1 : spreadsheetId
      try {
        await gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: id,
          range: range,
          valueInputOption: 'RAW',
          resource: {
            values: [['', '', '', '', '', '', '', '', '', '', '']], // 11 colunas de F a P
          },
        })
        if (payload.del) {
          commit('alert/setBtn', 'alert')
          commit('alert/setText', `Linha ${linha} limpa com sucesso!`)
          commit('alert/setAlert')
        }

        try {
          if (payload.options == 'quartos') {
            await dispatch('lerPlanilha', {
              dia: new Date().getDate(),
              mes: new Date().getMonth() + 1,
              ano: new Date().getFullYear(),
              options: 'quartos',
            })
          } else {
            await dispatch('lerPlanilha', {
              mes: payload.mes,
              dia: payload.dia,
              options: 'piscina',
            })
          }
        } catch (error) {
          commit('alert/setBtn', 'alert')
          commit('alert/setText', 'Erro ao apagar linha:' + error)
          commit('alert/setAlert')
        }
      } catch (error) {
        commit('alert/setBtn', 'alert')
        commit('alert/setText', 'Erro ao apagar linha:' + error)
        commit('alert/setAlert')
      }
    },
  },
  modules: {
    alert: alert,
    defenicoes: defenicoes,
  },
})

export default store
