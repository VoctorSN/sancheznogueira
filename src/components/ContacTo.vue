<template>
    <div class="container-fluid my-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card shadow-sm border-0">
                    <div class="d-flex justify-content-center">
                        <h2 class="text-center mb-3 text-primary fw-bold">
                            <i class="bi bi-envelope-fill me-2"></i>
                            Contáctanos
                        </h2>
                    </div>
                    <div class="card-body p-4">
                        <form @submit.prevent="enviarFormulario">
                            <!-- Nombre -->
                            <div class="mb-3">
                                <label for="nombre" class="form-label fw-semibold">Nombre</label>
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    v-model="formulario.nombre"
                                    class="form-control"
                                    placeholder="Tu nombre completo"
                                    required
                                />
                            </div>

                            <!-- Correo Electrónico -->
                            <div class="mb-3">
                                <label for="email" class="form-label fw-semibold">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    v-model="formulario.email"
                                    class="form-control"
                                    placeholder="tucorreo@ejemplo.com"
                                    required
                                />
                            </div>

                            <!-- Asunto -->
                            <div class="mb-3">
                                <label for="asunto" class="form-label fw-semibold">Asunto</label>
                                <input 
                                    type="text" 
                                    id="asunto" 
                                    v-model="formulario.asunto"
                                    class="form-control"
                                    placeholder="Motivo de tu consulta"
                                    required
                                />
                            </div>

                            <!-- Mensaje -->
                            <div class="mb-3">
                                <label for="mensaje" class="form-label fw-semibold">Mensaje</label>
                                <textarea 
                                    id="mensaje" 
                                    v-model="formulario.mensaje"
                                    class="form-control"
                                    rows="5"
                                    placeholder="Escribe tu mensaje aquí..."
                                    required
                                ></textarea>
                            </div>

                            <!-- Botón Enviar -->
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary px-5 py-2" :disabled="enviando">
                                    <i class="bi bi-send-fill me-2"></i>
                                    {{ enviando ? 'Enviando...' : 'Enviar' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mapa de ubicación -->
        <div class="row justify-content-center mt-5">
            <div class="col-12 col-md-6">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-primary text-white text-center py-3">
                        <h5 class="mb-0">
                            <i class="bi bi-geo-alt-fill me-2"></i>
                            Nuestra Ubicación
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2950.5865753883815!2d-8.692220923738883!3d42.25138037429632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2f62e588cfce69%3A0x378485bfa6edd1be!2sAvenida%20de%20Galicia%2C%20101%2C%20Teis%2C%2036216%20Vigo%2C%20Pontevedra!5e0!3m2!1ses!2ses!4v1733847920000!5m2!1ses!2ses"
                            width="100%" 
                            height="400" 
                            style="border:0;" 
                            allowfullscreen="" 
                            loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade"
                            title="Ubicación Avenida de Galicia, 101, Teis"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { enviarContacto } from '@/api/contacto.js';

const formulario = ref({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
});

const enviando = ref(false);

const enviarFormulario = async () => {
    enviando.value = true;

    try {
        const response = await enviarContacto(formulario.value);
        
        if (response.success) {
            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Mensaje enviado!',
                text: 'Gracias por contactarnos. Te responderemos lo antes posible.',
                confirmButtonText: 'Aceptar'
            });

            // Limpiar formulario
            formulario.value = {
                nombre: '',
                email: '',
                asunto: '',
                mensaje: ''
            };
        }
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        
        Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
        });
    } finally {
        enviando.value = false;
    }
};
</script>

<style scoped>
.card {
    border-radius: 10px;
    overflow: hidden;
}

.card-header {
    border-bottom: none;
}

.form-control:focus {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
    border-radius: 25px;
    font-weight: 600;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

iframe {
    display: block;
}
</style>
