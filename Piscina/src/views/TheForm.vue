<template>
    <div class="page">
        <form action="">
          <div class="center">
            <h2>
              Piscina
            </h2>
            <h3>{{ day }} de {{ month }}</h3>
          </div>
          <div class="input">
            <label for="ph">PH_cima</label>
            <input :class="[ ph_cima===  '' ? 'input-erro': '']" type="number" v-model="ph_cima">
          </div>
          <div class="input">
            <label for="ph">PH_baixo</label>
            <input :class="[ ph_baixo=== '' ? 'input-erro': '']" type="number" v-model="ph_baixo">
          </div>
          <div class="input">
            <label for="num">Nº Pessoas</label>
            <input :class="[ num_pessoas=== '' ? 'input-erro': '']" type="number" v-model="num_pessoas">
          </div>
          <button @click.prevent="preencher" type="submit" >Preencher</button>
        </form>

    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const hoje = new Date();
const day = hoje.getDate();
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const month = monthNames[hoje.getMonth()];

const ph_cima= ref(null)
const ph_baixo= ref(null)
const num_pessoas= ref(0)
const horas = ref(null)

const validade= computed(()=>{
  const n = Number(num_pessoas.value);
  const ph_c= Number(ph_cima.value)
  const ph_b= Number(ph_baixo.value)
  return !isNaN(n) && num_pessoas.value!=null && n >= 0 && Number.isInteger(n)  && !isNaN(n) && ph_cima.value!=null && ph_c >= 0 && Number.isInteger(ph_c) && !isNaN(n) && ph_baixo.value!=null && ph_b >= 0 && Number.isInteger(ph_b);
})


function preencher(){
  let hours = hoje.getHours();
  let minutes = hoje.getMinutes();
  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  horas.value= hours+':'+minutes

  if(validade.value && horas.value!=null && month!=null && day!=null){
  const form={
    ph_cima:ph_cima,
    ph_baixo:ph_baixo,
    num_pessoas: num_pessoas,
    horas:horas,
    mes: month,
    dia:day
  }

  store.dispatch('preencherSheet',form)
  }
  else{
    alert('Formulário mal preenchido!')
  }
}
</script>

<style scoped>
.page{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
}


form{
  background-color: #3a3a3a;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 300px;
}

.center{
  text-align: center;
}

h2{
  color: aliceblue;
}

.input{
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

.input-erro{
  box-shadow: 0 0 0 2px #d42e00;
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