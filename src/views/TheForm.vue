<template>
  <div class="page">
    <div class="arrow">
      <IconBack @click="router.push('/')"></IconBack>
    </div>
    <form action="" class="form">
      <div class="center">
        <h2 @click="mudarSheet">
          {{ piscina }}
        </h2>
        <h3>{{ day }} de {{ month }}</h3>
      </div>
      <div class="input">
        <label for="">Temperatura Água</label>
        <input
          :class="[temperatura_agua === '' ? 'input-erro' : '']"
          type="number"
          v-model="temperatura_agua"
        />
      </div>
      <div class="input">
        <label for="">Residual Desinfetante</label>
        <input
          :class="[residual_desinfetante === '' ? 'input-erro' : '']"
          type="number"
          v-model="residual_desinfetante"
        />
      </div>
      <div class="input">
        <label for="">Total Desinfetante</label>
        <input
          :class="[total_residual === '' ? 'input-erro' : '']"
          type="number"
          v-model="total_residual"
        />
      </div>
      <div class="input">
        <label for="ph">PH</label>
        <input :class="[ph === '' ? 'input-erro' : '']" type="number" v-model="ph" />
      </div>
      <div class="input">
        <label for="">Transparência</label>
        <br />
        <select
          name="transparencia"
          v-model="transparencia"
          :class="[transparencia === '' ? 'input-erro' : '']"
        >
          <option value="Boa">Boa</option>
          <option value="Com alterações">Com alterações</option>
        </select>
      </div>
      <div class="input">
        <label for="">Lavagem Filtros</label>
        <br />
        <select
          name="lavagem_filtros"
          v-model="lavagem_filtros"
          :class="[lavagem_filtros === '' ? 'input-erro' : '']"
        >
          <option value="Sim">Sim</option>
          <option value="Não">Não</option>
        </select>
      </div>
      <div class="input">
        <label for="">Volume Reposição</label>
        <input :class="[volume === '' ? 'input-erro' : '']" type="number" v-model="volume" />
      </div>
      <div class="input">
        <label for="num">N.º Banhistas</label>
        <input
          :class="[num_banhistas === '' ? 'input-erro' : '']"
          type="number"
          v-model="num_banhistas"
        />
      </div>
      <div class="input">
        <label for="obs">Observações</label>
        <input
          :class="[observacoes === null ? 'input-erro' : '']"
          type="text"
          v-model="observacoes"
        />
      </div>
      <button @click.prevent="alert" type="submit">Preencher</button>
    </form>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import SpinnerCard from '@/components/SpinnerCard.vue'
import { previousRoute, router } from '@/router'
import { useRoute } from 'vue-router'
import AlertCard from '@/components/AlertCard.vue'
import IconBack from '@/components/icons/IconBack.vue'

const store = useStore()
const route = useRoute()

const spinner = computed(() => {
  return store.getters.getSpinner
})

const redirect = ref(false)
if (previousRoute.value?.path === '/table' && route.path === '/piscina' && store.getters.getEdit) {
  redirect.value = true
}

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
const piscina = computed(() => {
  return store.getters.getPiscina
})
const go = ref()

const ph = ref()
const num_banhistas = ref()
const horas = ref()
const temperatura_agua = ref()
const residual_desinfetante = ref()
const total_residual = ref()
const transparencia = ref()
const volume = ref()
const lavagem_filtros = ref()
const observacoes = ref()

const reset = () => {
  if (redirect.value != true) {
    ph.value = store.getters.getRestore.ph || null
    num_banhistas.value = store.getters.getRestore.num_banhistas || 0
    horas.value = store.getters.getRestore.horas || null
    temperatura_agua.value = store.getters.getRestore.temperatura_agua || 0
    residual_desinfetante.value = store.getters.getRestore.residual_desinfetante || null
    total_residual.value = store.getters.getRestore.total_residual || null
    transparencia.value = store.getters.getRestore.transparencia || null
    volume.value = store.getters.getRestore.volume || 0
    lavagem_filtros.value = store.getters.getRestore.lavagem_filtros || null
    observacoes.value = store.getters.getRestore.observacoes || ''
  }
}
onMounted(reset)

const restore = () => {
  if (
    ph.value != null ||
    num_banhistas.value != 0 ||
    horas.value != null ||
    temperatura_agua.value != 0 ||
    residual_desinfetante.value != null ||
    total_residual.value != null ||
    transparencia.value != null ||
    volume.value != 0 ||
    lavagem_filtros.value != null ||
    observacoes.value != ''
  ) {
    store.commit('setRestore', {
      ph: ph.value,
      num_banhistas: num_banhistas.value,
      horas: horas.value,
      temperatura_agua: temperatura_agua.value,
      residual_desinfetante: residual_desinfetante.value,
      total_residual: total_residual.value,
      transparencia: transparencia.value,
      volume: volume.value,
      lavagem_filtros: lavagem_filtros.value,
      observacoes: observacoes.value,
    })
  }
}

onBeforeUnmount(restore)

