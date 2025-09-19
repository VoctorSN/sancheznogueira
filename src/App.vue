<script setup>
import FooTer from './components/FooTer.vue';
import GestionClientes from './components/GestionClientes.vue';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div id="app" class="d-flex flex-column vh-100">
    <NavBar />
    <main class="flex-grow-1 overflow-auto">
      <GestionClientes />
    </main>
    <FooTer />
  </div>
</template>

<style>
#app > nav{
  width: 80%;
}
#app > footer{
  width: 100%;
}
</style>