<template>
  <div class="page">
    <div class="arrow">
      <IconBack @click="router.push('/home')"></IconBack>
    </div>
    <div class="form">
      <div class="center">
        <h2>Local</h2>
        <h3>{{ day }} de {{ monthN }}</h3>
      </div>
      <div class="center1">
        <div class="input">
          <label for="">Local</label>
          <input :class="[quarto === '' ? 'input-erro' : '']" type="text" v-model.trim="quarto" />
        </div>
        <div class="center padding-1">
          <h3>Água Quente</h3>
        </div>
        <div class="input">
          <label for="">Temperatura</label>
          <input
            :class="[temp_quente === '' ? 'input-erro' : '']"
            type="number"
            v-model="temp_quente"
          />
        </div>
        <div class="input">
          <label for="">Cloro</label>
          <input
            :class="[cloro_quente === '' ? 'input-erro' : '']"
            type="number"
            v-model="cloro_quente"
          />
        </div>
        <div class="input">
          <label for="">pH</label>
          <input
            :class="[ph_quente === '' ? 'input-erro' : '']"
            type="number"
            v-model="ph_quente"
          />
        </div>
        <div class="center padding-1">
          <h3>Água Fria</h3>
        </div>
        <div class="input">
          <label for="">Temperatura</label>
          <input
            :class="[temp_fria === '' ? 'input-erro' : '']"
            type="number"
            v-model="temp_fria"
          />
        </div>
        <div class="input">
          <label for="">Cloro</label>
          <input
            :class="[cloro_fria === '' ? 'input-erro' : '']"
            type="number"
            v-model="cloro_fria"
          />
        </div>
        <div class="input">
          <label for="">pH</label>
          <input :class="[ph_fria === '' ? 'input-erro' : '']" type="number" v-model="ph_fria" />
        </div>

        <div class="input padding-1">
          <label for="">Comentário</label>
          <input
            :class="[comentarios === null ? 'input-erro' : '']"
            type="text"
            v-model="comentarios"
          />
        </div>
      </div>
      <button @click.prevent="alert" type="submit">Preencher</button>
    </div>
  </div>
</template>

<script setup>
import IconBack from '@/components/icons/IconBack.vue'
import { previousRoute, router } from '@/router'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()

