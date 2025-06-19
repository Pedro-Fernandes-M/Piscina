import { createStore } from 'vuex'


const store= createStore({
    state:{
        googleCredential: null,
        piscina:'Piscina Interior'
    },
    getters:{
        getGoogleCredential(state){
            return state.googleCredential
        },
        getPiscina(state){
            return state.piscina
        },
    },
    mutations:{
        setGoogleCredential(state, token) {
            state.googleCredential = token;
        },
        setPiscina(state,payload){
            state.piscina=payload;
        },
    },
    actions:{
        solicitarToken() {
            return new Promise((resolve, reject) => {
                console.log(import.meta.env.VITE_CLIENT_ID)
                const tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: import.meta.env.VITE_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/spreadsheets',
                callback: (tokenResponse) => {
                    if (tokenResponse.error) {
                    reject(tokenResponse);
                    } else {
                    resolve(tokenResponse.access_token);
                    }
                },
                });

                tokenClient.requestAccessToken();
            });
        },
        async preencherSheet({getters, dispatch, commit}, payload) {
            if (getters.getGoogleCredential == null) {
                commit('setGoogleCredential', await dispatch('solicitarToken'));
            }

            const apiKey = import.meta.env.VITE_API_KEY;
            const spreadsheetId = store.getters.getPiscina==='Piscina Interior' ? import.meta.env.VITE_SPREADSHEET_ID: import.meta.env.VITE_SPREADSHEET_ID_1;

            // Inicializa gapi client
            await new Promise((resolve) => window.gapi.load('client', resolve));
            await window.gapi.client.init({
                apiKey: apiKey,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            });

            window.gapi.client.setToken({ access_token: getters.getGoogleCredential });

            try {
                // Lê a coluna D (dias)
                const readDias = await window.gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${payload.mes}!D:D`,
                });
                const dias = readDias.result.values || [];
                // Lê a coluna F para verificar células vazias
                const readColF = await window.gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${payload.mes}!F:F`,
                });
                const colF = readColF.result.values || [];

                // Filtra índices das linhas onde o dia bate com payload.dia
                const linhaDoDia = dias
                .map((row, idx) => ({ idx, dia: row[0] }))
                .filter(item => item.dia == String(payload.dia))
                .map(item => item.idx);
                
                const linhasDoDia= [
                    linhaDoDia,
                    (Number(linhaDoDia) +1).toString(),
                    (Number(linhaDoDia) +2).toString(),
                    (Number(linhaDoDia) +3).toString()
                ]
                // Procura a primeira linha do dia com coluna F vazia
                const linhaParaEscreverIdx = linhasDoDia.find(i => {
                return !colF[i] || colF[i][0] === '' || colF[i][0] == null;
                });

               

                if (linhaParaEscreverIdx === undefined) {
                console.error('Não encontrou linha vazia na coluna F para o dia', payload.dia);
                alert('Não encontrou linha vazia na coluna F para o dia')
                return;
                }

                const linhaParaEscrever = (Number(linhaParaEscreverIdx) + 1).toString();
               

                // Define o range e os valores para atualizar
                const range = `${payload.mes}!F${linhaParaEscrever}:P${linhaParaEscrever}`;
                const values = [[
                payload.horas.value,
                payload.ph.value,
                payload.temperatura_agua.value,
                payload.residual_desinfetante.value,
                payload.total_residual.value,
                payload.transparencia.value,
                payload.num_banhistas.value,
                payload.volume.value===0 ? '' : payload.volume.value,
                payload.lavagem_filtros.value,
                'Filipe Fernandes',
                payload.observacoes.value
                ]];


                const params = {
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                };

                const resource = { values };

                const response = await window.gapi.client.sheets.spreadsheets.values.update(params, resource);

                alert('Planilha atualizada com sucesso');
                console.log('Planilha atualizada com sucesso:', response);
                return response;

            } catch (error) {
                alert('Erro ao atualizar a planilha');
                console.error('Erro ao atualizar a planilha:', error);
                throw error;
            }
        }

    },
    modules:{}
})

export default store