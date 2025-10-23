<template>
    <!-- Aqui va el container del video que esta con z-index 0 para aparecer por detras del resto de contenidos metidos abajo -->
    <div class="video-bg-container position-fixed top-0 start-0 vw-100 vh-100 overflow-hidden">
        <video class="video-bg position-absolute top-0 start-0 w-100 h-100" autoplay loop muted playsinline>
            <source src="@/assets/editSupra.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
        </video>
        <div
            class="contenido position-relative h-100 w-100 d-flex flex-column justify-content-center align-items-center">
            <div class="targeta text-white text-center rounded w-50 p-4 bg-primary bg-opacity-50">
                <!-- Aquí va tu contenido encima del video -->
                <h1>Bienvenido a la página de inicio</h1>
                <p>Podemos poner aqui dentro mucho texto
                </p>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>

<style scoped>
.video-bg-container {
    z-index: 0;
}

.video-bg {
    object-fit: cover;
    z-index: 0;
}

.contenido {
    z-index: 10;
}
</style>