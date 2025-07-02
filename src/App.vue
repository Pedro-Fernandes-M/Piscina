<script setup>
import { RouterView } from 'vue-router'
import { useStore } from 'vuex'
import router from './router'
import { onBeforeMount, ref } from 'vue'

const store = useStore()

/* document.addEventListener('contextmenu', (event) => event.preventDefault())

// Disable F12, Ctrl+Shift+I
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
  const devToolsCheck = new Function('debugger') // Using the `debugger` statement for detection.
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
  const displayHeight = window.innerHeight - 100
  document.body.innerHTML = `<h1 class="color" style="height:${displayHeight}px">Unauthorized Access</h1>`
  throw new Error('DevTools detected! App execution stopped.')
}

// Call the detection function
detectDevTools() */

const touchStartX = ref(0)
const touchEndX = ref(0)

const onTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const onTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX
  if (touchStartX.value - touchEndX.value > 200 || touchEndX.value - touchStartX.value > 200) {
    if (store.getters.getPage === 'home') {
      store.commit('setPage', 'table')
      router.push('/')
    } else {
      store.commit('setPage', 'home')
      router.push('/table')
    }
  }
}

function clearStorage() {
  localStorage.removeItem('logs')
  localStorage.removeItem('logs1')
}

onBeforeMount(clearStorage)
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-slide" mode="out-in">
      <component :is="Component" @touchstart="onTouchStart" @touchend="onTouchEnd" />
    </transition>
  </router-view>
</template>

<style>
.fade-slide-enter-active {
  animation: fadeSlideIn 400ms ease forwards;
  position: absolute;
  top: 0;
  left: 0;
}

.fade-slide-leave-active {
  animation: fadeSlideOut 400ms ease backwards;
  position: absolute;
  top: 0;
  left: 0;
}

/* Keyframes para entrada */
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateX(60px);
  }
  50% {
    opacity: 0.5;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Keyframes para saída */
@keyframes fadeSlideOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  50% {
    opacity: 0.5;
    transform: translateX(-30px);
  }
  100% {
    opacity: 0;
    transform: translateX(-60px);
  }
}
</style>
