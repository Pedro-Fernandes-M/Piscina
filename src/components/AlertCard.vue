<template>
  <div class="wrapper" @click="store.commit('alert/setAlert')">
    <div class="card" @click.stop>
      <span>{{ props.text }}</span>
      <div v-if="props.btn === 'alert'">
        <button @click="store.commit('alert/setAlert')">OK</button>
      </div>
      <div v-if="props.btn === 'confirm'" class="confirm">
        <button class="success" @click="input(true)">Sim</button>
        <button class="fail" @click="input(false)">Não</button>
      </div>
      <div v-if="props.btn === 'choice'" class="confirm">
        <button @click="input(0)">
          {{ props.choice[0] }}
        </button>
        <button @click="input(1)">
          {{ props.choice[1] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps(['text', 'btn', 'choice'])

function input(input) {
  if (props.btn === 'confirm') {
    store.commit('alert/setResponse', input)
  } else {
    store.commit('alert/setResponse', props.choice[input])
  }
  store.commit('alert/setAlert')
}
</script>

<style scoped>
.card {
  display: grid;
  text-align: center;
  background-color: rgb(41, 42, 43);
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* shadow */
  width: 18.5rem;
  height: 12rem;
  align-items: end;
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
  z-index: 10000; /* fica por cima de tudo */
}

.confirm {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
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
}

.success {
  background-color: rgba(4, 157, 4, 0.714);
}
.fail {
  background-color: rgba(168, 4, 4, 0.764);
}
</style>
