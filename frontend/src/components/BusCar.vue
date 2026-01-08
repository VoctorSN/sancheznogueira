<template>
  <div class="container mt-5">
    <h2>Resultados de búsqueda: "{{ searchTerm }}"</h2>
    
    <!-- Resultados de Clientes -->
    <div v-if="clientes.length > 0" class="mt-4">
      <h3>Clientes</h3>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Móvil</th>
              <th>Provincia</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientes" :key="cliente.id">
              <td>{{ cliente.nombre }}</td>
              <td>{{ cliente.apellidos }}</td>
              <td>{{ cliente.email }}</td>
              <td>{{ cliente.movil }}</td>
              <td>{{ cliente.provincia }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Resultados de Noticias -->
    <div v-if="noticias.length > 0" class="mt-4">
      <h3>Noticias</h3>
      <div class="row">
        <div v-for="noticia in noticias" :key="noticia.id" class="col-md-4 mb-3">
          <div class="card">
            <img v-if="noticia.imagen" :src="noticia.imagen" class="card-img-top" alt="Imagen noticia">
            <div class="card-body">
              <h5 class="card-title">{{ noticia.titulo }}</h5>
              <p class="card-text">{{ noticia.resumen }}</p>
              <small class="text-muted">{{ noticia.fecha }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-if="clientes.length === 0 && noticias.length === 0" class="mt-4">
      <div class="alert alert-info">
        No se encontraron resultados para "{{ searchTerm }}"
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const searchTerm = ref('')
const clientes = ref([])
const noticias = ref([])

// Función para buscar clientes
const buscarClientes = async (termino) => {
  try {
    const response = await axios.get(`http://localhost:3000/clientes`)
    // Filtramos localmente por nombre, apellidos, email o provincia
    clientes.value = response.data.filter(cliente => 
      cliente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      cliente.apellidos.toLowerCase().includes(termino.toLowerCase()) ||
      cliente.email.toLowerCase().includes(termino.toLowerCase()) ||
      cliente.provincia.toLowerCase().includes(termino.toLowerCase())
    )
  } catch (error) {
    console.error('Error al buscar clientes:', error)
  }
}

// Función para buscar noticias
const buscarNoticias = async (termino) => {
  try {
    const response = await axios.get(`http://localhost:3000/noticias`)
    // Filtramos localmente por título o resumen
    noticias.value = response.data.filter(noticia => 
      noticia.titulo.toLowerCase().includes(termino.toLowerCase()) ||
      (noticia.resumen && noticia.resumen.toLowerCase().includes(termino.toLowerCase()))
    )
  } catch (error) {
    console.error('Error al buscar noticias:', error)
  }
}

// Función principal de búsqueda
const realizarBusqueda = async () => {
  searchTerm.value = route.query.q || ''
  if (searchTerm.value) {
    await buscarClientes(searchTerm.value)
    await buscarNoticias(searchTerm.value)
  }
}

// Watch para detectar cambios en la query (si buscamos desde el mismo componente)
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      realizarBusqueda()
    }
  }
)

// Ejecutar búsqueda al montar el componente
onMounted(() => {
  realizarBusqueda()
})
</script>

<style scoped>
h2 {
  color: #0d6efd;
  margin-bottom: 2rem;
}

h3 {
  color: #495057;
  border-bottom: 2px solid #0d6efd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.card {
  height: 100%;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>
