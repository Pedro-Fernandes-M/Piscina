<script setup>
import { RouterView } from 'vue-router'

document.addEventListener('contextmenu', (event) => event.preventDefault())

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
detectDevTools()
</script>

<template>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
