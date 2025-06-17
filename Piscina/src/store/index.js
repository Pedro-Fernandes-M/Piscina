import { createStore } from 'vuex'

let googleCredentialResolve = null;
const store= createStore({
    state:{
        count:1,
        googleCredential: null,
    },
    getters:{
        getCount(state){
            return state.count
        },
        getAuth(state){
            return state.googleCredential
        }
    },
    mutations:{
        SetGoogleCredential(state, token) {
            state.googleCredential = token;
        },
    },
    actions:{
       initGoogleClient({ commit }) {
      return new Promise((resolve) => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: '145201799411-o6s35c72gu25nq53m4pmhq5focl09uf1.apps.googleusercontent.com',
            callback: (response) => {
              console.log(response.credential)
              commit('SetGoogleCredential', response.credential);
              if (googleCredentialResolve) googleCredentialResolve(response.credential);
            },
          });

          resolve(); // já inicializado
        } else {
          console.error('Google Identity Services not loaded');
        }
      });
    },

    async signIn({ dispatch }) {
    await dispatch('initGoogleClient');
        return await new Promise((resolve, reject) => {
            googleCredentialResolve = resolve;

            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    reject('Google sign-in was cancelled or blocked');
                }
            });
        });
    },

        solicitarToken() {
        return new Promise((resolve, reject) => {
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: '145201799411-o6s35c72gu25nq53m4pmhq5focl09uf1.apps.googleusercontent.com',
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

        async preencherSheet({dispatch}) {
        // 1. Pede o token OAuth
        const token = await dispatch('solicitarToken');
        const apiKey= 'AIzaSyAStEn26qXeXWIIc-LYglVzMh8iqaJTKL4';
        const spreadsheetId= '1Uthc13UmWYSp0A3VFCGDvDejd3n5LK9k9y9l09UQKeQ';

        // 2. Carrega e inicializa gapi client
        await new Promise((resolve) => window.gapi.load('client', resolve));
        await window.gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });

        // 3. Seta o token no client
        window.gapi.client.setToken({ access_token: token });

        // 4. Prepara dados e chama API
        const range = "Janeiro!A1:B2";
        const values = [['Nome', 'Email'], ['João', 'joao@email.com']];

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
            console.log('Planilha atualizada com sucesso:', response);
            return response;
        } catch (error) {
            console.error('Erro ao atualizar a planilha:', error);
            throw error;
        }
        }
    },
    modules:{}
})

export default store