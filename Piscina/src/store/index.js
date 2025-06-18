import { createStore } from 'vuex'


const store= createStore({
    state:{
        googleCredential: null,
    },
    getters:{
        getGoogleCredential(state){
            return state.googleCredential
        }
    },
    mutations:{
        setGoogleCredential(state, token) {
            state.googleCredential = token;
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

        async preencherSheet({getters,dispatch,commit},payload) {
        if(getters.getGoogleCredential==null){
            commit('setGoogleCredential',await dispatch('solicitarToken')) ;
        }
        const apiKey= import.meta.env.VITE_API_KEY;
        const spreadsheetId= import.meta.env.VITE_SPREADSHEET_ID;

        // 2. Carrega e inicializa gapi client
        await new Promise((resolve) => window.gapi.load('client', resolve));
        await window.gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });

        // 3. Seta o token no client
        window.gapi.client.setToken({ access_token: getters.getGoogleCredential });

          try {
            // 4. Lê a coluna A (onde está o "Dia")
            const readResponse = await window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${payload.mes}!A:A`,
            });

            const dias = readResponse.result.values || [];

            // 5. Procura a linha onde o valor da coluna A bate com o diaAlvo
            const linhaIndex = dias.findIndex(row => row[0] == String(payload.dia));

            if (linhaIndex === -1) {
            console.error('Dia não encontrado na coluna A');
            return;
            }
            
        const linha = linhaIndex + 1;
        // 4. Prepara dados e chama API
        const range = payload.mes+"!B"+linha+":F"+linha; // Linha 1, colunas A, B e C
        const values = [[payload.horas.value, payload.num_pessoas.value, payload.ph_cima.value, payload.ph_baixo.value,'Filipe Fernandes']];


        const params = {
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
        };

        const resource = {
            values,
        };

        try {
            const response = await window.gapi.client.sheets.spreadsheets.values.update(
            params,
            resource
            );
            alert('Planilha atualizada com sucesso')
            console.log('Planilha atualizada com sucesso:', response);
            return response;
        } catch (error) {
            alert('Erro ao atualizar a planilha')
            console.error('Erro ao atualizar a planilha:', error);
            throw error;
        }
        }catch (error) {
            console.error('Erro ao atualizar por dia:', error);
            throw error;
        }
    }
    },
    modules:{}
})

export default store