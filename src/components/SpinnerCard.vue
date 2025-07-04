<template>
  <div class="wrapper" @dblclick="store.commit('setSpinner', false)">
    <div class="spinner" @dblclick.stop />
  </div>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()
</script>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top: 4px solid #3498db; /* cor animada */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: auto; /* centra dentro da div */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* fundo semi-escuro */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* fica por cima de tudo */
}
</style>
