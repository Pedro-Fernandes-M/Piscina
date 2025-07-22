<template>
  <div class="wrapper">
    <div class="display">
      <div class="line">
        <transition-group name="flip" tag="div" class="char-group">
          <span
            v-for="(char, i) in propChars"
            :key="`prop-${char}-${i}`"
            :style="{ transitionDelay: `${i * 0.12}s`, marginLeft: i == 5 ? '0.4rem' : '' }"
            class="char"
            >{{ char }}</span
          >
        </transition-group>
      </div>
      <div class="line">
        <transition-group name="flip" tag="div" class="char-group">
          <span
            v-for="(char, i) in valChars"
            :key="`val-${char}-${i}`"
            :style="{ transitionDelay: `${i * 0.12}s` }"
            class="char"
            >{{ char }}</span
          >
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const mapa = computed(() => {
  return store.getters.getMapa
})

const propChars = ref(['', ''])
const valChars = ref(['', ''])

const escolhido = ref(null)

watch(
  () => escolhido.value?.prop,
  (newVal) => {
    if (newVal) {
      setInterval(() => {
        propChars.value = newVal.split('')
      }, 100)
    }
  },
)

watch(
  () => escolhido.value?.val,
  (newVal) => {
    if (newVal) {
      setInterval(() => {
        valChars.value = newVal.split('')
      }, 1000)
    }
  },
)

function escolherElemento() {
  const reg_key = 'reg_map'

  const reg_raw = localStorage.getItem(reg_key)
  const reg_map = reg_raw ? JSON.parse(reg_raw) : []

  // Constrói todas as combinações possíveis
  const todas = []

  for (const prop in mapa.value.mapa) {
    if (Array.isArray(mapa.value.mapa[prop]) && mapa.value.mapa[prop].length >= 5) {
      for (const val of mapa.value.mapa[prop]) {
        todas.push({ prop, val })
      }
    }
  }

  // Filtra combinações válidas
  const validas = todas.filter(({ prop, val }) => {
    const id = `${prop}:${val}`

    // Verifica se apareceu nos últimos 5 dias
    const repetido = reg_map.some((reg) => reg.id === id)

    // Verifica se há outro da mesma propriedade nos últimos 5 dias
    const mesmaPropriedadeRecente = reg_map.some((reg) => reg.id.startsWith(`${prop}:`))

    return !repetido && !mesmaPropriedadeRecente
  })

  if (validas.length === 0) {
    console.warn('Sem elementos válidos. A ignorar restrições temporariamente.')
    validas.push(...todas) // fallback: permite todos se não houver nenhuma válida
  }

  // Escolhe aleatoriamente
  escolhido.value = validas[Math.floor(Math.random() * validas.length)]

  store.commit('setLocal', escolhido)
}

escolherElemento()
</script>

<style scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85); /* fundo semi-escuro */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* fica por cima de tudo */
}
.display {
  font-family: monospace;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.line {
  display: flex;
  justify-content: center;
  gap: 0.15rem;
  margin: 0.25rem 0;
  min-height: 3.1rem;
}

.flip-char {
  display: inline-block;
  position: relative;
  perspective: 400px;
}
.char {
  display: inline-block;
  font-size: 2rem;
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}

/* Transição de entrada */
.flip-enter-from {
  transform: rotateX(90deg);
  opacity: 0;
}
.flip-enter-to {
  transform: rotateX(0deg);
  opacity: 1;
}

/* Transição de saída */
.flip-leave-from {
  transform: rotateX(0deg);
  opacity: 1;
}
.flip-leave-to {
  transform: rotateX(-90deg);
  opacity: 0;
}
</style>
