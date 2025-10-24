<template>
    <div class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm min-vh-75 bg-light">
        <h3 class="text-center my-4">Noticias</h3>

        

        <div class="noticias-list">
            <div v-for="noticia in noticias" :key="noticia.id" class="noticia-item card mb-3 shadow-sm border-0"
                @click="toggleNoticia(noticia.id)">
                <!-- Cabecera: Título a la izquierda, Fecha a la derecha -->
                <div class="card-header d-flex justify-content-between align-items-center bg-white border-bottom">
                    <h5 class="mb-0 text-primary fw-semibold">{{ noticia.titulo }}</h5>
                    <small class="text-muted text-nowrap ms-3">
                        <i class="bi bi-calendar-event me-1"></i>
                        {{ formatearFecha(noticia.fecha_publicacion) }}
                    </small>
                </div>

                <!-- Cuerpo: Texto truncado o completo -->
                <div class="card-body">
                    <transition name="fade" mode="out-in">
                        <p :key="expandidas.has(noticia.id)" class="card-text mb-0 text-secondary lh-base">
                            {{ expandidas.has(noticia.id) ? noticia.contenido : truncarTexto(noticia.contenido, 256) }}
                        </p>
                    </transition>
                    <div v-if="noticia.contenido.length > 256" class="text-end mt-2">
                        <small class="text-primary fw-bold user-select-none">
                            {{ expandidas.has(noticia.id) ? 'Ver menos ▲' : 'Ver más ▼' }}
                        </small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mensaje si no hay noticias -->
        <div v-if="noticias.length === 0" class="text-center text-muted mt-5">
            <i class="bi bi-newspaper fs-1"></i>
            <p class="mt-3">No hay noticias disponibles</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { getNoticias, addNoticia } from "@/api/noticias.js";

/* =================================== SCRIPT CRUD =================================== */

const noticias = ref([]);
const expandidas = ref(new Set()); // Para rastrear qué noticias están expandidas

const nuevaNoticia = ref({
    titulo: "",
    contenido: "",
    fecha_publicacion: "",
});

// Cargar clientes al montar el componente

// Zona Cargar clientes Al Montar el componente 
onMounted(async () => {
    await cargarNoticias()   
})

const updateTabla = async () => {
    await getNoticias().then(data => {
        // Ordenar noticias por fecha de publicación descendente (más reciente primero)
        noticias.value = data.sort((a, b) => {
            const fechaA = new Date(a.fecha_publicacion)
            const fechaB = new Date(b.fecha_publicacion)
            return fechaB - fechaA // Descendente: más nueva primero
        })
        
    })
    
}

const cargarNoticias = async () => {
    await updateTabla()
    Swal.fire({
        icon: 'success',
        title: "Listando Noticias...",
        showConfirmButton: false,
        timer: 1500
    });
}

const guardarNoticia = async () => {
    // Validar duplicados solo si estás creando (no si editando)

    /* if (!editando.value) {
        const duplicado = clientes.value.find(cliente =>
            cliente.dni === nuevoCliente.value.dni ||
            cliente.movil === nuevoCliente.value.movil ||
            cliente.email === nuevoCliente.value.email
        );
        if (duplicado) {
            Swal.fire({
                icon: 'error',
                title: 'DNI, móvil o email duplicados',
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }
    } */

    // Confirmación antes de guardar
    const result = await Swal.fire({
       /*  title: editando.value ? '¿Desea modificar este cliente?' : '¿Desea grabar este cliente?', */
        title: '¿Desea grabar esta noticia ?',
        icon: 'warning',
        showCancelButton: true,
        /* confirmButtonText: editando.value ? 'Modificar' : 'Grabar', */
        confirmButtonText: 'Grabar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    //  cliente.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
    try {
        /* if (editando.value) {
            // Validar campos
            // Modificar cliente (PUT)+

            const clienteActualizado = await updateCliente(clienteEditandoId.value, nuevoCliente.value);

            // Actualiza el cliente en la lista local
            const index = clientes.value.findIndex(c => c.id === clienteEditandoId.value);
            if (index !== -1) clientes.value[index] = clienteActualizado;
            Swal.fire({
                icon: 'success',
                title: 'Cliente modificado',
                showConfirmButton: false,
                timer: 1500
            });
        } else { */
            // Agregar cliente (POST)
        
/*         nuevaNoticia.fecha_publicacion=;
 */
        const noticiaAgregada = await addNoticia(nuevaNoticia.value);
            noticias.value.push(noticiaAgregada);
            Swal.fire({
                icon: 'success',
                title: 'Noticia agregada',
                showConfirmButton: false,
                timer: 1500
            });
        /* } */

        // Reset formulario y estado
        nuevaNoticia.value = {
            titulo: "",
            contenido: "",
            fecha_publicacion: "",
        };
        /* editando.value = false;
        clienteEditandoId.value = null; */

        // Reset validaciones si tienes (dniValido, movilValido, etc)
        /* dniValido.value = true;
        movilValido.value = true;
        emailValido.value = true; */

        // Refrescar lista completa (opcional)
        updateTabla();

    } catch (error) {
        console.error('Error al guardar noticia:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al guardar noticia',
            text: 'Inténtelo de nuevo o contacte con el administrador.',
            showConfirmButton: false,
            timer: 1500
        });
    }
};

// Formatear fecha a formato legible
const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    const date = new Date(fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', opciones);
};

// Truncar texto a N caracteres
const truncarTexto = (texto, maxCaracteres) => {
    if (!texto || texto.length <= maxCaracteres) return texto;
    return texto.substring(0, maxCaracteres) + '...';
};

// Toggle expandir/contraer noticia
const toggleNoticia = (id) => {
    if (expandidas.value.has(id)) {
        expandidas.value.delete(id);
    } else {
        expandidas.value.add(id);
    }
    // Forzar actualización de la vista
    expandidas.value = new Set(expandidas.value);
};
</script>

<style scoped>
.noticia-item {
    cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>

