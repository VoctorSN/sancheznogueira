<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary ">
    <div class="container-fluid">
      <!-- Marca o logo -->
      <a class="navbar-brand" href="#"><img class="logo" src="@/assets/logo.svg" alt="logo"/></a>

      <!-- Botón de hamburguesa en pantallas pequeñas -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links de navegación -->
      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav d-flex justify-content-center w-100">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/clientes">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias">Noticias</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/#">Modelos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/#">Contacto</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No necesita lógica
</script>

<style scoped>
.navbar {
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1000;
}

.navbar-nav {
  gap: 1rem;
  /* espacio entre links */
}

.nav-link {
  text-align: center;
}

.logo{
  width: 45px;
}
</style>