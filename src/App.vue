<template>
  <router-view v-slot="{ Component }" v-if="mobile">
    <transition name="fade-slide" mode="out-in">
      <component :is="Component" @touchstart="onTouchStart" @touchend="onTouchEnd" />
    </transition>
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
  </router-view>
  <div v-else class="full">Only Mobile</div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useStore } from 'vuex'
import { previousRoute, router } from './router'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AlertCard from './components/AlertCard.vue'
import SpinnerCard from './components/SpinnerCard.vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const store = useStore()

const spinner = computed(() => {
  return store.getters.getSpinner
})

const mobile = computed(() => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent))

store.commit('setMapa', JSON.parse(localStorage.getItem('mapa')))

document.addEventListener('contextmenu', (event) => event.preventDefault())

document.addEventListener('keydown', (event) => {
  if (
    event.key === 'F12' ||
    (event.ctrlKey && event.shiftKey && event.key === 'I') ||
    (event.ctrlKey && event.key === 'J') ||
    (event.ctrlKey && event.key === 'U')
  ) {
    event.preventDefault()
  }
})

function detectDevTools() {
  const devToolsCheck = new Function('debugger')
  let isDevToolsOpen = false

  devToolsCheck() // Initial trigger for the debugger.

  setInterval(() => {
    const start = performance.now()
    devToolsCheck()
    const end = performance.now()

    // If `debugger` caused a significant delay, it likely indicates DevTools is open.
    if (end - start > 100) {
      if (!isDevToolsOpen) {
        console.warn('DevTools detected! The app will stop.')
        isDevToolsOpen = true

        // Actions to take when DevTools is detected
        stopApp()
      }
    } else {
      isDevToolsOpen = false
    }
  }, 500) // Check every 500ms
}

// Function to stop the app
function stopApp() {
  const displayHeight = window.innerHeight
  const displayWidth = window.innerWidth
  document.body.innerHTML = `<div class="color" style="height:${displayHeight}px;width:${displayWidth};text-align:center;display:flex;justify-content: center;align-items:center"><h1>Unauthorized Access<h1/></div>`
  throw new Error('DevTools detected! App execution stopped.')
}

// Call the detection function
detectDevTools()

const update = ref(false)

store.dispatch('defenicoes/getSettings')
store.commit('setTemp', JSON.parse(localStorage.getItem('temp')))
store.commit('setHumidity', JSON.parse(localStorage.getItem('humidity')))

onBeforeUnmount(() => {
  clearStorage()
})

const touchStartX = ref(0)
const touchEndX = ref(0)

const onTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const onTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX
  if (touchStartX.value - touchEndX.value > 150) {
    if (store.getters.getPage === 'piscina' || store.getters.getPage === 'quarto') {
      store.commit('setPage', 'table')
      router.push('/table')
    } else if (store.getters.getPage === 'home') {
      store.commit('setPage', 'settings')
      router.push('/settings')
    }
  } else if (touchEndX.value - touchStartX.value > 150) {
    if (store.getters.getPage === 'table') {
      store.commit('setPage', 'table')
      router.push(`${previousRoute.value?.path}`)
    } else if (store.getters.getPage === 'settings') {
      router.push('/home')
    } else if (store.getters.getPage === 'secret') {
      router.push('/settings')
    }
  }
}

function clearStorage() {
  localStorage.removeItem('logs')
  localStorage.removeItem('logs1')
  localStorage.removeItem('logs2')
}

const { needRefresh, updateServiceWorker } = useRegisterSW({})

watch(needRefresh, (val) => {
  alert('needRefresh')
  if (val) {
    update.value = true
    store.commit('alert/setResponse', null)
    store.commit('alert/setBtn', 'confirm')
    store.commit('alert/setText', `Nova atualização disponível, aplicação vai ser atualizada!`)
    store.commit('alert/setAlert')
  }
})

const response = computed(() => {
  return store.getters['alert/getResponse']
})

watch(response, (novo) => {
  if (novo && update.value) {
    alert('update')
    updateServiceWorker()
    update.value = false
  }
})

document.addEventListener('visibilitychange', () => {
  setTimeout(() => {
    if (document.visibilityState === 'visible') {
      store.dispatch('checkTokenValidity')
    }
  }, 1000)
})

function updateStatus() {
  store.commit('alert/setBtn', 'alert')
  store.commit('alert/setText', `Sem Internet. Verifique a ligação!`)
  store.commit('alert/setAlert')
}
onMounted(() => {
  window.addEventListener('offline', updateStatus)
})
</script>

<style>
.fade-slide-enter-active {
  animation: fadeSlideIn 240ms ease-in forwards;
  position: absolute;
  top: 0;
  left: 0;
  align-items: center;
  text-align: center;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 260ms ease-out backwards;
  position: absolute;
  top: 0;
  left: 0;
}

/* Keyframes para entrada */
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Keyframes para saída */
@keyframes fadeSlideOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.full {
  height: 100dvh;
  width: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
}
</style>
