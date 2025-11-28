<template>
    <div class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm min-vh-75 bg-light">
        <h3 class="text-center my-4 text-primary"><i class="bi bi-newspaper"></i> Noticias</h3>

        <form v-if="isAdmin" @submit.prevent="guardarNoticia" class="mb-4">
            <div class="card shadow-sm p-4 mb-5">
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-2">
                        <label class="form-label fw-semibold">Título:</label>
                        <button type="button" @click.stop="limpiarCampos()"
                            class="btn btn-outline-primary btn-sm shadow-none rounded" title="Eliminar noticia"
                            aria-label="Eliminar noticia">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                    <input type="text" class="form-control" v-model="nuevaNoticia.titulo"
                        placeholder="Introduce el título de la noticia" @blur="capitalizarTexto('titulo')" required />
                </div>

                <div class="mb-3">
                    <label class="form-label fw-semibold">Contenido:</label>
                    <textarea class="form-control" rows="4" placeholder="Escribe el contenido de la noticia"
                        v-model="nuevaNoticia.contenido" required></textarea>
                </div>
                <div class="d-flex justify-content-center"> <button type="submit"
                        class="btn btn-primary border-0 shadow-none rounded-0">Publicar</button>
                </div>
            </div>
        </form>

        <div class="noticias-list">
            <div v-for="noticia in noticias" :key="noticia.id" class="noticia-item card mb-3 shadow-sm border-0"
                @click="toggleNoticia(noticia.id)">
                <!-- Cabecera: Título a la izquierda, Fecha a la derecha -->
                <div class="card-header d-flex justify-content-between align-items-center bg-white border-bottom">
                    <h5 class="mb-0 text-primary fw-semibold">{{ noticia.titulo }}</h5>
                    <div class="d-flex justify-content-end">
                        <button @click.stop="eliminarNoticia(noticia.id)"
                            class="btn btn-outline-danger btn-sm shadow-none rounded m-10" title="Eliminar noticia"
                            aria-label="Eliminar noticia">
                            <i class="bi bi-trash"></i>
                        </button>
                        <small class="text-muted text-nowrap ms-3">
                            <i class="bi bi-calendar-event me-1"></i>
                            {{ formatearFecha(noticia.fecha_publicacion) }}
                        </small>
                    </div>
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
import { getNoticias, addNoticia, deleteNoticia, updateNoticia } from "@/api/noticias.js";

/* =================================== SCRIPT CRUD =================================== */

const noticias = ref([]);
const expandidas = ref(new Set()); // Para rastrear qué noticias están expandidas

const editando = ref(false);
const noticiaEditandoId = ref(null);

const isAdmin = sessionStorage.getItem("isAdmin") === "true"

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

const limpiarCampos = () => {
    editando.value = false
    noticiaEditandoId.value = null

    nuevaNoticia.value = {
        titulo: "",
        contenido: "",
        fecha_publicacion: "",
    };
}

const guardarNoticia = async () => {
    // Validar duplicados solo si estás creando (no si editando)

    const duplicado = noticias.value.find(noticia =>
        noticia.titulo === nuevaNoticia.value.titulo
    );
    if (duplicado) {
        Swal.fire({
            icon: 'error',
            title: 'Título duplicado',
            showConfirmButton: false,
            timer: 2000
        });
        return;
    }


    // Confirmación antes de guardar
    const result = await Swal.fire({
        title: editando.value ? '¿Desea modificar esta noticia?' : '¿Desea grabar esta noticia?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    try {
        const hoy = new Date();
        nuevaNoticia.value.fecha_publicacion = hoy.toISOString().split('T')[0];
        if (editando.value) {
            // Validar campos
            // Modificar cliente (PUT)+

            const noticiaActualizada = await updateNoticia(noticiaEditandoId.value, nuevaNoticia.value);

            // Actualiza el cliente en la lista local
            const index = noticias.value.findIndex(n => n.id === noticiaEditandoId.value);
            if (index !== -1) noticias.value[index] = noticiaActualizada;
            Swal.fire({
                icon: 'success',
                title: 'Noticia modificada',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            // Agregar cliente (POST)



            const noticiaAgregada = await addNoticia(nuevaNoticia.value);
            noticias.value.push(noticiaAgregada);

            Swal.fire({
                icon: 'success',
                title: 'Noticia agregada',
                showConfirmButton: false,
                timer: 1500
            });
        }
        // Reset formulario y estado
        nuevaNoticia.value = {
            titulo: "",
            contenido: "",
            fecha_publicacion: "",
        };

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
    editando.value = false;
    noticiaEditandoId.value = null;
};

const editarNoticia = (id) => {
    const noticia = noticias.value.find((n) => n.id === id);
    if (!noticia) {
        Swal.fire({
            icon: "error",
            title: "Noticia no encontrada",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }

    // Copiar datos al formulario
    nuevaNoticia.value = { ...noticia }; // 🔁 Aquí cargas el formulario con los datos
    editando.value = true;

    noticiaEditandoId.value = noticia.id;
};

const eliminarNoticia = async (id) => {
    // Refrescar lista desde la API
    updateTabla();
    // Buscar cliente completo (que incluye el ID)
    const noticiaAEliminar = noticias.value.find(noticia => noticia.id === id);

    if (!noticiaAEliminar) {
        Swal.fire({
            icon: 'error',
            title: 'Noticia no encontrado',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    // Pedir confirmación antes de eliminar
    const result = await Swal.fire({
        title: `¿Eliminar la noticia ${noticiaAEliminar.titulo}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });


    // Si no confirma, salir
    if (!result.isConfirmed) return;

    // Si confirma, eliminar cliente usando la API y movil como ID
    await deleteNoticia(noticiaAEliminar.id);
    // Refrescar la lista desde la "API"
    noticias.value = cargarNoticias();

    Swal.fire({
        icon: 'success',
        title: 'Noticia eliminada',
        showConfirmButton: false,
        timer: 1500
    });
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

const capitalizarTexto = (campo) => {
    const texto = nuevaNoticia.value[campo] ?? "";
    nuevaNoticia.value[campo] = texto
        .toLowerCase()
        .split(" ")
        .map((palabra) => {
            if (!palabra) return "";
            return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
        })
        .join(" ");
};
</script>

<style scoped>
.noticia-item {
    cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
