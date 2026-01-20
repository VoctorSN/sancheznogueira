<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <!-- Botones de acción -->
        <div class="d-flex justify-content-between mb-4 no-print">
          <button class="btn btn-secondary" @click="volverAtras">
            <i class="bi bi-arrow-left me-2"></i>Volver
          </button>
          <div>
            <button class="btn btn-primary me-2" @click="imprimirFactura">
              <i class="bi bi-printer me-2"></i>Imprimir Factura
            </button>
            <button class="btn btn-success" @click="descargarFactura" :disabled="procesando">
              <span v-if="procesando">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Generando...
              </span>
              <span v-else>
                <i class="bi bi-download me-2"></i>Descargar PDF
              </span>
            </button>
          </div>
        </div>

        <!-- Mensaje de carga -->
        <div v-if="cargando" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando factura...</p>
        </div>

        <!-- Mensaje de error -->
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <!-- Factura -->
        <div v-else-if="factura" class="factura-container" id="factura-contenido">
          <!-- Cabecera de la factura -->
          <div class="factura-header">
            <div class="row align-items-center mb-4">
              <div class="col-md-6">
                <h1 class="display-6 text-primary mb-0">FACTURA</h1>
                <p class="text-muted mb-0">Nº {{ factura._id }}</p>
              </div>
              <div class="col-md-6 text-md-end">
                <h4 class="text-muted mb-1">Tu Empresa S.L.</h4>
                <p class="mb-0 small">
                  CIF: B12345678<br>
                  Calle Principal, 123<br>
                  28001 Madrid, España<br>
                  Tel: +34 912 345 678
                </p>
              </div>
            </div>

            <hr class="my-4">

            <!-- Información de la factura y cliente -->
            <div class="row mb-4">
              <div class="col-md-6">
                <h6 class="text-primary mb-3">CLIENTE</h6>
                <div class="cliente-info">
                  <p class="mb-1"><strong>{{ factura.cliente.nombre }}</strong></p>
                  <p class="mb-1">DNI: {{ factura.cliente.dni }}</p>
                  <p class="mb-1">Email: {{ factura.cliente.email }}</p>
                </div>
              </div>
              <div class="col-md-6 text-md-end">
                <h6 class="text-primary mb-3">DETALLES DE LA FACTURA</h6>
                <p class="mb-1"><strong>Fecha:</strong> {{ formatearFecha(factura.fecha) }}</p>
                <p class="mb-1"><strong>Método de Pago:</strong> {{ formatearMetodoPago(factura.metodoPago) }}</p>
                <p class="mb-1"><strong>Estado:</strong> 
                  <span class="badge" :class="factura.estadoPago === 'completado' ? 'bg-success' : 'bg-warning'">
                    {{ factura.estadoPago }}
                  </span>
                </p>
                <p class="mb-1"><strong>ID Transacción:</strong> {{ factura.transaccionId }}</p>
              </div>
            </div>
          </div>

          <!-- Tabla de productos -->
          <div class="factura-body">
            <h6 class="text-primary mb-3">ARTÍCULOS</h6>
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th>Descripción</th>
                  <th class="text-center">Cantidad</th>
                  <th class="text-end">Precio Unitario</th>
                  <th class="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in factura.items" :key="index">
                  <td>{{ item.nombre }}</td>
                  <td class="text-center">{{ item.cantidad }}</td>
                  <td class="text-end">{{ formatearPrecio(item.precio) }}</td>
                  <td class="text-end">{{ formatearPrecio(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Totales -->
          <div class="factura-footer">
            <div class="row">
              <div class="col-md-6 offset-md-6">
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <td class="text-end"><strong>Subtotal:</strong></td>
                      <td class="text-end">{{ formatearPrecio(factura.totalFactura) }}</td>
                    </tr>
                    <tr>
                      <td class="text-end"><strong>IVA (21%):</strong></td>
                      <td class="text-end">{{ formatearPrecio(calcularIVA(factura.totalFactura)) }}</td>
                    </tr>
                    <tr class="border-top">
                      <td class="text-end"><h5 class="mb-0">TOTAL:</h5></td>
                      <td class="text-end"><h5 class="mb-0 text-primary">{{ formatearPrecio(factura.totalFactura + calcularIVA(factura.totalFactura)) }}</h5></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Pie de página -->
          <div class="factura-pie text-center mt-5 pt-4 border-top">
            <p class="text-muted small mb-1">Gracias por su compra</p>
            <p class="text-muted small mb-0">
              Para cualquier consulta, contacte con nosotros en info@tuempresa.com
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerFacturaParaImprimir } from '@/api/facturas.js'
import { usePdfGenerator } from '@/composables/usePdfGenerator.js'

const route = useRoute()
const router = useRouter()
const factura = ref(null)
const cargando = ref(true)
const error = ref('')
const { procesando, generarPdfFactura } = usePdfGenerator()

// Cargar factura al montar el componente
onMounted(async () => {
  try {
    const facturaId = route.params.id
    if (!facturaId) {
      error.value = 'No se especificó el ID de la factura'
      cargando.value = false
      return
    }

    factura.value = await obtenerFacturaParaImprimir(facturaId)
  } catch (err) {
    console.error('Error al cargar factura:', err)
    error.value = 'Error al cargar la factura. Por favor, intente de nuevo.'
  } finally {
    cargando.value = false
  }
})

// Formatear fecha
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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
    'stripe': 'Tarjeta de Crédito/Débito'
  }
  return metodos[metodo] || metodo
}

// Calcular IVA
const calcularIVA = (total) => {
  return total * 0.21
}

// Volver atrás
const volverAtras = () => {
  router.back()
}

// Imprimir factura
const imprimirFactura = () => {
  window.print()
}

// Descargar factura en PDF
const descargarFactura = () => {
  generarPdfFactura(factura.value, `factura_${factura.value._id}.pdf`)
}
</script>

<style scoped>
.factura-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
}

.factura-header {
  border-bottom: 2px solid #0d6efd;
  padding-bottom: 20px;
}

.cliente-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
}

.factura-body {
  margin: 30px 0;
}

.table {
  margin-bottom: 0;
}

.table-bordered {
  border: 2px solid #dee2e6;
}

.table-light {
  background-color: #f8f9fa;
}

.factura-footer {
  margin-top: 30px;
}

.factura-pie {
  color: #6c757d;
}

/* Estilos para impresión */
@media print {
  .no-print {
    display: none !important;
  }

  .factura-container {
    box-shadow: none;
    padding: 20px;
  }

  body {
    background: white;
  }

  @page {
    margin: 1cm;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .factura-container {
    padding: 20px;
  }

  .display-6 {
    font-size: 2rem;
  }
}
</style>
