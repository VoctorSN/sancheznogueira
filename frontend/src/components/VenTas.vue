<template>
    <div class="container-fluid mt-2">
        <div class="row g-4">
            <div v-for="car in vehiculos" :key="car._id" class="col-12 col-md-6 col-lg-3">
                <div class="card h-80 shadow-sm">
                    <img :src="urlImagen(car.imagen)" class="card-img-top" alt="vehiculo"
                        style="height: 200px; object-fit: cover;"></img>

                    <div class="card-body">
                        <h5 class="card-title">{{ car.marca }} {{ car.modelo }}</h5>
                        <p class="card-text">
                            <strong>Año: </strong>{{ car.anio }}<br>
                            <strong>Km: </strong>{{ car.kilometros }}<br>
                            <strong>Precio: </strong>{{ car.precio }}€<br>
                        </p>
                    </div>

                    <div class="card-footer text-end bg-white">
                        <span class="badge" :class="getEstadoClass(car.estado)">{{ car.estado }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted } from "vue";
import { getArticulos } from "@/api/articulos.js";

const vehiculos = ref([]);

onMounted(async () => {
    vehiculos.value = await getArticulos();
});

const urlImagen = (ruta) => {
    
    if (!ruta) return "/no-image.png";    
    return `http://localhost:5000${ruta}`
};

const getEstadoClass = (estado) => {
    const estadoLower = estado?.toLowerCase();
    if (estadoLower === 'disponible') return 'bg-success';
    if (estadoLower === 'vendido') return 'bg-danger';
    if (estadoLower === 'reservado') return 'bg-warning';
    return 'bg-secondary';
};

</script>

<style scoped>
.card-title {
    font-weight: bold;
    text-transform: capitalize;
}
</style>
