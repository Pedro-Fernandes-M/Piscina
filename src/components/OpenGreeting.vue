<template>
  <div class="flex">
    <div v-if="nome" class="align-1">
      <h2>{{ greeting() }},</h2>
      <h2>{{ nome.split(' ')[0] }}</h2>
    </div>
    <div :class="[nome ? 'align-2' : 'align']">
      <h4 :class="[nome ? 'text-right' : '']">{{ temp || '--' }}</h4>
      <h4 :class="[nome ? 'text-right' : '']">{{ humidity || '--' }}</h4>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const nome = computed(() => {
  return store.getters['defenicoes/getAssinatura']
})
const temp = computed(() => {
  return store.getters.getTemp
})
const humidity = computed(() => {
  return store.getters.getHumidity
})
const time = JSON.parse(localStorage.getItem('time'))

function greeting() {
  const hour = new Date().getUTCHours()

  if (hour >= 5 && hour < 12) {
    return 'Bom dia'
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde'
  } else {
    return 'Boa noite'
  }
}

async function getWeather() {
  const stamp = Date.now()
  const hora = 60 * 15 * 1000

  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0') // meses vão de 0 a 11
  const dia = String(hoje.getDate()).padStart(2, '0')

  const dataFormatada = `${ano}-${mes}-${dia}`
  const lat = store.getters['defenicoes/getLat']
  const long = store.getters['defenicoes/getLong']

  if (time === null || stamp - time > hora) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m&timezone=auto&start_date=${dataFormatada}&end_date=${dataFormatada}&format=json&timeformat=unixtime`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`)
      }

      const data = await response.json()

      store.commit('setTemp', data?.current?.temperature_2m + data.current_units?.temperature_2m)
      store.commit(
        'setHumidity',
        data?.current?.relative_humidity_2m + data.current_units?.relative_humidity_2m,
      )
      localStorage.setItem('time', JSON.stringify(Date.now()))
      localStorage.setItem(
        'temp',
        JSON.stringify(data?.current?.temperature_2m + data.current_units?.temperature_2m),
      )
      localStorage.setItem(
        'humidity',
        JSON.stringify(
          data?.current?.relative_humidity_2m + data.current_units?.relative_humidity_2m,
        ),
      )
    } catch (error) {
      return error
    }
  }
}

onBeforeMount(getWeather)
</script>

<style scoped>
.flex {
  display: grid;
  grid-template-columns: auto auto;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  text-align: justify;
  font-family: Arial, Helvetica, sans-serif;
}

.align {
  display: grid;
  align-items: center;
  justify-content: start;
  margin-top: 0.25rem;
}
.align-1 {
  display: flex;
  flex-direction: column;
  justify-content: baseline;
}

.align-2 {
  display: grid;
  align-items: center;
  justify-content: end;
  margin-top: 0.25rem;
}

.text-right {
  text-align: end;
}
</style>
