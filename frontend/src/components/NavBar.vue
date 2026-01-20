<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary ">
    <div class="container-fluid justify-content-around">
      <!-- Marca o logo -->
      <a class="navbar-brand" href="#"><img class="logo" src="@/assets/logo.svg" alt="logo" /></a>

      <!-- Botón de hamburguesa en pantallas pequeñas -->
      <button class="navbar-toggler" type="button" @click="toggleMenu" aria-controls="navbarNav"
        :aria-expanded="isMenuOpen" aria-label="Toggle navigation">
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

      
      <!-- Formulario de búsqueda -->
      <form @submit.prevent="realizarBusqueda" class="d-flex me-4 ">
        <input v-model="terminoBusqueda" class="form-control me-2" type="search" placeholder="Buscar..."
        aria-label="Buscar" />
        <button class="btn btn-outline-light" type="submit">
          <i class="bi bi-search"></i>
        </button>
      </form>
      
      <router-link class="btn btn-primary position-relative ms-3 me-2" to="/cesta"><i class="bi bi-cart"></i><span v-if="cestaStore.totalItems > 0"
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {{ cestaStore.totalItems }}
        </span></router-link>
      <div class="dropdown ms-auto">
        <span class="text-white" v-if="isLogueado">{{ userName }}</span>

        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">

          <i class="bi bi-person fs-2"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <!-- Mostra “Acceso/Registro” se NON hai usuario logueado -->
          <li v-if="!isLogueado"><router-link class="dropdown-item" to="/login">Acceso</router-link></li>
          <li v-if="!isLogueado"><router-link class="dropdown-item" to="/clientes">Registro</router-link></li>
          <!-- Mostra opciones se está logueado -->
          <li v-if="isLogueado"><router-link class="dropdown-item" to="/clientes">Perfil</router-link></li>
          <li v-if="isLogueado"><router-link class="dropdown-item" to="/facturas"><i class="bi bi-receipt-cutoff me-2"></i>Mis Facturas</router-link></li>
          <li v-if="isLogueado"><hr class="dropdown-divider"></li>
          <li v-if="isLogueado">
            <a class="dropdown-item text-danger" href="#" @click.prevent="logout"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</a>
          </li>
        </ul>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkAdmin } from '@/api/authApi.js'

import { useCestaStore } from '../store/cesta'

const cestaStore = useCestaStore()

const router = useRouter()
const isLogueado = ref(false)
const userName = ref('')
const isAdmin = ref(false)
const isMenuOpen = ref(false)
const terminoBusqueda = ref('')

onMounted(async () => {
  isLogueado.value = sessionStorage.getItem('token') !== null

  // Verificar si es admin mediante API
  const adminCheck = await checkAdmin();
  isAdmin.value = adminCheck.isAdmin;
  userName.value = adminCheck.name;
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  const navbarCollapse = document.getElementById('navbarNav')
  if (navbarCollapse) {
    if (isMenuOpen.value) {
      navbarCollapse.classList.add('show')
    } else {
      navbarCollapse.classList.remove('show')
    }
  }
}

function realizarBusqueda() {
  if (terminoBusqueda.value.trim()) {
    // Navegar programáticamente al componente BusCar con el término como query
    router.push({
      name: 'BusCar',
      query: { q: terminoBusqueda.value }
    })
    terminoBusqueda.value = '' // Limpiar el input
  }
}

function logout() {
  sessionStorage.removeItem('token')
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