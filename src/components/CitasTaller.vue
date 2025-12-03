<template>
    <div class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm min-vh-75 bg-light">
        <div class="d-flex justify-content-center">
            <h2 class="text-center mb-3 text-primary fw-bold">
                <i class="bi bi-tools me-2"></i>
                Gestión de Citas
            </h2>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="guardarCita" class="mt-1 mb-2">
            <!-- DNI con validación visual -->
            <div class="mb-3 row g-3 align-items-center">

                <!-- Columna DNI -->
                <div class="col-md-4 d-flex align-items-center">
                    <label for="matricula" class="form-label mb-0 text-nowrap flex-shrink-0"
                        style="min-width: 100px;">Matricula:
                    </label>
                    <input type="text" id="matricula" v-model="nuevaCita.matricula" @blur="validarMatricula"
                        class="form-control w-auto" :class="{ 'is-invalid': !matriculaValida }" required />

                    <div v-if="!matriculaValida" class="ms-1 d-flex invalid-feedback">
                        Matricula inválida.
                    </div>
                </div>

                <!-- Columna Fecha de Alta a la derecha -->
                <div class="col-md-4 d-flex align-items-center justify-content-start">
                    <label for="fecha_cita" class="form-label ms-3 me-2 mb-0 text-nowrap">Fecha de la Cita:</label>
                    <input type="date" id="fecha_cita" v-model="nuevaCita.fecha_cita" class="form-control w-auto ms-3"
                        oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
                        oninput="this.setCustomValidity('')" />
                </div>

                <!-- Provincia -->
                <div class="col-md-4 d-flex align-items-center">
                    <label for="operacion" class="form-label mb-0 text-nowrap flex-shrink-0"
                        style="min-width: 125px;">Operacion:</label>
                    <select id="provincia" v-model="nuevaCita.servicio_taller" class="form-select flex-grow-1" required>
                        <option disabled value="">Seleccione el servicio</option>
                        <option key="0" value="revision">Revision</option>
                        <option key="1" value="prelTV">PrelTV</option>
                        <option key="2" value="neumaticos">Neumáticos</option>
                        <option key="3" value="frenos">Frenos</option>
                        <option key="4" value="cambioAceite">Cambio de Aceite</option>
                    </select>
                </div>

            </div>

            <div class="mb-3 row g-3 align-items-center">
                <!-- Móvil -->
                <div class="col-md-4 d-flex align-items-center">
                    <label for="movil" class="form-label mb-0 text-nowrap flex-shrink-0"
                        style="min-width: 100px;">Móvil:</label>
                    <input type="tel" id="movil" v-model="nuevaCita.movil_cliente" @blur="validarMovil"
                        style="max-width: 200px;" class="form-control flex-grow-1 text-center"
                        :class="{ 'is-invalid': !movilValido }" required />
                    <div v-if="!movilValido" class="ms-1 d-flex invalid-feedback">
                        Móvil inválido.
                    </div>
                </div>

                <!-- Tipo Cliente -->
                <div class="col-md-4 d-flex align-items-center">
                    <label for="estadoCita2" class="ms-3">Estado de la Cita: </label>
                    <div class="mx-3 d-flex align-items-center">
                        <input type="radio" id="estadoCita2" v-model="nuevaCita.estado_cita" value="pendiente"
                            checked />
                        <label for="estadoCita2" class="ms-1">Pendiente</label>
                    </div>
                    <div class="mx-3 d-flex align-items-center">
                        <input type="radio" id="estadoCita" v-model="nuevaCita.estado_cita" value="finalizado"
                            :disabled="!editando" />
                        <label for="estadoCita" class="ms-1">Finalizado</label>
                    </div>
                </div>


                <div class="col-md-1 ms-auto d-flex align-items-center justify-content-end">
                    <button type="submit" class="btn btn-primary btn-sm mx-2 border-0 shadow-none rounded-0"
                        @click="vaciarFormulario()">
                        <i class=" bi bi-arrow-clockwise"></i>
                    </button>
                </div>
            </div>


            <div class="d-flex justify-content-center mb-2">
                <div class="text-center ">
                    <input type="checkbox" id="avisolegal" v-model="nuevaCita.acepta" class="form-check-input" />
                    <span class="form-check-label ms-3 me-5 mb-0">
                        Acepto el presupuesto
                    </span>
                </div>
            </div>


            <!-- Botón centrado -->
            <div class="text-center d-flex gap-3 justify-content-center">
                <button type="submit" class="btn btn-primary border-0 shadow-none rounded-0"
                    :disabled="!nuevaCita.acepta">
                    {{ editando ? 'Modificar' : 'Grabar' }}
                </button>
            </div>
        </form>
        <!-- Lista de Clientes -->
        <div class="table-responsive">
            <h4 class="text-center w-100">Listado Clientes</h4>
            <table class="table table-bordered table-striped table-hover table-sm align-middle">
                <thead class="table-primary">
                    <tr>
                        <th class="text-center">ID</th>
                        <th class="text-center">Fecha Cita</th>
                        <th class="text-center">Matricula</th>
                        <th class="text-center">Móvil</th>
                        <th class="text-center">Operación</th>
                        <th class="text-center">Estado</th>
                        <th class="text-center w-5">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(cita, index) in citasPaginados" :key="index">
                        <th scope="row" class="text-center">{{ cita.id }}</th>
                        <td class="text-center">{{ cita.fecha_cita }}</td>
                        <td class="text-center">{{ cita.matricula }}</td>
                        <td class="text-center">{{ cita.movil_cliente }}</td>
                        <td class="text-center">{{ cita.servicio_taller }}</td>
                        <td class="text-center">{{ cita.estado_cita }}</td>
                        <td class="text-center w-10">
                            <button @click="eliminarCita(cita.movil_cliente)"
                            class="btn btn-danger btn-sm me-2 border-0 shadow-none rounded-0" title="Eliminar cita"
                            aria-label="Eliminar cita">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button @click="editarCita(cita.movil_cliente)"
                            class="btn btn-warning btn-sm border-0 dow-none rounded-0" title="Editar cita"
                            aria-label="Editar cita">
                            <i class="bi bi-pencil"></i>
                        </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!--  NAVEGACION DE PAGINAS -->
            <!-- Navegación de página-->
            <div class="d-flex justify-content-center my-3">
                <button class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none" @click="beforePagina"
                    :disabled="currentPage <= 1">
                    <i class="bi bi-chevron-left "></i>
                </button>
                <span class="mx-3 align-self-center text-muted">Página {{ currentPage }}</span>
                <button class="btn btn-outline-primary btn-sm rounded-0 border-1 shadow-none" @click="nextPagina"
                    :disabled="currentPage >= totalPages">
                    <i class="bi bi-chevron-right "></i>
                </button>
            </div>


        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { getCitas, addCita, deleteCita, updateCita, getCitaPorMovil } from "@/api/taller.js";

