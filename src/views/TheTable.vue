<template>
  <div class="page">
    <div class="form">
      <div class="center">
        <h2 @click="mudarSheet" class="text">
          {{ piscina }}
        </h2>
        <h3>{{ day }} de {{ month }}</h3>
      </div>
      <div v-if="rows">
        <div v-for="(item, index) in rows" :key="index" class="grid">
          <span class="grid1">{{ item[0] }}</span>
          <span v-for="(data, index1) in item.slice(1, item.length - 1)" :key="index1">
            <span class="weight">
              {{ header[index1] }}
            </span>
            <br />
            {{ data == '' ? '--' : data }}
          </span>
          <span class="grid1">{{ item[item.length - 1] }}</span>
          <button class="button" @click="deleteLog(index)">
            <div class="forma">
              <IconTrash />
            </div>
          </button>
        </div>
        <div v-if="rows.length === 0" class="center">Sem registos neste dia!</div>
      </div>
      <div v-else class="center">Sem dados</div>
    </div>
    <button @click="lerDados" class="button1">Refresh</button>
    <SpinnerCard v-if="spinner"></SpinnerCard>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import SpinnerCard from '@/components/SpinnerCard.vue'
import IconTrash from '@/components/icons/IconTrash.vue'

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
store.dispatch('lerPlanilha', {
  dia: day,
  mes: month,
})

const header = ref(['Ph', 'Temp.', 'Residual', 'Total', 'Transp.', 'Nº', 'Vol', 'Filtros'])
const rows = computed(() => {
  const values = []
  if (store.getters.getTabela.length > 0) {
    for (let i = 0; i < store.getters.getTabela.length; i++) {
      values.push(store.getters.getTabela[i])
    }
  } else if (store.getters.getPiscina === 'Piscina Interior') {
    return JSON.parse(localStorage.getItem('logs'))
  } else {
    return JSON.parse(localStorage.getItem('logs1'))
  }
  return values
})

async function lerDados() {
  const input = {
    dia: day,
    mes: month,
    btn: true,
  }
  await store.dispatch('lerPlanilha', input)
}

function mudarSheet() {
  if (piscina.value === 'Piscina Interior') {
    store.commit('setPiscina', 'Piscina Exterior')
    store.commit('setTabela', [])
    if (localStorage.getItem('logs1') === null) {
      store.dispatch('lerPlanilha', {
        dia: day,
        mes: month,
      })
    }
  } else {
    store.commit('setPiscina', 'Piscina Interior')
    store.commit('setTabela', [])
  }
}

function deleteLog(index) {
  if (confirm('Pretende apagar o registo?')) {
    store.dispatch('deleteLog', { mes: month, index: index, dia: day })
  } else {
    return
  }
}
</script>

<style scoped>
.button1 {
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
  margin-bottom: 0.5rem;
}
.grid1 {
  grid-column: 1 / span 2;
  font-weight: 900;
  color: aliceblue;
  margin-top: 0.5rem;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: 1 / span 2;
  padding: 0.5rem 1rem;
  margin: 0 1.5rem 1.5rem;
  height: 2rem;
  background-color: #e74c3c;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.button:hover {
  background-color: #c0392b;
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(0);
  background-color: #a93226;
}

.weight {
  font-weight: 500;
  color: aliceblue;
}
.forma {
  display: flex;
  align-items: center;
  justify-items: center;
  min-width: 1.2rem;
  min-height: 0.6rem;
}
</style>
