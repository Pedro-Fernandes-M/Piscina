<template>
  <div class="page">
    <h3 class="margin">{{ version }}</h3>
    <div class="width">
      <button @click="apagar_cache" class="button-1"><h3>Apagar Cache e Dados</h3></button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const version = __APP_VERSION__

const response = computed(() => {
  return store.getters['alert/getResponse']
})

const ok = ref(false)

onMounted(() => {
  store.commit('setPage', 'secret')
})

const apagar_cache = async () => {
  store.commit('alert/setResponse', null)
  store.commit('alert/setBtn', 'confirm')
  store.commit(
    'alert/setText',
    `Pretende apagar cache e todas as variáveis armazenadas? \n
    (Apenas recomendado em caso de erros persistentes!)`,
  )
  store.commit('alert/setAlert')
}

watch(response, async (novo) => {
  if (novo) {
    const done = await store.dispatch('defenicoes/cache')
    if (done) {
      store.commit('alert/setBtn', 'alert')
      store.commit('alert/setText', `Cache e dados apagados com sucesso!`)
      store.commit('alert/setAlert')
      ok.value = true
    }
  }
})
</script>

<style scoped>
button {
  margin-top: 1rem;
  padding: 10px 30px;
  background-color: #b10c06;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
h3 {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-weight: 600;
}
.margin {
  margin-bottom: 1rem;
}
</style>
