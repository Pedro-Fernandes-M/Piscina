<template>
  <div class="page">
    <h2 @dblclick="router.push('/secret')">Definições</h2>
    <div class="grid">
      <div v-for="(item, id) in settigns" :key="id" class="grid1">
        <label>{{ item }}</label>
        <input
          type="text"
          v-model.trim="change[id]"
          :class="[change[id] == '' ? 'input-erro' : '']"
        />
        <input type="file" accept=".json" id="file" @change="handleFile" style="display: none" />
      </div>
      <div class="flex">
        <div class="space" @click="open = !open">
          <span>Avançadas</span>
          <span v-if="!open" class="rotate"><IconDropDown /></span>
          <span v-else><IconDropDown /></span>
        </div>
        <transition name="dropdown" mode="out-in">
          <div class="flex-1" v-if="open">
            <button :class="[mapa != null ? 'button-2' : 'button-4']" @click="upload">
              <div v-if="mapa != null" class="span"><IconReUpload /> Alterar Mapa</div>
              <div v-else class="span"><IconUpload /> Carregar Mapa</div>
            </button>
            <div>
              <label>Latitude</label>
              <input
                type="text"
                v-model.trim="change[change?.length - 2]"
                :class="[change[change?.length - 2] == '' ? 'input-erro' : '']"
              />
            </div>
            <div>
              <label>Longitude</label>
              <input
                type="text"
                v-model.trim="change[change?.length - 1]"
                :class="[change[change?.length - 1] == '' ? 'input-erro' : '']"
              />
            </div>
            <div>
              <button @click="AllowPush" :class="[pushEnable ? 'button-2 ' : 'button-4 button-5']">
                Enable Notifications
              </button>
            </div>
          </div>
        </transition>
      </div>
      <div :class="change.some((item) => item !== null) ? 'gap' : 'no-gap'">
        <button @click="guardar" class="button-3">Guardar</button>
        <transition>
          <button
            @click="apagar"
            class="button-1 button-3"
            v-if="change.some((item) => item !== null)"
          >
            Apagar
          </button>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconDropDown from '@/components/icons/IconDropDown.vue'
import IconReUpload from '@/components/icons/IconReUpload.vue'
import IconUpload from '@/components/icons/IconUpload.vue'
import { router } from '@/router'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.commit('setPage', 'settings')
})

const pushEnable = computed(() => {
  return 'Notification' in window && Notification.permission === 'granted'
})

const settigns = [
  'API_Key',
  'Client_ID',
  'Piscina Interior',
  'Piscina Exterior',
  'Controlo Água Potável',
  'Assinatura',
]

store.dispatch('defenicoes/getSettings')

const mapa = computed(() => {
  console.lo
  return store.getters.getMapa
})

const response = computed(() => {
  return store.getters['alert/getResponse']
})

const change = ref([null, null, null, null, null, null])
const open = ref(false)

const change1 = computed(() => {
  return [
    store.getters['defenicoes/getAPI_Key'],
    store.getters['defenicoes/getClient_ID'],
    store.getters['defenicoes/getPiscInt'],
    store.getters['defenicoes/getPiscExt'],
    store.getters['defenicoes/getEspacos'],
    store.getters['defenicoes/getAssinatura'],
    store.getters['defenicoes/getLat'],
    store.getters['defenicoes/getLong'],
  ]
})
change.value = change1.value

watch(change1, (novo) => {
  if (novo) {
    change.value = change1.value
  }
})

const guardar = () => {
  if (change.value.length > 0) {
    {
      const payload = {
        API_Key: change.value[0] || '',
        Client_ID: change.value[1] || '',
        PiscInt: change.value[2] || '',
        PiscExt: change.value[3] || '',
        Espacos: change.value[4] || '',
        Assinatura: change.value[5] || '',
        Lat: change.value[6] || '',
        Long: change.value[7] || '',
        store: 1,
      }
      store.dispatch('defenicoes/setSettings', payload)
      store.commit('alert/setBtn', 'alert')
      store.commit('alert/setText', `Valores atualizados!`)
      store.commit('alert/setAlert')
    }
  }
}

const reset = ref()

const apagar = async () => {
  reset.value = true
  store.commit('alert/setResponse', null)
  store.commit('alert/setBtn', 'confirm')
  store.commit('alert/setText', `Pretende apagar as definições?`)
  store.commit('alert/setAlert')
}

watch(response, async (novo) => {
  if (novo && reset.value) {
    await store.dispatch('defenicoes/reset')
    reset.value = false
  }
})

watch(mapa, (novo) => {
  if (novo != null && localStorage.getItem('mapa') != null) {
    store.commit('alert/setBtn', 'alert')
    store.commit('alert/setText', `Mapa atualizado!`)
    store.commit('alert/setAlert')
  }
})

function upload() {
  document.getElementById('file').click()
}

function handleFile(event) {
  const file = event.target.files[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result)
      localStorage.setItem('mapa', JSON.stringify(json))
      store.commit('setMapa', json)
    } catch (error) {
      console.error('Erro ao ler JSON:', error)
      store.commit('alert/setBtn', 'alert')
      store.commit('alert/setText', `O ficheiro não é um JSON válido.`)
      store.commit('alert/setAlert')
    }
  }
  reader.readAsText(file)
}

function AllowPush() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification('Notificações ativadas!', {
          body: 'Push testado com sucesso.',
        })
      })
    } else if (permission === 'denied') {
      store.commit('alert/setBtn', 'alert')
      store.commit('alert/setText', 'Dispositivo negou permissão as notificações.')
      store.commit('alert/setAlert')
    } else {
      store.commit('alert/setBtn', 'alert')
      store.commit('alert/setText', 'Permissão de notificações não foi concedida.')
      store.commit('alert/setAlert')
    }
  })
}
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
  width: 65%;
  max-width: 20rem;
  text-align: left;
}
.grid1 {
  display: grid;
}

input {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  background-color: #333;
  color: #fff;
  width: 100%;
  transition: box-shadow 0.2s ease;

  box-shadow:
    inset 2px 2px 5px rgba(0, 0, 0, 0.6),
    inset -2px -2px 5px rgba(255, 255, 255, 0.05);
}

input:focus {
  box-shadow:
    inset 1px 1px 2px rgba(0, 0, 0, 0.8),
    inset -1px -1px 2px rgba(255, 255, 255, 0.1),
    0 0 5px rgba(100, 200, 255, 0.4);
}

button {
  margin-top: 1rem;
  padding: 10px 30px;
  background-color: #0199ad;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.button-2 {
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;

  box-shadow:
    inset 2px 2px 5px rgba(0, 0, 0, 0.6),
    inset -2px -2px 5px rgba(255, 255, 255, 0.05);
}

.button-4 {
  width: 100%;
  background-color: #c0b343;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.input-erro {
  box-shadow: 0 0 0 2px #b10c06;
}

h2 {
  color: aliceblue;
  font-weight: 1000;
  margin-bottom: 0.8rem;
  margin-top: 0.5rem;
}
.button-1 {
  background-color: #b10c06;
}

.button-5 {
  background: #348216;
}

.gap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.no-gap {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.width {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
}
.span {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.3rem;
}

.flex {
  display: grid;
  border-bottom: 1px solid whitesmoke;
  padding-bottom: 0.8rem;
}

.flex-1 {
  display: grid;
  width: 100%;
  gap: 1rem;
}

.space {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.rotate {
  rotate: -90deg;
}

/* Transição para altura suave */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.5s ease-in-out;
  max-height: 200px;
  opacity: 1;
}

.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