watch(
  redirect,
  (novo) => {
    if (novo) {
      const change = store.getters.getChange
      if (change) {
        horas.value = change[0]
        ph.value = change[1]
        temperatura_agua.value = change[2]
        residual_desinfetante.value = change[3]
        total_residual.value = change[4]
        transparencia.value = change[5]
        num_banhistas.value = change[6]
        volume.value = change[7] === '' ? 0 : change[7]
        lavagem_filtros.value = change[8]
        observacoes.value = change[10]
      }
      store.commit('setChange', [])
      store.commit('setEdit', false)
    }
  },
  { immediate: true },
)

function mudarSheet() {
  if (piscina.value === 'Piscina Interior') {
    store.commit('setPiscina', 'Piscina Exterior')
  } else {
    store.commit('setPiscina', 'Piscina Interior')
  }
}

function formatDecimal(val) {
  const n = String(val).replace(',', '.')
  return n.startsWith('.') ? '0' + n : n
}

const validade = computed(() => {
  const n = Number(num_banhistas.value)
  const ph_c = Number(String(ph.value).replace(',', '.')) //entre 5 a 10
  const temp = Number(String(temperatura_agua.value).replace(',', '.')) //
  const desi = Number(formatDecimal(residual_desinfetante.value)) // 0 e 2.5
  const total = Number(formatDecimal(total_residual.value)) // entre 0 e 3
  const vol = Number(String(volume.value).replace(',', '.'))

  const numValido = !isNaN(n) && n >= 0 && Number.isInteger(n)
  const phCimaValido = !isNaN(ph_c) && ph_c >= 0
  const temperatura_agua_Valido = !isNaN(temp) && temp > 0
  const residual_desinfetante_Valido = !isNaN(desi) && desi >= 0
  const total_residual_Valido = !isNaN(total) && total >= 0
  const volume_Valido = !isNaN(vol) && vol >= 0

  return (
    numValido &&
    phCimaValido &&
    temperatura_agua_Valido &&
    residual_desinfetante_Valido &&
    total_residual_Valido &&
    volume_Valido
  )
})

const aviso = computed(() => {
  return (
    ph.value < 10 &&
    ph.value > 5 &&
    formatDecimal(residual_desinfetante.value) > 0 &&
    formatDecimal(residual_desinfetante.value) < 2.5 &&
    formatDecimal(total_residual.value) > 0 &&
    formatDecimal(total_residual.value) < 3 &&
    formatDecimal(total_residual.value) >= formatDecimal(residual_desinfetante.value)
  )
})

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

function alert() {
  go.value = false
  if (horas.value === null) {
    const hoje = new Date()
    let hours = hoje.getHours()
    let minutes = hoje.getMinutes()
    hours = String(hours).padStart(2, '0')
    minutes = String(minutes).padStart(2, '0')
    horas.value = hours + ':' + minutes + 'h'
  }
  if (
    validade.value &&
    horas.value != null &&
    month != null &&
    day != null &&
    transparencia.value != null &&
    lavagem_filtros.value != null &&
    aviso.value
  ) {
    store.commit('alert/setResponse', null)
    store.commit('alert/setBtn', 'confirm')
    store.commit(
      'alert/setText',
      `Pretende efetuar registo na planilha - ${store.getters.getPiscina}?`,
    )
    store.commit('alert/setAlert')
  } else if (!aviso.value && validade.value) {
    alert1()
  } else {
    store.commit('alert/setBtn', 'alert')
    store.commit('alert/setText', `Formulário mal preenchido!`)
    store.commit('alert/setAlert')
  }
}

function alert1() {
  store.commit('alert/setResponse', null)
  store.commit('alert/setBtn', 'confirm')
  store.commit(
    'alert/setText',
    `Alguns valores encontram-se fora dos limites normais pretende registar-los na planilha - ${store.getters.getPiscina}?`,
  )
  store.commit('alert/setAlert')
}

async function preencher() {
  const form = {
    horas: horas,
    ph: ph,
    num_banhistas: num_banhistas,
    transparencia: transparencia,
    temperatura_agua: temperatura_agua,
    residual_desinfetante: formatDecimal(residual_desinfetante.value),
    total_residual: formatDecimal(total_residual.value),
    volume: volume,
    lavagem_filtros: lavagem_filtros,
    observacoes: observacoes,
    mes: month,
    dia: day,
    btn: true,
    options: 'piscina',
  }
  try {
    const response = await store.dispatch('preencherSheet', form)

    if (response.status === 200) {
      ph.value = null
      num_banhistas.value = 0
      horas.value = null
      temperatura_agua.value = 0
      residual_desinfetante.value = null
      total_residual.value = null
      transparencia.value = null
      volume.value = 0
      lavagem_filtros.value = null
      observacoes.value = ''
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
.center {
  text-align: center;
}

h2 {
  color: aliceblue;
  font-weight: 1000;
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

select {
  width: 100%;
  background-color: #444; /* fundo escuro */
  color: #f0f0f0; /* texto claro */
  padding: 10px 14px;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  appearance: none; /* remove setinha padrão */
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg fill='%23aaa' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

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
.arrow {
  width: 100%;
  text-align: left;
  padding: 1.5rem 1.5rem 0.2rem 1.5rem;
}
</style>
