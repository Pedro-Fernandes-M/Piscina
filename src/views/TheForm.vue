<template>
  <div class="page">
    <form action="">
      <div class="center">
        <h2 @click="mudarSheet">
          {{ piscina }}
        </h2>
        <h3>{{ day }} de {{ month }}</h3>
      </div>
      <div class="input">
        <label for="ph">PH</label>
        <input :class="[ph === '' ? 'input-erro' : '']" type="number" v-model="ph" />
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
        <label for="">Transparência</label>
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
        <label for="num">Nº Banhistas</label>
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
      <button @click.prevent="preencher" type="submit">Preencher</button>
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
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

const ph = ref(null)
const num_banhistas = ref(0)
const horas = ref(null)
const temperatura_agua = ref(0)
const residual_desinfetante = ref(null)
const total_residual = ref(null)
const transparencia = ref(null)
const volume = ref(0)
const lavagem_filtros = ref(null)
const observacoes = ref('')

function mudarSheet() {
  if (piscina.value === 'Piscina Interior') {
    store.commit('setPiscina', 'Piscina Exterior')
  } else {
    store.commit('setPiscina', 'Piscina Interior')
  }
}

const validade = computed(() => {
  const n = Number(num_banhistas.value)
  const ph_c = Number(String(ph.value).replace(',', '.'))
  const temp = Number(String(temperatura_agua.value).replace(',', '.'))
  const desi = Number(String(residual_desinfetante.value).replace(',', '.'))
  const total = Number(String(total_residual.value).replace(',', '.'))
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

async function preencher() {
  const hoje = new Date()
  let hours = hoje.getHours()
  let minutes = hoje.getMinutes()
  hours = String(hours).padStart(2, '0')
  minutes = String(minutes).padStart(2, '0')
  horas.value = hours + ':' + minutes + 'h'

  if (
    validade.value &&
    horas.value != null &&
    month != null &&
    day != null &&
    transparencia.value != null &&
    lavagem_filtros.value != null
  ) {
    const form = {
      horas: horas,
      ph: ph,
      num_banhistas: num_banhistas,
      transparencia: transparencia,
      temperatura_agua: temperatura_agua,
      residual_desinfetante: residual_desinfetante,
      total_residual: total_residual,
      volume: volume,
      lavagem_filtros: lavagem_filtros,
      observacoes: observacoes,
      mes: month,
      dia: day,
    }
    await store.dispatch('preencherSheet', form)

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
  } else {
    alert('Formulário mal preenchido!')
  }
}
</script>

<style scoped>
.page {
  margin: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
}

form {
  background-color: #3a3a3a;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 300px;
}

.center {
  text-align: center;
}

h2 {
  color: aliceblue;
}

.input {
  display: grid;
  margin-top: 0.5rem;
  padding-bottom: 1rem;
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
  transition: background 0.2s ease;
}

button:hover {
  background-color: #0097a7;
}
</style>
