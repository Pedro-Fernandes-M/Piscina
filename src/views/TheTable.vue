<template>
  <div class="page">
    <div class="form margin-1">
      <div class="center">
        <h2 class="text" v-if="redirect">Espaços</h2>
        <h2 @click="mudarSheet" class="text" v-else>
          {{ piscina }}
        </h2>
        <h3>{{ day }} de {{ month }}</h3>
      </div>
      <div v-if="data" class="gap">
        <div v-for="(item, index) in data" :key="index">
          <div v-if="item.length > 0" class="grid">
            <span class="grid1 margin">
              <span class="font" v-if="redirect"
                >Local
                <span>
                  {{ item[1] }}
                </span>
              </span>
              <span class="font" v-else>
                Hora
                <span>
                  {{ item[0] }}
                </span>
              </span>
            </span>
            <div v-if="redirect" class="grid2 grid3">
              <span
                v-for="(data, index1) in item
                  .slice(2)
                  .filter((item) => item !== 'Filipe Fernandes')"
                :key="index1"
                :class="[header1[index1] === 'Comentários' ? 'grid2' : '']"
              >
                <span class="weight">
                  {{ header1[index1] }}
                </span>
                <br />
                {{ data == '' ? '--' : data }}
              </span>
              <span class="grid1">
                <span class="font"> Responsável </span>
                {{
                  item[item.length - 1] === 'Filipe Fernandes'
                    ? item[item.length - 1]
                    : item[item.length - 2]
                }}
              </span>
            </div>
            <div v-else class="grid2 grid3">
              <span
                v-for="(data, index1) in item
                  .slice(1)
                  .filter((item) => item !== 'Filipe Fernandes')"
                :key="index1"
                :class="[header[index1] === 'Obs.' ? 'grid2' : '']"
              >
                <span class="weight">
                  {{ header[index1] }}
                </span>
                <br />
                {{ data == '' ? '--' : data }}
              </span>
              <span class="grid1">
                <span class="font"> Responsável </span>
                {{
                  item[item.length - 1] === 'Filipe Fernandes'
                    ? item[item.length - 1]
                    : item[item.length - 2]
                }}
              </span>
            </div>
            <button class="button" @click="alert(index)">
              <div class="forma">
                <IconTrash />
              </div>
            </button>
            <button class="button btn-color" @click="alert1(index, true)">
              <div class="forma">
                <IconEdit />
              </div>
            </button>
          </div>
        </div>
        <div v-if="data.length === 0" class="center">Sem registos neste dia!</div>
      </div>
      <div v-else class="center">Sem dados</div>
      <div class="center">
        <button @click="lerDados" class="button1">Refresh</button>
      </div>
    </div>
    <transition name="fade-slide" mode="out-in">
      <SpinnerCard v-if="spinner"></SpinnerCard>
    </transition>
    <transition name="fade-slide" mode="out-in">
      <AlertCard
        v-if="store.getters['alert/getAlert']"
        :text="store.getters['alert/getText']"
        :btn="store.getters['alert/getBtn']"
        :choice="store.getters['alert/getChoice']"
      ></AlertCard>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SpinnerCard from '@/components/SpinnerCard.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import { previousRoute, router } from '@/router'
import AlertCard from '@/components/AlertCard.vue'
import IconEdit from '@/components/icons/IconEdit.vue'

const store = useStore()
const route = useRoute()

const spinner = computed(() => {
  return store.getters.getSpinner
})

const redirect = ref(false)
if (previousRoute.value?.path === '/quartos' && route.path === '/table') {
  redirect.value = true
}

const piscina = computed(() => {
  return store.getters.getPiscina
})

const index = ref()
const edit = ref()

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

if (redirect.value) {
  store.dispatch('lerPlanilha', {
    dia: day,
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    options: 'quartos',
  })
} else {
  store.dispatch('lerPlanilha', {
    dia: day,
    mes: month,
    options: 'piscina',
  })
}

const header = ref([
  'Ph',
  'Temp.',
  'Residual',
  'Total',
  'Transp.',
  'N.º',
  'Vol.',
  'Filtros',
  'Obs.',
])
const header1 = ref([
  'Temperatura',
  'Cloro',
  'pH',
  'Temperatura',
  'Cloro',
  'pH',
  'Comentários',
  'Assinatura',
])

