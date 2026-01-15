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
            
            <div class="mb-4">
              <p class="fw-bold">Descargue su factura en formato PDF:</p>
              <button class="btn btn-primary btn-lg mt-2" @click="descargarFactura">
                📄 Descargar Factura
              </button>
            </div>
            
            <router-link to="/modelos" class="text-decoration-none">
              ← Volver a la tienda
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const descargarFactura = () => {
  // Por ahora no hace nada, implementar más tarde
  console.log('Descargar factura')
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
