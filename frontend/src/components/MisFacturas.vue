<template>
  <div class="container mt-4">
    <h2 class="mb-4">
      <i class="bi bi-receipt-cutoff me-2"></i>
      Mis Facturas
    </h2>

    <!-- Mensaje de carga -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando facturas...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- Sin facturas -->
    <div v-else-if="facturas.length === 0" class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>
      No tienes facturas registradas todavía.
    </div>

    <!-- Lista de facturas -->
    <div v-else class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table table-hover table-bordered shadow-sm">
            <thead class="table-primary">
              <tr>
                <th>Fecha</th>
                <th>Nº Factura</th>
                <th>Artículos</th>
                <th>Total</th>
                <th>Método Pago</th>
                <th>Estado</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="factura in facturas" :key="factura._id">
                <td>{{ formatearFecha(factura.fecha) }}</td>
                <td>
                  <small class="text-muted">{{ factura._id.substring(0, 8) }}...</small>
                </td>
                <td>{{ factura.items.length }} artículo(s)</td>
                <td class="fw-bold">{{ formatearPrecio(factura.totalFactura) }}</td>
                <td>
                  <span class="badge" :class="factura.metodoPago === 'paypal' ? 'bg-info' : 'bg-success'">
                    {{ formatearMetodoPago(factura.metodoPago) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="factura.estadoPago === 'completado' ? 'bg-success' : 'bg-warning'">
                    {{ factura.estadoPago }}
                  </span>
                </td>
                <td class="text-center">
                  <button 
                    class="btn btn-sm btn-primary me-2" 
                    @click="verFactura(factura._id)"
                    title="Ver/Imprimir factura"
                  >
                    <i class="bi bi-eye me-1"></i>Ver
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="confirmarEliminar(factura._id)"
                    title="Eliminar factura"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="mostrarModalEliminar" class="modal-overlay" @click="cancelarEliminar">
      <div class="modal-content" @click.stop>
        <h5 class="mb-3">
          <i class="bi bi-exclamation-triangle text-warning me-2"></i>
          Confirmar Eliminación
        </h5>
        <p>¿Estás seguro de que deseas eliminar esta factura?</p>
        <p class="text-muted small">Esta acción no se puede deshacer.</p>
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-secondary" @click="cancelarEliminar">
            Cancelar
          </button>
          <button class="btn btn-danger" @click="eliminarFacturaConfirmada">
            <i class="bi bi-trash me-1"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerFacturasPorDni, eliminarFactura } from '@/api/facturas.js'
import { checkAdmin } from '@/api/authApi.js'

const router = useRouter()
const facturas = ref([])
const cargando = ref(true)
const error = ref('')
const mostrarModalEliminar = ref(false)
const facturaAEliminar = ref(null)
const dniUsuario = ref('')

// Cargar facturas al montar el componente
onMounted(async () => {
  try {
    // Obtener información del usuario (DNI desde el token)
    const userInfo = await checkAdmin()
    dniUsuario.value = userInfo.dni

    if (!dniUsuario.value) {
      error.value = 'No se pudo obtener la información del usuario'
      cargando.value = false
      return
    }

    // Cargar facturas del usuario por DNI
    facturas.value = await obtenerFacturasPorDni(dniUsuario.value)
  } catch (err) {
    console.error('Error al cargar facturas:', err)
    error.value = 'Error al cargar las facturas. Por favor, intente de nuevo.'
  } finally {
    cargando.value = false
  }
})

// Formatear fecha
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Formatear precio
const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(precio)
}

// Formatear método de pago
const formatearMetodoPago = (metodo) => {
  const metodos = {
    'paypal': 'PayPal',
    'stripe': 'Stripe'
  }
  return metodos[metodo] || metodo
}

// Ver factura
const verFactura = (facturaId) => {
  router.push(`/factura/${facturaId}`)
}

// Confirmar eliminación
const confirmarEliminar = (facturaId) => {
  facturaAEliminar.value = facturaId
  mostrarModalEliminar.value = true
}

// Cancelar eliminación
const cancelarEliminar = () => {
  facturaAEliminar.value = null
  mostrarModalEliminar.value = false
}

// Eliminar factura confirmada
const eliminarFacturaConfirmada = async () => {
  try {
    await eliminarFactura(facturaAEliminar.value)
    // Recargar facturas
    facturas.value = await obtenerFacturasPorDni(dniUsuario.value)
    cancelarEliminar()
  } catch (err) {
    console.error('Error al eliminar factura:', err)
    error.value = 'Error al eliminar la factura'
  }
}
</script>

<style scoped>
.table {
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .table {
    font-size: 0.875rem;
  }

  .btn-sm {
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