/* =================================== SCRIPT CRUD =================================== */

const citaVacia = {
    matricula: "",
    movil_cliente: "",
    fecha_cita: "",
    servicio_taller: "",
    estado_cita: "",
    acepta: false,
}

const nuevaCita = ref({
    ...citaVacia
});

const editando = ref(false);
const citaEditandoId = ref(null);

var numCitas = ref(0);
var currentPage = ref(1);
var citasPerPage = 5;

// Función Listar Clientes con get

const citas = ref([]);

// Cargar clientes al montar el componente

// Zona Cargar clientes Al Montar el componente 
onMounted(async () => {
    cargarCitas()
})

const updateTabla = () => {
    getCitas().then(data => {
        citas.value = data
        numCitas.value = data.length

    })
}

///avanzar y retroceder

// Métodos de paginación
const beforePagina = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPagina = () => {
    //redondear hacia arriba para mostrar la última página aunque no esté completa

    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const citasPaginados = computed(() => {
    const start = (currentPage.value - 1) * citasPerPage
    const end = start + citasPerPage
    return citas.value.slice(start, end)
})


const cargarCitas = () => {
    updateTabla()
    Swal.fire({
        icon: 'success',
        title: "Listando Citas...",
        showConfirmButton: false,
        timer: 1500
    });
}

const totalPages = computed(() => {
    return Math.ceil(numCitas.value / citasPerPage)
})


const guardarCita = async () => {
    // Validar matrícula antes de guardar
    if (!matriculaValida.value) {
        Swal.fire({
            icon: 'error',
            title: 'Matrícula inválida',
            text: 'La matrícula debe tener 10 caracteres.',
            showConfirmButton: true
        });
        return;
    }

    // Validar móvil antes de guardar
    if (!movilValido.value) {
        Swal.fire({
            icon: 'error',
            title: 'Móvil inválido',
            text: 'El móvil debe empezar por 6 o 7 y tener 9 dígitos.',
            showConfirmButton: true
        });
        return;
    }

    // Validar duplicados solo si estás creando (no si editando)

    if (!editando.value) {
        const duplicado = citas.value.find(cita =>
            cita.movil_cliente === nuevaCita.value.movil_cliente
        );
        if (duplicado) {
            Swal.fire({
                icon: 'error',
                title: 'Móvil duplicado',
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }
    }

    if (nuevaCita.value.fecha_cita === undefined || nuevaCita.value.fecha_cita === "") {
        Swal.fire({
            icon: 'error',
            title: 'Rellena la fecha de Cita',
            showConfirmButton: false,
            timer: 2000
        });
        return;
    }

    // Confirmación antes de guardar
    const result = await Swal.fire({
        title: editando.value ? '¿Desea modificar esta cita?' : '¿Desea grabar esta cita?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    try {
        if (editando.value) {
            // Validar campos

            const citaActualizada = await updateCita(citaEditandoId.value, nuevaCita.value);
            const index = citas.value.findIndex(c => c.id === citaEditandoId.value);
            if (index !== -1) citas.value[index] = citaActualizada;
            Swal.fire({
                icon: 'success',
                title: 'Cita modificada',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            // Agregar cita (POST)

            if (nuevaCita.value.estado_cita === undefined || nuevaCita.value.estado_cita === "") {
                nuevaCita.value.estado_cita = "pendiente"
            }

            const citaAgregada = await addCita(nuevaCita.value);
            citas.value.push(citaAgregada);
            Swal.fire({
                icon: 'success',
                title: 'Cita agregada',
                showConfirmButton: false,
                timer: 1500
            });
        }

        // Reset formulario y estado
        nuevaCita.value = { ...citaVacia };
        nuevaCita.value.estado_cita = "pendiente"
        editando.value = false;
        citaEditandoId.value = null;

        // Reset validaciones si tienes (dniValido, movilValido, etc)
        matriculaValida.value = true;
        movilValido.value = true;

        // Refrescar lista completa (opcional)
        updateTabla();

    } catch (error) {
        console.error('Error al guardar cita:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al guardar cita',
            text: 'Inténtelo de nuevo o contacte con el administrador.',
            showConfirmButton: false,
            timer: 1500
        });
    }
};

// Funcion Eliminar Cliente con patch (histórico a false)
const eliminarCita = async (movil) => {
    // Refrescar lista desde la API
    cargarCitas();
    // Buscar cliente completo (que incluye el ID)
    const citaAEliminar = citas.value.find(cita => cita.movil_cliente === movil);

    if (!citaAEliminar) {
        Swal.fire({
            icon: 'error',
            title: 'Cita no encontrada',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    // Pedir confirmación antes de eliminar
    const result = await Swal.fire({
        title: `¿Eliminar la cita de ${citaAEliminar.matricula} con numero ${citaAEliminar.movil_cliente}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });


    // Si no confirma, salir
    if (!result.isConfirmed) return;

    // Si confirma, eliminar cliente usando la API y movil como ID
    await deleteCita(citaAEliminar.id);
    // Refrescar la lista desde la "API"
    citas.value = cargarCitas();

    Swal.fire({
        icon: 'success',
        title: 'Cita eliminada',
        showConfirmButton: false,
        timer: 1500
    });

    vaciarFormulario()
};


// Función Editar Cliente (carga datos en el formulario)
const editarCita = (movil) => {
    const cita = citas.value.find((c) => c.movil_cliente === movil);
    if (!cita) {
        Swal.fire({
            icon: "error",
            title: "Cita no encontrada",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }


    // Copiar datos al formulario
    nuevaCita.value = { ...cita }; // 🔁 Aquí cargas el formulario con los datos
    editando.value = true;
    // Formatear fecha para el input type="date"
    nuevaCita.value.fecha_cita = formatearFechaParaInput(cita.fecha_cita);

    citaEditandoId.value = cita.id;
    if (nuevaCita.value.tipo_cliente === undefined) {
        nuevaCita.value.tipo_cliente = "pendiente"
    }
};

///CODIGO BUSQUEDA COMPONENTES

const vaciarFormulario = async () => {
    nuevaCita.value = { ...citaVacia };
    nuevaCita.value.estado_cita = "pendiente"
    editando.value = false;
    citaEditandoId.value = null;

    movilValido.value = true;
    matriculaValida.value = true;
}


// Función única: capitaliza y asigna en el mismo paso
const capitalizarTexto = (campo) => {
    const texto = nuevaCita.value[campo] ?? "";
    nuevaCita.value[campo] = texto
        .toLowerCase()
        .split(" ")
        .map((palabra) => {
            if (!palabra) return "";
            return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
        })
        .join(" ");
};

const matriculaValida = ref(true);

// Validar al salir del campo
const validarMatricula = () => {
    const matricula = nuevaCita.value.matricula.trim().toUpperCase();
    matriculaValida.value = matricula.length === 10;
    nuevaCita.value.matricula = matricula.toUpperCase();
};

// Validar móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
    const movil = nuevaCita.value.movil_cliente.trim();

    if (movil === "") {
        movilValido.value = true; // Vacío = válido (opcional)
        return true;
    }

    if (movil.charAt(0) === "6" || movil.charAt(0) === "7") {
        movilValido.value = movilRegex.test(movil);
        return movilValido.value;
    } else {
        movilValido.value = false;
        return false;
    }
};

// conversor fecha
function formatearFechaParaInput(fecha) {
    if (!fecha) return '';

    // Detecta formato dd/mm/yyyy
    if (fecha.includes('/')) {
        const [dd, mm, yyyy] = fecha.split('/');
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }

    // Detecta formato yyyy-mm-dd
    if (fecha.includes('-')) {
        const partes = fecha.split('-');
        if (partes.length === 3) return fecha; // ya formato ISO
    }

    return '';
}
</script>

<style scoped>
.gestion-clientes {
    width: 95%;
    max-width: none;
    margin: 0 auto;
    padding: 2rem 0;
}

.form-control {
    width: 100%;
}

.is-invalid {
    border-color: #f28b82 !important;
    background-color: #ffe6e6;
}

.invalid-feedback {
    display: block;
}
</style>
