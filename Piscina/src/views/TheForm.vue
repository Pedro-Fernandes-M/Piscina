<template>
    <div>
        <button @click="handleLogin">Login com Google</button>
        <button @click="store.dispatch('preencherSheet')">Preencher</button>

    </div>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore()

async function handleLogin() {
      try {
        await store.dispatch('signIn');
        alert('Autenticado com sucesso!');
      } catch (err) {
        console.error('Erro ao autenticar', err);
      }
}


</script>

<style scoped>

</style>