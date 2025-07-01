<template>
  <div class="page">
    <div class="form">
      <div class="center">
        <h2 @click="mudarSheet" class="text">
          {{ piscina }}
        </h2>
        <h3>{{ day }} de {{ month }}</h3>
      </div>
      <div v-if="rows.length > 0">
        <div v-for="item in rows" :key="rows.indexOf(item)" class="grid">
          <span class="grid1">{{ item[0] }}</span>
          <span v-for="(data, index) in item.slice(1, item.length - 1)" :key="index">
            <span class="weight">
              {{ header[index] }}
            </span>
            <br />
            {{ data == '' ? '--' : data }}
          </span>
          <span class="grid1">{{ item[item.length - 1] }}</span>
        </div>
      </div>
      <div v-else class="center">Sem dados</div>
    </div>
    <button @click="lerDados">Refresh</button>
    <SpinnerCard v-if="spinner"></SpinnerCard>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import SpinnerCard from '@/components/SpinnerCard.vue'

const store = useStore()

const spinner = computed(() => {
  return store.getters.getSpinner
})

const piscina = computed(() => {
  return store.getters.getPiscina
})
const day = new Date().getDate()
const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]
const month = monthNames[new Date().getMonth()]

const header = ref(['Ph', 'Temp.', 'Residual', 'Total', 'Transp.', 'Nº', 'Vol', 'Filtros'])
const rows = computed(() => {
  const values = []
  for (let i = 0; i < store.getters.getTabela.length; i++) {
    values.push(store.getters.getTabela[i])
  }
  return values
})

async function lerDados() {
  const input = {
    dia: day,
    mes: month,
  }
  await store.dispatch('lerPlanilha', input)
}

function mudarSheet() {
  if (piscina.value === 'Piscina Interior') {
    store.commit('setPiscina', 'Piscina Exterior')
    store.commit('setTabela', [])
  } else {
    store.commit('setPiscina', 'Piscina Interior')
    store.commit('setTabela', [])
  }
}
</script>

<style scoped>
button {
  margin: 2rem;
  margin-top: 1rem;
  padding: 10px 20px;
  background-color: #00bcd4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.text {
  font-weight: 1000;
  color: aliceblue;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 6px;
  margin-bottom: 3rem;
}
.grid1 {
  grid-column: 1 / span 2;
  font-weight: 900;
  color: aliceblue;
  margin: 0.5rem;
}
.weight {
  font-weight: 500;
  color: aliceblue;
}
</style>
