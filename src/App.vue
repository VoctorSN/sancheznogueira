<template>
  <!-- contenedor padre a 80% y centrado -->
  <div id="app">
    <NavBar /> <!-- Fijo arriba, pero dentro del 80% -->
    <main class="flex-grow-1 overflow-auto">
      <GestionClientes />
    </main>
    <FooTer class="mt-auto" /> <!-- Fijo abajo, pero dentro del 80% -->
  </div>
</template>


<script setup>
import NavBar from './components/NavBar.vue'
import FooTer from './components/FooTer.vue'
import GestionClientes from './components/GestionClientes.vue'
</script>

<style scoped>
#app {
  max-width: 80%;
  margin: 0 auto;
  /* centra horizontalmente */
  height: 100vh;
  /* equivalente a vh-100 */
  display: flex;
  flex-direction: column;
}
</style>
