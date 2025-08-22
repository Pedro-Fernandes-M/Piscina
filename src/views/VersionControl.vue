<template>
  <div class="page">
    <h3 class="margin">{{ version }}</h3>
    <div class="width">
      <button @click="apagar_cache" class="button-1"><h3>Apagar Cache e Dados</h3></button>
    </div>
    <div class="wrapper" v-if="show">
      <div class="card">
        <div class="text">
          <h3>Tipo</h3>
        </div>
        <label class="custom-checkbox">
          Recomendado
          <input type="radio" value="default" v-model="mode" />
          <span class="box"></span>
        </label>
        <label class="custom-checkbox">
          Basico
          <input type="radio" value="basic" v-model="mode" />
          <span class="box"></span>
        </label>
        <label class="custom-checkbox">
          Extremo
          <input type="radio" value="extreme" v-model="mode" />
          <span class="box"></span>
        </label>
        <button class="button" @click="reset">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const version = __APP_VERSION__
const show = ref(false)
const mode = ref('')

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
    show.value = true
  }
})

async function reset() {
  const done = await store.dispatch('defenicoes/cache', mode.value)
  if (done) {
    ok.value = true
    show.value = false
  }
}
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

.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* fundo semi-escuro */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002; /* fica por cima de tudo */
}

.card {
  display: grid;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgb(64, 66, 67);
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* shadow */
  width: 17rem;
  min-height: 11rem;
  align-items: end;
}

.button {
  all: unset; /* Remove estilos padrão do botão */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #2e2e2e;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #e8e8e8;
  background-color: transparent; /* Sem fundo */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Leve efeito "popup" */
  cursor: pointer;
  background-color: #5a4141;
  margin-top: 1rem;
}

.custom-checkbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  user-select: none;
  margin: 0.45rem;
}

.custom-checkbox input[type='radio'] {
  display: none;
}

.custom-checkbox .box {
  width: 1.125rem;
  height: 1.125rem;
  border: 0.125rem solid #d1caca;
  border-radius: 0.25rem;
  display: inline-block;
  position: relative;
}

.custom-checkbox input[type='radio']:checked + .box::after {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.3125rem;
  width: 0.25rem;
  height: 0.5rem;
  border: solid #dc3333;
  border-width: 0 0.125rem 0.125rem 0;
  transform: rotate(45deg);
}

.text {
  margin-bottom: 1rem;
}
</style>
