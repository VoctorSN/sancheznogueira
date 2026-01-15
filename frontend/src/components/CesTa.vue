<template>
  <div class="container mt-4">
    <h2>Mi Cesta</h2>
    
    <div v-if="cesta.items.length === 0" class="alert alert-info">
      La cesta está vacía.
    </div>
    
    <div v-else>
      <table class="table">
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
              <button class="btn btn-sm btn-danger" @click="removeProducto(item.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="d-flex justify-content-between align-items-center mt-3">
        <h5>Total: {{ cesta.totalPrecio }} €</h5>
        <button 
          class="btn btn-primary me-2" 
          @click="mostrarPayPal = !mostrarPayPal"
          :disabled="procesando"
        >
          {{ mostrarPayPal ? 'Ocultar PayPal' : 'Pagar con PayPal' }}
        </button>
      </div>

      <!-- Contenedor de botones de PayPal -->
      <div v-if="mostrarPayPal" class="mt-4">
        <div id="paypal-button-container"></div>
      </div>

      <!-- Mensaje de estado -->
      <div v-if="mensaje" :class="['alert mt-3', mensajeTipo === 'success' ? 'alert-success' : 'alert-danger']">
        {{ mensaje }}
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
#paypal-button-container {
  max-width: 400px;
  margin: 0 auto;
}
</style>
