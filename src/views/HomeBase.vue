<template>
  <div class="page1 gap">
    <div class="top">
      <OpenGreeting></OpenGreeting>
    </div>
    <button @click="setPage(true)">
      <IconPiscina class="margin"></IconPiscina>
      <h2>Piscinas</h2>
    </button>
    <button @click="setPage(false)" class="button4">
      <IconEspacos class="margin"></IconEspacos>
      <h2>Locais</h2>
    </button>
    <div class="bottom">
      <IconSettings @click="router.push('/settings')" class="rotate"></IconSettings>
    </div>
  </div>
</template>

<script setup>
import IconPiscina from '@/components/icons/IconPiscina.vue'
import IconEspacos from '@/components/icons/IconEspacos.vue'
import { router } from '@/router'
import { useStore } from 'vuex'
import IconSettings from '@/components/icons/IconSettings.vue'
import OpenGreeting from '@/components/OpenGreeting.vue'

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
  background-color: #0199ad;
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
.button4 {
  background: #c49c27;
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

.bottom {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}
.rotate {
  rotate: -35deg;
}

.top {
  position: absolute;
  top: 0;
  padding-top: 1.2rem;
  width: 100%;
}
</style>
