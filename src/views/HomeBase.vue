<template>
  <div class="page1 gap">
    <button @click="setPage(true)">
      <IconPiscina class="margin"></IconPiscina>
      <h2>Piscinas</h2>
    </button>
    <button @click="setPage(false)">
      <IconEspacos class="margin"></IconEspacos>
      <h2>Locais</h2>
    </button>
  </div>
</template>

<script setup>
import IconPiscina from '@/components/icons/IconPiscina.vue'
import IconEspacos from '@/components/icons/IconEspacos.vue'
import { router } from '@/router'
import { useStore } from 'vuex'

const store = useStore()

store.commit('setPage', 'home')

function setPage(page) {
  if (page) {
    router.push('/piscina')
    store.commit('setPage', 'piscina')
  } else {
    router.push('/quartos')
    store.commit('setPage', 'quartos')
  }
}
</script>

<style scoped>
button {
  margin-top: 1rem;
  padding: 20px 30px;
  background-color: #00bcd4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 36dvw;
}

h2 {
  font-weight: 600;
}

.gap {
  gap: 1.5rem;
}

.page1 {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;
  position: absolute;
  width: 99dvw;
}

.margin {
  margin: 0.2rem;
}
</style>
