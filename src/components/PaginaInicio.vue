<template>
    <div class="video-bg-container">
        <video class="video-bg" autoplay loop muted playsinline>
            <source src="@/assets/editSupra.mp4" type="video/mp4" />
            Tu navegador no soporta el video.
        </video>
        <div class="contenido">
            <div class="targeta">
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
}

.video-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    z-index: 0;
}

.contenido {
    position: relative;
    z-index: 10;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.targeta {
    color: white;
    text-align: center;
    background: rgba(13, 110, 253, 0.5);
    border-radius: 20px;
    height: fit-content;
    width: 50%;
    padding: 2rem;
}
</style>