const data = computed(() => {
  const values = []
  if (store.getters.getTabela.length > 0) {
    for (let i = 0; i < store.getters.getTabela.length; i++) {
      values.push(store.getters.getTabela[i])
    }
  } else if (redirect.value) {
    return JSON.parse(localStorage.getItem('logs2'))
  } else if (store.getters.getPiscina === 'Piscina Interior') {
    return JSON.parse(localStorage.getItem('logs'))
  } else {
    return JSON.parse(localStorage.getItem('logs1'))
  }
  return values
})

async function lerDados() {
  if (redirect.value) {
    const input = {
      dia: day,
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      options: 'quartos',
      btn: true,
    }
    await store.dispatch('lerPlanilha', input)
  } else {
    const input = {
      dia: day,
      mes: month,
      options: 'piscina',
      btn: true,
    }
    await store.dispatch('lerPlanilha', input)
  }
}

function mudarSheet() {
  if (piscina.value === 'Piscina Interior') {
    store.commit('setPiscina', 'Piscina Exterior')
    store.commit('setTabela', [])
    if (localStorage.getItem('logs1') === null) {
      store.dispatch('lerPlanilha', {
        dia: day,
        mes: month,
        options: 'piscina',
      })
    }
  } else {
    store.commit('setPiscina', 'Piscina Interior')
    store.commit('setTabela', [])
    if (localStorage.getItem('logs') === null) {
      store.dispatch('lerPlanilha', {
        dia: day,
        mes: month,
        options: 'piscina',
      })
    }
  }
}
let del = false

function alert(index1) {
  if (redirect.value) {
    index.value = index1
    store.commit('alert/setBtn', 'confirm')
    store.commit(
      'alert/setText',
      `Pretende apagar o registo da planilha - Controlo Água Potável Legionela - Espaços?`,
    )
    store.commit('alert/setAlert')
    del = true
  } else {
    index.value = index1
    store.commit('alert/setBtn', 'confirm')
    store.commit(
      'alert/setText',
      `Pretende apagar o registo da planilha - ${store.getters.getPiscina}?`,
    )
    store.commit('alert/setAlert')
  }
}

function alert1(index1, edit1) {
  index.value = index1
  if (redirect.value) {
    store.commit('setEdit', true)
    store.commit('alert/setBtn', 'confirm')
    store.commit(
      'alert/setText',
      `Pretende editar o registo da planilha - Controlo Água Potável Legionela - Espaços?`,
    )
    store.commit('alert/setAlert')
    del = false
  } else {
    edit.value = edit1
    store.commit('setEdit', true)
    store.commit('alert/setBtn', 'confirm')
    store.commit(
      'alert/setText',
      `Pretende editar o registo da planilha - ${store.getters.getPiscina}?`,
    )
    store.commit('alert/setAlert')
  }
}

const response = computed(() => store.getters['alert/getResponse'])
watch(response, async (novo) => {
  if (novo && edit.value) {
    store.commit('setChange', data.value[index.value])
    await store.dispatch('deleteLog', { mes: month, index: index.value, dia: day, del: false })
    store.commit('alert/setResponse', null)
    edit.value = false
    router.push('/piscina')
  } else if (novo && redirect.value) {
    store.commit('setChange', data.value[index.value])
    store.dispatch('deleteLog', {
      ano: new Date().getFullYear(),
      index: index.value,
      dia: day,
      del: false,
      options: 'quartos',
    })
    if (del == false) {
      router.push('/quartos')
    }
    store.commit('alert/setResponse', null)
  } else if (novo) {
    store.dispatch('deleteLog', { mes: month, index: index.value, dia: day, del: true })
    store.commit('alert/setResponse', null)
  }
})
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
  margin-top: 1.5rem;
  width: 100%;
}
.btn {
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 5px;
  border-top: dashed whitesmoke 1.2px;
}
.grid1 {
  grid-column: 1 / span 2;
  color: aliceblue;
}
.grid2 {
  grid-column: 1 / span 2;
}
.grid3 {
  display: grid;
  gap: 0.8rem;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem 1.1rem;
  margin-top: 0.5rem;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
  margin-bottom: 0.5rem;
  height: 2rem;
  background-color: #e74c3c;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
.margin-1 {
  margin-top: 2rem;
}

.weight {
  font-weight: 580;
  color: aliceblue;
}

.font {
  font-weight: 900;
  color: aliceblue;
  display: grid;
}
.forma {
  display: flex;
  align-items: center;
  justify-items: center;
}
.gap {
  display: grid;
  gap: 0.8rem;
}

.margin {
  margin-bottom: 0.4rem;
  margin-top: 0.4rem;
}

.btn-color {
  background-color: rgb(39, 105, 197);
}
</style>
