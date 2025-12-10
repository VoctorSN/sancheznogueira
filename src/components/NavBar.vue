<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary ">
    <div class="container-fluid">
      <!-- Marca o logo -->
      <a class="navbar-brand" href="#"><img class="logo" src="@/assets/logo.svg" alt="logo" /></a>

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
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/clientes">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/noticias">Noticias</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/taller">Taller</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/modelos">Modelos</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ventas">Ventas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacto">Contacto</router-link>
          </li>
        </ul>
      </div>

      <div class="dropdown ms-auto">
        <span class="text-white" v-if="isLogueado">{{ userName }}</span>

        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">

          <i class="bi bi-person fs-2"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <!-- Mostra “Acceso/Registro” se NON hai usuario logueado -->
          <li v-if="!isLogueado"><router-link class="dropdown-item" to="/login">Acceso</router-link></li>
          <li v-if="!isLogueado"><router-link class="dropdown-item" to="/clientes">Registro</router-link></li>
          <!-- Mostra “Cerrar Sesión” se está logueado -->
          <li v-if="isLogueado">
            <a class="dropdown-item" href="#" @click.prevent="logout">Cerrar Sesión</a>
          </li>
          <li v-if="isLogueado"><router-link class="dropdown-item" to="/clientes">Perfil</router-link></li>
        </ul>
      </div>
      
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { checkAdmin } from '@/api/authApi.js'

const isLogueado = ref(false)
const userName = ref('')
const isAdmin = ref(false)

onMounted(async () => {
  isLogueado.value = sessionStorage.getItem('token') !== null
  
  // Verificar si es admin mediante API
  const adminCheck = await checkAdmin();  
  isAdmin.value = adminCheck.isAdmin;
  userName.value = adminCheck.name;
})

function logout() {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('dni')
  sessionStorage.removeItem('userName')

  isLogueado.value = false
  userName.value = ''

  window.location.href = '/'
}
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

.logo {
  width: 45px;
}
</style>