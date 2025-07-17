<template>
  <div class="page">
    <h2>Definições</h2>
    <div class="grid">
      <div v-for="(item, id) in settigns" :key="id" class="grid1">
        <label>{{ item }}</label>
        <input
          type="text"
          v-model.trim="change[id]"
          :class="[change[id] == '' ? 'input-erro' : '']"
        />
      </div>
      <div :class="change.some((item) => item !== null) ? 'gap' : 'no-gap'">
        <button @click="guardar">Guardar</button>
        <button @click="apagar" class="button-1" v-if="change.some((item) => item !== null)">
          Apagar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const settigns = [
  'API_Key',
  'Client_ID',
  'Piscina Interior',
  'Piscina Exterior',
  'Controlo Água Potável',
  'Assinatura',
]

store.dispatch('defenicoes/getSettings')

const response = computed(() => {
  return store.getters['alert/getResponse']
})

const change = ref([null, null, null, null, null, null])

const change1 = computed(() => {
  return [
    store.getters['defenicoes/getAPI_Key'],
    store.getters['defenicoes/getClient_ID'],
    store.getters['defenicoes/getPiscInt'],
    store.getters['defenicoes/getPiscExt'],
    store.getters['defenicoes/getEspacos'],
    store.getters['defenicoes/getAssinatura'],
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
        store: 1,
      }
      store.dispatch('defenicoes/setSettings', payload)
      store.commit('alert/setBtn', 'alert')
      store.commit('alert/setText', `Valores atualizados!`)
      store.commit('alert/setAlert')
    }
  }
}

const apagar = async () => {
  store.commit('alert/setResponse', null)
  store.commit('alert/setBtn', 'confirm')
  store.commit('alert/setText', `Pretende apagar as definições?`)
  store.commit('alert/setAlert')
}

watch(response, async (novo) => {
  if (novo) {
    await store.dispatch('defenicoes/reset')
  }
})
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
  background-color: #444;
  color: #fff;
  width: 200px;
  transition: box-shadow 0.2s ease;
  width: 100%;
}

input:focus {
  box-shadow: 0 0 0 2px #00bcd4;
}

button {
  margin-top: 1rem;
  padding: 10px 30px;
  background-color: #00bcd4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.button-1 {
  background-color: #d40700;
}

.input-erro {
  box-shadow: 0 0 0 2px #d42e00;
}

h2 {
  color: aliceblue;
  font-weight: 1000;
  margin-bottom: 0.8rem;
}

.gap {
  display: flex;
  justify-content: space-between;
  align-items: center; /* optional: vertical alignment */
  gap: 1rem; /* still applies if there are more elements */
}
.no-gap {
  display: flex;
  justify-content: center;
}
</style>
