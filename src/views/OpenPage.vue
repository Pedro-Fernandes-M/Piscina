<template>
  <div class="page">
    <img src="/logo_dark.png" alt="" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const router = useRouter()
const ready = ref(false)

useRegisterSW({
  onOfflineReady() {
    ready.value = true
  },
})

onMounted(() => {
  setTimeout(() => {
    if (!ready.value) ready.value = true
  }, 900)
})

watch(ready, (val) => {
  if (val) {
    setTimeout(() => {
      router.push('/home')
    }, 800)
  }
})
</script>

<style scoped>
img {
  height: 11rem;
}
</style>
