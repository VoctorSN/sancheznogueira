<template>
  <div class="container mt-4">
    <h2 class="mb-4">Mi Cesta</h2>
    
    <div v-if="cesta.items.length === 0" class="alert alert-info">
      La cesta está vacía.
    </div>
    
    <div v-else class="row">
      <!-- Columna izquierda: Productos de la cesta -->
      <div class="col-lg-7 col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Productos en tu cesta</h5>
          </div>
          <div class="card-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cesta.items" :key="item.id">
                  <td>{{ item.nombre }}</td>
                  <td>{{ item.precio }} €</td>
                  <td>
                    <button class="btn btn-sm btn-outline-secondary me-1" @click="decrementar(item.id)">-</button>
                    {{ item.cantidad }}
                    <button class="btn btn-sm btn-outline-secondary ms-1" @click="incrementar(item.id)">+</button>
                  </td>
                  <td>{{ item.precio * item.cantidad }} €</td>
                  <td>
                    <button class="btn btn-sm btn-danger" @click="removeProducto(item.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Resumen de la cesta -->
            <div class="border-top pt-3 mt-3">
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <strong>{{ cesta.totalPrecio }} €</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <strong>Gratis</strong>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5 class="text-primary">{{ cesta.totalPrecio }} €</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna derecha: Métodos de pago -->
      <div class="col-lg-5 col-md-6">
        <div class="card shadow-sm sticky-top" style="top: 20px;">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">Métodos de pago</h5>
          </div>
          <div class="card-body">
            <p class="text-muted mb-3">Selecciona tu método de pago preferido</p>
            
            <!-- Botón para mostrar PayPal -->
            <button 
              class="btn btn-primary w-100 mb-3" 
              @click="mostrarPayPal = !mostrarPayPal"
              :disabled="procesando"
            >
              <i class="bi bi-paypal me-2"></i>
              {{ mostrarPayPal ? 'Ocultar PayPal' : 'Pagar con PayPal' }}
            </button>

            <!-- Contenedor de botones de PayPal -->
            <div v-if="mostrarPayPal" class="paypal-container">
              <div id="paypal-button-container"></div>
            </div>

            <!-- Mensaje de estado -->
            <div v-if="mensaje" :class="['alert', mensajeTipo === 'success' ? 'alert-success' : 'alert-danger']">
              {{ mensaje }}
            </div>

            <!-- Información de seguridad -->
            <div class="mt-4 pt-3 border-top">
              <p class="text-muted small mb-2">
                <i class="bi bi-shield-check text-success me-2"></i>
                Pago 100% seguro y encriptado
              </p>
              <p class="text-muted small mb-0">
                <i class="bi bi-lock text-success me-2"></i>
                Tus datos están protegidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCestaStore } from '@/store/cesta.js'
import { crearOrdenPayPal, capturarOrdenPayPal, obtenerConfigPayPal } from '@/api/paypal.js'

const router = useRouter()
const cesta = useCestaStore()
const mostrarPayPal = ref(false)
const procesando = ref(false)
const mensaje = ref('')
const mensajeTipo = ref('success')
const paypalClientId = ref('')

const incrementar = (id) => cesta.incrementar(id)
const decrementar = (id) => cesta.decrementar(id)
const removeProducto = (id) => cesta.removeProducto(id)

let paypalLoaded = false

// Cargar el script de PayPal
const cargarPayPalScript = () => {
  return new Promise((resolve, reject) => {
    if (paypalLoaded) {
      resolve()
      return
    }

    if (!paypalClientId.value) {
      reject(new Error('Client ID de PayPal no disponible'))
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId.value}&currency=EUR`
    script.onload = () => {
      paypalLoaded = true
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Renderizar botones de PayPal
const renderizarBotonesPayPal = async () => {
  if (!window.paypal) {
    await cargarPayPalScript()
  }

  // Limpiar contenedor previo
  const container = document.getElementById('paypal-button-container')
  if (container) {
    container.innerHTML = ''
  }

  window.paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'rect',
      label: 'pay'
    },
    
    // Crear orden
    createOrder: async (data, actions) => {
      try {
        procesando.value = true
        mensaje.value = ''
        
        const orderData = await crearOrdenPayPal(cesta.items, cesta.totalPrecio)
        return orderData.id
      } catch (error) {
        console.error('Error al crear orden:', error)
        mensaje.value = 'Error al crear la orden de pago'
        mensajeTipo.value = 'error'
        throw error
      } finally {
        procesando.value = false
      }
    },

    // Aprobar pago
    onApprove: async (data, actions) => {
      try {
        procesando.value = true
        mensaje.value = 'Procesando pago...'
        mensajeTipo.value = 'success'
        
        const captureData = await capturarOrdenPayPal(data.orderID)
        
        if (captureData.status === 'COMPLETED') {
          // Vaciar la cesta después de un pago exitoso
          cesta.items.forEach(item => {
            cesta.removeProducto(item.id)
          })
          
          // Redirigir a la página de éxito
          router.push('/success')
        } else {
          mensaje.value = 'El pago no se completó correctamente'
          mensajeTipo.value = 'error'
        }
      } catch (error) {
        console.error('Error al capturar pago:', error)
        mensaje.value = 'Error al procesar el pago'
        mensajeTipo.value = 'error'
      } finally {
        procesando.value = false
      }
    },

    // Cancelar pago
    onCancel: (data) => {
      // Redirigir a la página de cancelación
      router.push('/cancel')
    },

    // Error en el pago
    onError: (err) => {
      console.error('Error de PayPal:', err)
      mensaje.value = 'Ocurrió un error con PayPal'
      mensajeTipo.value = 'error'
      procesando.value = false
    }
  }).render('#paypal-button-container')
}

// Observar cambios en mostrarPayPal
watch(mostrarPayPal, async (nuevoValor) => {
  if (nuevoValor) {
    await cargarPayPalScript()
    setTimeout(() => {
      renderizarBotonesPayPal()
    }, 100)
  }
})

onMounted(async () => {
  try {
    const config = await obtenerConfigPayPal()
    paypalClientId.value = config.clientId
  } catch (error) {
    console.error('Error al obtener configuración de PayPal:', error)
    mensaje.value = 'Error al configurar PayPal'
    mensajeTipo.value = 'error'
  }
})
</script>

<style scoped>
.sticky-top {
  position: -webkit-sticky;
  position: sticky;
  z-index: 1020;
}

.card {
  border-radius: 10px;
  border: none;
}

.card-header {
  border-radius: 10px 10px 0 0 !important;
}

.table {
  margin-bottom: 0;
}

.paypal-container {
  margin-top: 15px;
}

#paypal-button-container {
  max-width: 100%;
}

.btn {
  border-radius: 8px;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .sticky-top {
    position: relative;
  }
  
  .col-lg-7, .col-lg-5 {
    margin-bottom: 1rem;
  }
}
</style>
