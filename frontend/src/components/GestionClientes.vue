<template>
    <body>
        <div class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm min-vh-75 bg-light">
            <div class="d-flex justify-content-center">
                <h2 class="text-center mb-3 text-primary fw-bold">
                    <i class="bi bi-people-fill me-2"></i>
                    Gestión de Clientes
                </h2>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="guardarCliente" class="mt-1 mb-2">
                <!-- DNI con validación visual -->
                <div class="mb-3 row g-3 align-items-center">

                    <!-- Columna DNI -->
                    <div class="col-md-4 d-flex align-items-center">
                        <label for="dni" class="form-label mb-0 text-nowrap flex-shrink-0"
                            style="min-width: 120px;">DNI:
                        </label>
                        <input type="text" id="dni" v-model="nuevoCliente.dni" @blur="validarDni"
                            class="form-control w-auto" :class="{ 'is-invalid': !dniValido }" :disabled="editando"
                            required />
                        <button type="button" @click="buscarClientePorDNI(nuevoCliente.dni)" :hidden="!isAdmin"
                            class="btn btn-primary btn-sm mx-2 border-0 shadow-none rounded-0" title="Buscar DNI"
                            aria-label="Buscar DNI">
                            <i class="bi bi-search"></i>
                        </button>

                        <div v-if="!dniValido" class="invalid-feedback">
                            DNI o NIE inválido.
                        </div>
                    </div>

                    <!-- Columna Fecha de Alta a la derecha -->
                    <div class="col-md-4 ms-auto d-flex align-items-center justify-content-center">
                        <label for="fecha_alta" class="form-label me-2 mb-0 text-nowrap">Fecha de Alta:</label>
                        <input type="date" id="fecha_alta" v-model="nuevoCliente.fecha_alta" class="form-control w-auto"
                            oninvalid="this.setCustomValidity('Por favor, rellene este campo')"
                            oninput="this.setCustomValidity('')" />
                    </div>

                    <!-- Tipo Cliente -->
                    <div class="col-md-3 d-flex align-items-center">
                        <label for="tipocliente2" class="ms-1">Tipo De Cliente: </label>
                        <div class="mx-3 d-flex align-items-center">
                            <input type="radio" id="tipocliente" v-model="nuevoCliente.tipo_cliente" value="particular"
                                checked />
                            <label for="tipocliente" class="ms-1">Particular</label>
                        </div>
                        <div class="mx-3 d-flex align-items-center">
                            <input type="radio" id="tipocliente2" v-model="nuevoCliente.tipo_cliente" value="empresa" />
                            <label for="tipocliente2" class="ms-1">Empresa</label>
                        </div>
                    </div>

                    <div class="col-md-1 ms-auto d-flex align-items-center justify-content-end">
                        <button type="submit" class="btn btn-primary btn-sm mx-2 border-0 shadow-none rounded-0"
                            @click="vaciarFormulario()">
                            <i class=" bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>

                <!-- Nombre y Apellidos -->
                <div class="mb-3 row g-3 align-items-center">
                    <!-- Nombre -->
                    <div class="col-md-5 d-flex align-items-center">
                        <label for="nombre" class="form-label mb-0 text-nowrap flex-shrink-0"
                            style="min-width: 120px;">Nombre:</label>
                        <input type="text" id="nombre" v-model="nuevoCliente.nombre" class="form-control flex-grow-1"
                            @blur="capitalizarTexto('nombre')" required />
                    </div>

                    <!-- Apellidos -->
                    <div class="col-md-6 d-flex align-items-center ms-5">
                        <label for="apellidos" class="form-label mb-0 text-nowrap flex-shrink-0"
                            style="min-width: 120px;">Apellidos:</label>
                        <input type="text" id="apellidos" v-model="nuevoCliente.apellidos"
                            class="form-control flex-grow-1" @blur="capitalizarTexto('apellidos')" required />
                    </div>
                </div>

                <!-- Email y Móvil -->
                <div class="mb-3 row g-3 align-items-center">
                    <!-- Email -->
                    <div class="col-md-5 d-flex align-items-center">
                        <label for="email" class="form-label mb-0 text-nowrap flex-shrink-0"
                            style="min-width: 120px;">Email:</label>
                        <input type="email" id="email" v-model="nuevoCliente.email" class="form-control flex-grow-1"
                            @blur="validarEmail" :class="{ 'is-invalid': !emailValido }" required />
                    </div>

                    <!-- Móvil -->
                    <div class="col-md-3 d-flex align-items-center">
                        <label for="movil" class="form-label mb-0 text-nowrap flex-shrink-0 ms-5"
                            style="min-width: 120px;">Móvil:</label>
                        <input type="tel" id="movil" v-model="nuevoCliente.movil" @blur="validarMovil"
                            class="form-control flex-grow-1 text-center" :class="{ 'is-invalid': !movilValido }" />
                        <button type="button" @click="buscarClientePorMovil(nuevoCliente.movil)" :hidden="!isAdmin"
                            class="btn btn-primary btn-sm mx-2 border-0 shadow-none rounded-0" title="Buscar por móvil"
                            aria-label="Buscar por móvil">
                            <i class="bi bi-search"></i>
                        </button>
                        <div v-if="!movilValido" class="invalid-feedback">
                            Móvil inválido (debe empezar por 6 o 7 y tener 9 dígitos).
                        </div>
                    </div>
                </div>

                <!-- Dirección, Provincia y Municipio -->
                <div class="mb-3 row g-3 align-items-center">
                    <!-- Dirección -->
                    <div class="col-md-5 d-flex align-items-center">
                        <label for="direccion" class="form-label mb-0 text-nowrap flex-shrink-0"
                            style="min-width: 120px;">Dirección:</label>
                        <input type="text" id="direccion" @blur="capitalizarTexto('direccion')"
                            v-model="nuevoCliente.direccion" class="form-control flex-grow-1" />
                    </div>

                    <!-- Provincia -->
                    <div class="col-md-3 d-flex align-items-center">
                        <label for="provincia" class="form-label mb-0 text-nowrap flex-shrink-0 ms-5"
                            style="min-width: 120px;">Provincia:</label>
                        <select id="provincia" v-model="nuevoCliente.provincia" class="form-select flex-grow-1"
                            @change="filtrarMunicipios">
                            <option disabled value="">Seleccione provincia</option>
                            <option v-for="prov in provincias" :key="prov" :value="prov.nm">
                                {{ prov.nm }}
                            </option>
                        </select>
                    </div>

                    <!-- Municipio -->
                    <div class="col-md-4 d-flex align-items-center">
                        <label for="municipio" class="form-label mb-0 text-nowrap flex-shrink-0 ms-4"
                            style="min-width: 100px;">Municipio:</label>
                        <select id="municipio" v-model="nuevoCliente.municipio" class="form-select flex-grow-1">
                            <option disabled value="">Seleccione municipio</option>
                            <option v-for="mun in municipiosFiltrados" :key="mun" :value="mun.nm">
                                {{ mun.nm }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Contraseña y Repetir Contraseña -->
                <div class="mb-3 row g-3 align-items-center justify-content-center">
                    <div class="col-md-4 d-flex align-items-center">
                        <label for="password" class="form-label mb-0 text-nowrap flex-shrink-0 me-2">Contraseña:</label>
                        <input type="password" id="password" v-model="nuevoCliente.password"
                            :disabled="!editingCurrentUser && editando" class="form-control flex-grow-1" />
                    </div>
                    <div class="col-md-4 d-flex align-items-center ms-4">
                        <label for="repetirPassword" class="form-label mb-0 text-nowrap flex-shrink-0 me-2">Repetir
                            Contraseña:</label>
                        <input type="password" id="repetirPassword" v-model="repetirPassword"
                            :disabled="!editingCurrentUser && editando" class="form-control flex-grow-1" />
                    </div>
                </div>

                <div class="d-flex justify-content-between mb-2">
                    <div class="d-flex justify-content-end form-switch invisible">
                        <input type="checkbox" v-model="mostrarHistorico" class="form-check-input"
                            @change="cargarClientes" />
                        <label for="historico" class="form-check-label ms-3 me-5 mb-0">Histórico</label>
                    </div>
                    <div class="text-center ">
                        <input type="checkbox" id="avisolegal" v-model="nuevoCliente.lopd" class="form-check-input" />
                        <span class="form-check-label ms-3 me-5 mb-0">
                            Aceptar terminos y condiciones: <a target="_blank" href="/avisolegal">Aviso Legal</a>
                        </span>
                    </div>
                    <div v-if="isAdmin" class="d-flex justify-content-end form-switch">
                        <input type="checkbox" id="historico" v-model="mostrarHistorico" class="form-check-input"
                            @change="cargarClientes" />
                        <label for="historico" class="form-check-label ms-3 me-5 mb-0">Histórico</label>
                    </div>
                    <div v-if="!isAdmin" class="d-flex justify-content-end form-switch invisible">
                        <input type="checkbox" v-model="mostrarHistorico" class="form-check-input"
                            @change="cargarClientes" />
                        <label for="historico" class="form-check-label ms-3 me-5 mb-0">Histórico</label>
                    </div>
                </div>


                <!-- Histórico -->


                <!-- Botón centrado -->
                <div class="text-center">
                    <button type="submit" class="btn btn-primary border-0 shadow-none rounded-0"
                        :disabled="!nuevoCliente.lopd">
                        {{ editando ? 'Modificar' : 'Grabar' }}
                    </button>
                    <button v-if="isAdmin" class="btn btn-secondary rounded border shadow-none px-4 ms-2" @click="imprimirPDF"
                        type="button"><i class="bi bi-printer"></i>Imprimir</button>
                </div>
            </form>
            <!-- Lista de Clientes -->
            <div v-if="isAdmin" class="table-responsive">
                <h4 class="text-center w-100">Listado Clientes</h4>
                <table class="table table-bordered table-striped table-hover table-sm align-middle">
                    <thead class="table-primary">
                        <tr>
                            <th class="text-center">ID</th>
                            <th class="text-center">Apellidos</th>
                            <th class="text-center">Nombre</th>
                            <th class="text-center">Móvil</th>
                            <th class="text-center">Municipio</th>
                            <th class="text-center w-5">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(cliente, index) in clientesPaginados" :key="index">
                            <th scope="row" class="text-center">{{ (currentPage - 1) * clientesPerPage + index + 1 }}
                            </th>
                            <td>{{ cliente.apellidos }}</td>
                            <td>{{ cliente.nombre }}</td>
                            <td class="text-center">{{ cliente.movil }}</td>
                            <td class="text-center">{{ cliente.municipio }}</td>
                            <td class="text-center w-10">
                                <button @click="eliminarCliente(cliente.movil)"
                                    class="btn btn-danger btn-sm me-2 border-0 shadow-none rounded-0"
                                    title="Eliminar cliente" aria-label="Eliminar cliente">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <button @click="editarCliente(cliente.movil)"
                                    class="btn btn-warning btn-sm border-0 dow-none rounded-0" title="Editar cliente"
                                    aria-label="Editar cliente">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button @click="activarCliente(cliente)"
                                    :class="['btn', 'btn-secondary', 'btn-sm', 'ms-2', 'border-0', 'shadow-none', 'rounded-0', { 'invisible': !cliente.historico }]"
                                    title="Activar cliente">
                                    <i class="bi bi-person-check"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!--  NAVEGACION DE PAGINAS -->
                <!-- Navegación de página-->
                <div class="d-flex justify-content-center my-3">
                    <button class="btn btn-outline-primary btn-sm me-2 rounded-0 border-1 shadow-none"
                        @click="beforePagina" :disabled="currentPage <= 1">
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
    </body>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { getClientes, deleteCliente, addCliente, updateCliente, getClientePorDni } from "@/api/clientes.js";
import provmuniData from "@/data/provmuni.json";
import { checkAdmin, loginUsuario, getDni } from "@/api/authApi.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import bcrypt from "bcryptjs";

const router = useRouter();

/* =================================== SCRIPT CRUD =================================== */
const clienteVacio = {
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    direccion: "",
    provincia: "",
    municipio: "",
    fecha_alta: "",
    tipo_cliente: "",
    historico: false,
    lopd: false,
    password: "",
    tipo: "user"
}

const nuevoCliente = ref({
    ...clienteVacio
});

const repetirPassword = ref("");

const editando = ref(false);
const clienteEditandoId = ref(null);

var mostrarHistorico = ref(false);

var numClientes = ref(0);
var currentPage = ref(1);
var clientesPerPage = 10;

const isAdmin = ref(false);

/// se carga en el onmounted ya que necesita llamar al back
var dni;

// Computed: verifica si está editando su propio perfil
const editingCurrentUser = computed(() => {
    return nuevoCliente.value.dni === dni && editando.value;
});

// Función Listar Clientes con get

const clientes = ref([]);

// Cargar clientes al montar el componente

// Zona Cargar clientes Al Montar el componente 
onMounted(async () => {
    // Verificar si es admin mediante API
    const adminCheck = await checkAdmin();
    isAdmin.value = adminCheck.isAdmin;
    dni = await getDni();


    if (isAdmin.value) {
        cargarClientes()
    }

    if (dni) {
        buscarClientePorDNI(dni)
    }
})

const updateTabla = () => {
    getClientes(mostrarHistorico.value).then(data => {
        clientes.value = data
        numClientes.value = data.length

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

const clientesPaginados = computed(() => {
    const start = (currentPage.value - 1) * clientesPerPage
    const end = start + clientesPerPage
    return clientes.value.slice(start, end)
})


const cargarClientes = () => {
    updateTabla()
    Swal.fire({
        icon: 'success',
        title: "Listando Clientes...",
        showConfirmButton: false,
        timer: 1500
    });
}

const totalPages = computed(() => {
    return Math.ceil(numClientes.value / clientesPerPage)
})


const guardarCliente = async () => {
    // Validar contraseñas
    if (nuevoCliente.value.password !== repetirPassword.value) {
        Swal.fire({
            icon: 'error',
            title: 'Error en contraseña',
            text: 'Las contraseñas no coinciden.',
            showConfirmButton: true
        });
        return;
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(nuevoCliente.value.password, salt)

    // Validar duplicados solo si estás creando (no si editando)

    if (!editando.value) {
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
    }

    // Confirmación antes de guardar
    const result = await Swal.fire({
        title: editando.value ? '¿Desea modificar este cliente?' : '¿Desea grabar este cliente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: editando.value ? 'Modificar' : 'Grabar',
        cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;
    //  cliente.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
    try {

        if (editando.value) {
            // Validar campos
            // Modificar cliente (PUT)

            const clienteActualizado = await updateCliente(clienteEditandoId.value, {
                ...nuevoCliente.value,
                password: hash
            });

            // Actualiza el cliente en la lista local
            const index = clientes.value.findIndex(c => c.id === clienteEditandoId.value);
            if (index !== -1) clientes.value[index] = clienteActualizado;
            Swal.fire({
                icon: 'success',
                title: 'Cliente modificado',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            // Agregar cliente (POST)

            const clienteAgregado = await addCliente({
                ...nuevoCliente.value,
                password: hash
            });
            clientes.value.push(clienteAgregado);
            Swal.fire({
                icon: 'success',
                title: 'Cliente agregado',
                showConfirmButton: false,
                timer: 1500
            });
            const data = await loginUsuario(nuevoCliente.value.dni, nuevoCliente.value.password);

            // Guardar token y datos del usuario en sessionStorage
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('userName', data.nombre);
            router.push({ name: 'Inicio' }).then(() => window.location.reload());
        }

        // Reset formulario y estado
        nuevoCliente.value = { ...clienteVacio };
        editando.value = false;
        clienteEditandoId.value = null;
        repetirPassword.value = ""

        // Reset validaciones si tienes (dniValido, movilValido, etc)
        dniValido.value = true;
        movilValido.value = true;
        emailValido.value = true;

        // Refrescar lista completa (opcional)
        updateTabla();

    } catch (error) {
        console.log('Error al guardar cliente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al guardar cliente',
            text: 'Inténtelo de nuevo o contacte con el administrador.',
            showConfirmButton: false,
            timer: 1500
        });
    }
};

// Funcion Eliminar Cliente con patch (histórico a false)
const eliminarCliente = async (movil) => {
    // Refrescar lista desde la API
    cargarClientes();
    // Buscar cliente completo (que incluye el ID)
    const clienteAEliminar = clientes.value.find(cliente => cliente.movil === movil);

    if (!clienteAEliminar) {
        Swal.fire({
            icon: 'error',
            title: 'Cliente no encontrado',
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    // Pedir confirmación antes de eliminar
    const result = await Swal.fire({
        title: `¿Eliminar al cliente ${clienteAEliminar.nombre} ${clienteAEliminar.apellidos}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });


    // Si no confirma, salir
    if (!result.isConfirmed) return;

    // Si confirma, eliminar cliente usando la API y movil como ID
    await deleteCliente(clienteAEliminar.id);
    // Refrescar la lista desde la "API"
    clientes.value = cargarClientes();

    Swal.fire({
        icon: 'success',
        title: 'Cliente eliminado',
        showConfirmButton: false,
        timer: 1500
    });
};


// Función Editar Cliente (carga datos en el formulario)
const editarCliente = (movil) => {
    const cliente = clientes.value.find((c) => c.movil === movil);
    if (!cliente) {
        Swal.fire({
            icon: "error",
            title: "Cliente no encontrado",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }

    // Copiar datos al formulario
    nuevoCliente.value = { ...cliente, password: "" }; // 🔁 Aquí cargas el formulario con los datos
    editando.value = true;
    // Formatear fecha para el input type="date"
    nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
    // Actualiza municipios filtrados según la provincia seleccionada
    filtrarMunicipios();
    nuevoCliente.value.municipio = cliente.municipio; // 🟢 Ahora estamos en modo edición
    clienteEditandoId.value = cliente.id;
    if (nuevoCliente.value.tipo_cliente === undefined) {
        nuevoCliente.value.tipo_cliente = "particular"
    }
};

// Función para activar cliente (poner historico en true)
const activarCliente = async (cliente) => {
    const confirmacion = await Swal.fire({
        title: `¿Activar cliente ${cliente.nombre} ${cliente.apellidos}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Activar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirmacion.isConfirmed) return;

    try {
        // Crear una copia del cliente con historico en true
        const clienteActivado = { ...cliente, historico: false };

        // Llamar a la API para actualizar
        const actualizado = await updateCliente(cliente.id, clienteActivado);

        // Actualizar la lista local (opcional, también puedes volver a cargar todo)
        const index = clientes.value.findIndex(c => c.id === cliente.id);
        if (index !== -1) {
            clientes.value[index] = actualizado;
        }

        Swal.fire({
            icon: 'success',
            title: 'Cliente reactivado',
            showConfirmButton: false,
            timer: 1500
        });

        // Recargar lista actualizada
        cargarClientes();

    } catch (error) {
        console.error('Error al reactivar cliente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al activar cliente',
            text: 'Por favor, intenta de nuevo.',
            timer: 1500
        });
    }
};

///CODIGO BUSQUEDA COMPONENTES

const buscarClientePorDNI = async (dni) => {
    if (!dni || dni.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Debe introducir un DNI antes de buscar.',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    try {
        const cliente = await getClientePorDni(dni.trim().toUpperCase());

        if (!cliente) {
            Swal.fire({
                icon: 'info',
                title: 'Cliente no encontrado',
                text: 'No existe ningún cliente con ese DNI.',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        // ✅ Cargar los datos en el formulario
        nuevoCliente.value = { ...cliente, password: "" };
        nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);

        // Actualiza lista de municipios si cambia la provincia
        filtrarMunicipios();
        nuevoCliente.value.municipio = cliente.municipio;

        //opcional
        editando.value = true;
        clienteEditandoId.value = cliente.id;

        Swal.fire({
            icon: 'success',
            title: 'Cliente encontrado y cargado',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error buscando cliente por DNI:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al buscar cliente',
            text: 'Verifique la conexión o contacte con el administrador.',
            timer: 2000,
            showConfirmButton: false
        });
    }
}

const buscarClientePorMovil = async (movil) => {
    if (!movil || movil.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Debe introducir un móvil antes de buscar.',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    try {
        // Buscar el cliente en la lista local por móvil
        const cliente = clientes.value.find(c => c.movil === movil.trim());

        if (!cliente) {
            Swal.fire({
                icon: 'info',
                title: 'Cliente no encontrado',
                text: 'No existe ningún cliente con ese móvil.',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        // ✅ Cargar los datos en el formulario
        nuevoCliente.value = { ...cliente, password: "" };
        nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);

        // Actualiza lista de municipios si cambia la provincia
        filtrarMunicipios();
        nuevoCliente.value.municipio = cliente.municipio;

        //opcional
        editando.value = true;
        clienteEditandoId.value = cliente.id;

        Swal.fire({
            icon: 'success',
            title: 'Cliente encontrado y cargado',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (error) {
        console.error('Error buscando cliente por móvil:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al buscar cliente',
            text: 'Verifique la conexión o contacte con el administrador.',
            timer: 2000,
            showConfirmButton: false
        });
    }
}
const vaciarFormulario = async () => {
    nuevoCliente.value = { ...clienteVacio };
    repetirPassword.value = "";
    editando.value = false;
    clienteEditandoId.value = null;

    dniValido.value = true;
    movilValido.value = true;
    emailValido.value = true;
}

/* =================================== SCRIPT AUXILIARES =================================== */

// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive
const dniValido = ref(true); // Por defecto es válido y no muestra error al iniciar

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

    valor = valor.toUpperCase();

    if (dniRegex.test(valor)) {
        const numero = parseInt(valor.slice(0, 8), 10);
        const letra = valor.charAt(8);
        return letra === letras[numero % 23]; //sale con true si es válido
    } else if (nieRegex.test(valor)) {
        const nie = valor.replace("X", "0").replace("Y", "1").replace("Z", "2");
        const numero = parseInt(nie.slice(0, 8), 10);
        const letra = valor.charAt(8);
        return letra === letras[numero % 23]; //sale con true si es válido
    }
    return false;
};

// Validar al salir del campo
const validarDni = () => {
    const dni = nuevoCliente.value.dni.trim().toUpperCase();
    dniValido.value = validarDniNie(dni);
};

// Función única: capitaliza y asigna en el mismo paso
const capitalizarTexto = (campo) => {
    const texto = nuevoCliente.value[campo] ?? "";
    nuevoCliente.value[campo] = texto
        .toLowerCase()
        .split(" ")
        .map((palabra) => {
            if (!palabra) return "";
            return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
        })
        .join(" ");
};

// Validar email
const emailValido = ref(true);
const validarEmail = () => {
    const email = nuevoCliente.value.email.trim();
    // Expresión simple para email válido
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    emailValido.value = regex.test(email);
};

// Validar móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
    const movil = nuevoCliente.value.movil.trim();

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

// Provincias y municipios
const provincias = ref(provmuniData.provincias); // Array de provincias
const municipios = ref(provmuniData.municipios); // Array de municipios para filtrarlos
const municipiosFiltrados = ref([]); // vacío pero contendrá los municipios filtrados

const filtrarMunicipios = () => {
    // nombre de la provincia elegida en el <select>
    const nombreProv = nuevoCliente.value.provincia;

    // 1️⃣ buscar en provincias el objeto con ese nombre
    const prov = provincias.value.find((p) => p.nm === nombreProv);
    if (!prov) {
        municipiosFiltrados.value = [];
        return;
    }

    // 2️⃣ los dos primeros dígitos del id de la provincia
    const codigoProv = prov.id.slice(0, 2);

    // 3️⃣ filtrar los municipios cuyo id empiece por esos dos dígitos
    municipiosFiltrados.value = municipios.value.filter((m) =>
        m.id.startsWith(codigoProv)
    );

    // 4️⃣ opcional: resetear el municipio si ya no corresponde
    nuevoCliente.value.municipio = "";
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
const imprimirPDF = () => {
    const doc = new jsPDF();

    // Obtener fecha y hora actual
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    // Encabezado con título principal
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 128, 185); // Azul
    doc.text("Listado de Vehículos", 105, 20, { align: "center" });

    // Fecha y hora
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado: ${fechaHora}`, 105, 28, { align: "center" });

    // Línea decorativa
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // Definir las columnas de la tabla
    const headers = [
        ["DNI", "Nombre", "Email", "Provincia", "Municipio"],
    ];

    // Definir las filas de la tabla
    const body = clientes.value.map((v) => [
        v.dni,
        v.nombre,
        v.email,
        v.provincia,
        v.municipio,
    ]);

    // Generar la tabla con estilos mejorados
    autoTable(doc, {
        startY: 38,
        head: headers,
        body: body,
        theme: "grid",
        headStyles: {
            fillColor: [41, 128, 185], // Azul
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: "bold",
            halign: "center",
        },
        bodyStyles: {
            fontSize: 10,
            cellPadding: 4,
            halign: "center",
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245], // Gris claro para filas alternas
        },
        columnStyles: {
            0: { fontStyle: "bold" },
            1: { halign: "left" },
            2: { halign: "left" },
            // Matrícula en negrita
            5: { halign: "right" },
        },
        styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        margin: { left: 14, right: 14 },
    });

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `Página ${i} de ${pageCount}`,
            105,
            doc.internal.pageSize.height - 10,
            { align: "center" }
        );
    }

    // Guardar el PDF con fecha y hora española
    const fechaArchivo = ahora.toLocaleString("es-ES", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).replace(/[/:]/g, '-').replace(/,/g, '').replace(/ /g, '_');
    doc.save(`listado_clientes_${fechaArchivo}.pdf`);
};

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