onMounted(() => {
  store.commit('setPage', 'quarto')
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
const month = new Date().getMonth() + 1
const monthN = monthNames[month - 1]

let data = day + '/' + month
const quarto = ref(null)
const temp_quente = ref(null)
const cloro_quente = ref(null)
const ph_quente = ref(null)
const temp_fria = ref(null)
const cloro_fria = ref(null)
const ph_fria = ref(null)
const comentarios = ref('')

const redirect = ref(false)
if (previousRoute.value?.path === '/table' && route.path === '/quartos' && store.getters.getEdit) {
  redirect.value = true
}

watch(
  redirect,
  (novo) => {
    if (novo) {
      const change = store.getters.getChange

      if (change) {
        data = change[0]
        quarto.value = change[1]
        temp_quente.value = change[2]
        cloro_quente.value = change[3] == 'Low' ? 0 : change[3]
        ph_quente.value = change[4]
        temp_fria.value = change[5]
        cloro_fria.value = change[6] == 'Low' ? 0 : change[6]
        ph_fria.value = change[7]
        comentarios.value = change[8]
      }
      store.commit('setChange', [])
      store.commit('setEdit', false)
    }
  },
  { immediate: true },
)

function formatDecimal(val) {
  const n = String(val).replace(',', '.')
  return n.startsWith('.') ? '0' + n : n
}

const validade_quarto = computed(() => ({
  data: !!data,

  quarto: !!quarto.value,

  temp_quente: Number(temp_quente.value) >= 0,
  cloro_quente: Number(cloro_quente.value) >= 0 && Math.abs(cloro_quente.value) <= 0.15,
  ph_quente:
    Number(formatDecimal(ph_quente.value)) >= 6.5 && Number(formatDecimal(ph_quente.value)) <= 9.5,

  temp_fria: Number(temp_fria.value) >= 0,
  cloro_fria: Number(cloro_fria.value) >= 0.1 && Number(cloro_fria.value) <= 0.65,
  ph_fria:
    Number(formatDecimal(ph_fria.value)) >= 6.5 && Number(formatDecimal(ph_fria.value)) <= 9.5,

  def_temp: Number(temp_fria.value) <= Number(temp_quente.value),

  comentarios: true, // opcional
}))

const preenchido_quarto = computed(() => ({
  data: data != null && data !== '',
  quarto: quarto.value != null && quarto.value !== '',
  temp_quente: temp_quente.value != null && temp_quente.value !== '',
  cloro_quente: cloro_quente.value != null && cloro_quente.value !== '',
  ph_quente: ph_quente.value != null && ph_quente.value !== '',
  temp_fria: temp_fria.value != null && temp_fria.value !== '',
  cloro_fria: cloro_fria.value != null && cloro_fria.value !== '',
  ph_fria: ph_fria.value != null && ph_fria.value !== '',
}))

function alert() {
  if (Object.values(preenchido_quarto.value).some((value) => value === false)) {
    store.commit('alert/setBtn', 'alert')
    store.commit('alert/setText', `Formulário mal preenchido!`)
    store.commit('alert/setAlert')
  } else if (Object.values(validade_quarto.value).every(Boolean)) {
    store.commit('alert/setResponse', null)
    store.commit('alert/setBtn', 'confirm')
    store.commit(
      'alert/setText',
      `Pretende efetuar registo na planilha - Controlo Água Potável - Legionela?`,
    )
    store.commit('alert/setAlert')
  } else {
    store.commit('alert/setResponse', null)
    store.commit('alert/setBtn', 'confirm')
    store.commit(
      'alert/setText',
      `Valores anormais detetados.\nPretende efetuar registo na planilha - Controlo Água Potável - Legionela, na mesma?`,
    )
    store.commit('alert/setAlert')
  }
}

const response = computed(() => {
  return store.getters['alert/getResponse']
})

watch(response, async (novo) => {
  if (novo) {
    preencher()
  } else {
    return
  }
})

async function preencher() {
  const payload = {
    data: data,
    quarto: quarto.value,
    temp_quente: temp_quente.value,
    cloro_quente: cloro_quente.value,
    ph_quente: ph_quente.value,
    temp_fria: temp_fria.value,
    cloro_fria: cloro_fria.value,
    ph_fria: ph_fria.value,
    comentarios: comentarios.value,
    options: 'quartos',
    ano: new Date().getFullYear(),
    btn: true,
  }

  try {
    const response = await store.dispatch('preencherSheet', payload)
    if (response.status === 200) {
      quarto.value = null
      temp_quente.value = null
      cloro_quente.value = null
      ph_quente.value = null
      temp_fria.value = null
      cloro_fria.value = null
      ph_fria.value = null
      comentarios.value = ''
    } else if (response.status != 399) {
      store.commit('alert/setBtn', 'alert')
      store.commit('alert/setText', `Erro ao preencher a planilha, tente submeter de novo.`)
      store.commit('alert/setAlert')
    }
  } catch (error) {
    store.commit('alert/setBtn', 'alert')
    store.commit('alert/setText', `Erro ao preencher a planilha, tente submeter de novo.`)
    store.commit('alert/setAlert')
    console.error(error)
  }
}
</script>

<style scoped>
button {
  margin-top: 1rem;
  padding: 10px 20px;
  background-color: #00bcd4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.center {
  text-align: center;
}

.input {
  display: grid;
  margin-top: 0.5rem;
  padding-bottom: 1rem;
  text-align: left;
  display: block;
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

.input-erro {
  box-shadow: 0 0 0 2px #d42e00;
}

h2 {
  color: aliceblue;
  font-weight: 1000;
}

.line {
  border-top: dashed 1px rgb(205, 200, 200);
}
.padding-1 {
  padding-top: 1rem;
}
.arrow {
  width: 100%;
  text-align: left;
  padding: 1.8rem 1.5rem 0 1.1rem;
  position: absolute;
  top: 0;
}
</style>
