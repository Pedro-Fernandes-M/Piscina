import './assets/main.css'
import { registerSW } from 'virtual:pwa-register'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store/index.js'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')

registerSW({ immediate: true })
