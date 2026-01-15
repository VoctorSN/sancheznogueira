<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg border-0">
          <div class="card-body text-center p-5">
            <h2 class="mb-4">Pago Cancelado ❌</h2>
            
            <p class="text-muted mb-4">
              Has cancelado el proceso de pago. No se ha realizado ningún cargo.
            </p>
            
            <div class="mb-4">
              <p class="fw-bold">¿Quieres intentarlo de nuevo?</p>
              <router-link to="/cesta" class="btn btn-primary btn-lg mt-2">
                🛒 Volver a la cesta
              </router-link>
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
