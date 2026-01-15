<template>
    <div class="container-fluid mt-2">
        <div class="row g-4">
            <div v-for="car in vehiculos" :key="car._id" class="col-12 col-md-6 col-lg-3">
                <div class="card h-80 shadow-sm" @click="mostrarDetalles(car)" style="cursor: pointer;">
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
                        <div class="btn badge btn-sm btn-primary ms-2" @click.stop="agregarACesta(car)"><i
                                class="bi bi-cart3 me-1"></i>Añadir Cesta
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>

        <!-- Modal de detalles -->
        <div v-if="vehiculoSeleccionado" class="modal-overlay" @click="cerrarDetalles">
            <div class="modal-content" @click.stop>
                <button class="btn-close-modal" @click="cerrarDetalles">
                    <i class="bi bi-x-lg"></i>
                </button>

                <div class="row">
                    <div class="col-md-6">
                        <img :src="urlImagen(vehiculoSeleccionado.imagen)" class="img-fluid rounded" alt="vehiculo">
                        <p class="info-description mx-3">{{ vehiculoSeleccionado.descripcion }}</p>
                    </div>

                    <div class="col-md-6">
                        <h2 class="mb-3">{{ vehiculoSeleccionado.marca }} {{ vehiculoSeleccionado.modelo }}</h2>

                        <div class="detalle-info">
                            <div class="info-row">
                                <span class="info-label"><i class="bi bi-calendar3 me-2"></i>Año:</span>
                                <span class="info-value">{{ vehiculoSeleccionado.anio }}</span>
                            </div>

                            <div class="info-row">
                                <span class="info-label"><i class="bi bi-speedometer2 me-2"></i>Kilómetros:</span>
                                <span class="info-value">{{ vehiculoSeleccionado.kilometros.toLocaleString() }}
                                    km</span>
                            </div>

                            <div class="info-row">
                                <span class="info-label"><i class="bi bi-fuel-pump me-2"></i>Combustible:</span>
                                <span class="info-value">{{ vehiculoSeleccionado.combustible }}</span>
                            </div>

                            <div class="info-row">
                                <span class="info-label"><i class="bi bi-gear me-2"></i>Transmisión:</span>
                                <span class="info-value">{{ vehiculoSeleccionado.transmision }}</span>
                            </div>

                            <div class="info-row" v-if="vehiculoSeleccionado.potencia_cv">
                                <span class="info-label"><i class="bi bi-lightning me-2"></i>Potencia:</span>
                                <span class="info-value">{{ vehiculoSeleccionado.potencia_cv }} CV</span>
                            </div>

                            <div class="info-row" v-if="vehiculoSeleccionado.matricula">
                                <span class="info-label"><i class="bi bi-credit-card-2-front me-2"></i>Matrícula:</span>
                                <span class="info-value">{{ vehiculoSeleccionado.matricula }}</span>
                            </div>

                            <div class="info-row">
                                <span class="info-label"><i class="bi bi-tag me-2"></i>Estado:</span>
                                <span class="badge" :class="getEstadoClass(vehiculoSeleccionado.estado)">
                                    {{ vehiculoSeleccionado.estado }}
                                </span>
                            </div>

                            <div class="info-row">
                                <span class="info-label"><i class="bi bi-currency-euro me-2"></i>Precio:</span>
                                <span class="info-value fw-bold text-primary fs-5">{{
                                    vehiculoSeleccionado.precio.toLocaleString() }}€</span>
                            </div>

                            <div class="contacto-info mt-4 p-3 bg-light rounded" v-if="vehiculoSeleccionado.contacto">
                                <h5 class="mb-3"><i class="bi bi-person-circle me-2"></i>Información de Contacto</h5>
                                <p class="mb-1"><strong>Nombre:</strong> {{ vehiculoSeleccionado.contacto.nombre }}</p>
                                <p class="mb-1"><strong>Teléfono:</strong> {{ vehiculoSeleccionado.contacto.telefono }}
                                </p>
                                <p class="mb-1"><strong>Email:</strong> {{ vehiculoSeleccionado.contacto.email }}</p>
                                <p class="mb-0" v-if="vehiculoSeleccionado.ubicacion">
                                    <strong>Ubicación:</strong> {{ vehiculoSeleccionado.ubicacion.ciudad }}, {{
                                        vehiculoSeleccionado.ubicacion.provincia }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted } from "vue";
import { getArticulos } from "@/api/articulos.js";
import { useCestaStore } from "../store/cesta";

const cestaStore = useCestaStore();

const vehiculos = ref([]);
const vehiculoSeleccionado = ref(null);

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

const mostrarDetalles = (vehiculo) => {
    vehiculoSeleccionado.value = vehiculo;
};

const cerrarDetalles = () => {
    vehiculoSeleccionado.value = null;
};

const agregarACesta = (vehiculo) => {
    cestaStore.addProducto({
        id: vehiculo._id,
        nombre: `${vehiculo.marca} ${vehiculo.modelo}`,
        precio: vehiculo.precio,
        imagen: urlImagen(vehiculo.imagen)
    });
};

</script>

<style scoped>
.card-title {
    font-weight: bold;
    text-transform: capitalize;
}

.card:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 1000px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.btn-close-modal {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background 0.3s;
}

.btn-close-modal:hover {
    background: #c82333;
}

.detalle-info {
    margin-top: 20px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e9ecef;
}

.info-label {
    font-weight: 600;
    color: #495057;
}

.info-value {
    color: #212529;
}

.info-description {
    margin-top: 8px;
    color: #6c757d;
    line-height: 1.6;
}

.precio-destacado {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
}

.precio-destacado h3 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
}

.contacto-info {
    border-left: 4px solid #0d6efd;
}

.contacto-info h5 {
    color: #0d6efd;
}
</style>
