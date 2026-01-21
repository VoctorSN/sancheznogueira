<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg border-0">
          <div class="card-body text-center p-5">
            <h2 class="mb-4">¡Pago Completado! 🎉</h2>
            
            <p class="text-muted mb-4">
              Gracias por tu compra. Te hemos enviado un correo con los detalles.
            </p>
            
            <div v-if="cargando" class="mb-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>
            
            <div v-else class="mb-4">
              <p class="fw-bold">Descargue su factura en formato PDF:</p>
              <button class="btn btn-primary btn-lg mt-2" @click="descargarFactura" :disabled="procesando">
                <span v-if="procesando">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Generando PDF...
                </span>
                <span v-else>
                  📄 Descargar Factura
                </span>
              </button>
            </div>
            
            <div class="d-flex flex-column gap-2 align-items-center">
              <router-link to="/facturas" class="btn btn-outline-primary text-decoration-none">
                <i class="bi bi-receipt-cutoff me-2"></i>Ver Mis Facturas
              </router-link>
              <router-link to="/" class="text-decoration-none">
                ← Volver al inicio
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerFacturasPorDni } from '@/api/facturas.js'
import { setCochesToVendido } from '@/api/articulos.js'
import { checkAdmin } from '@/api/authApi.js'
import { usePdfGenerator } from '@/composables/usePdfGenerator.js'

const cargando = ref(true)
const ultimaFactura = ref(null)
const { procesando, generarPdfFactura } = usePdfGenerator()

// Cargar la última factura al montar
onMounted(async () => {
  try {
    // Obtener DNI del usuario
    const userInfo = await checkAdmin()
    const dniUsuario = userInfo.dni

    if (dniUsuario) {
      // Obtener facturas del usuario
      const facturas = await obtenerFacturasPorDni(dniUsuario)
      
      // Tomar la primera (más reciente)
      if (facturas && facturas.length > 0) {
        ultimaFactura.value = facturas[0]
        console.log(ultimaFactura.value.items.map(item => item.productoId));
        
        setCochesToVendido(ultimaFactura.value.items.map(item => item.productoId))
      }
    }
  } catch (error) {
    console.error('Error al cargar la última factura:', error)
  } finally {
    cargando.value = false
  }
})

const descargarFactura = () => {
  generarPdfFactura(ultimaFactura.value, 'factura.pdf')
}
</script>

<style scoped>
.card {
  border-radius: 15px;
  background: white;
}

.btn-primary {
  border-radius: 8px;
  padding: 12px 30px;
}
</style>
