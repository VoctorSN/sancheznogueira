<template>
  <div
    class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm min-vh-75 bg-light"
  >
    <h3 class="text-center my-2">Gestión de Clientes</h3>
    <!-- Formulario -->
    <form @submit.prevent="agregarCliente" class="mb-4">
      <!-- DNI con validación visual -->
      <div class="mb-3 row align-items-center">
        <!-- Columna DNI -->
        <div class="col-md-4 d-flex align-items-center">
          <label for="dni" class="form-label mb-0 w-25">DNI: </label>
          <div class="flex-grow-1">
            <input
              type="text"
              id="dni"
              v-model="nuevoCliente.dni"
              @blur="validarDni"
              class="form-control w-auto"
              :class="{ 'is-invalid': !dniValido }"
              required
            />
            <div v-if="!dniValido" class="invalid-feedback">
              DNI o NIE inválido.
            </div>
          </div>
        </div>

        <!-- Columna Fecha de Alta a la derecha -->
        <div
          class="col-md-4 ms-auto d-flex align-items-center justify-content-end"
        >
          <label for="fechaAlta" class="form-label me-2 mb-0 text-nowrap"
            >Fecha de Alta:</label
          >
          <input
            type="date"
            id="fechaAlta"
            v-model="nuevoCliente.fechaAlta"
            class="form-control w-auto"
          />
        </div>
      </div>

      <!-- Nombre y Apellidos -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Nombre -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="nombre" class="form-label mb-0 text-nowrap w-25"
            >Nombre:</label
          >
          <input
            type="text"
            id="nombre"
            v-model="nuevoCliente.nombre"
            class="form-control flex-grow-1"
            @blur="capitalizarTexto('nombre')"
            required
          />
        </div>

        <!-- Apellidos -->
        <div class="col-md-6 d-flex align-items-center ms-5">
          <label for="apellidos" class="form-label me-4 mb-0 text-nowrap"
            >Apellidos:</label
          >
          <input
            type="text"
            id="apellidos"
            v-model="nuevoCliente.apellidos"
            class="form-control flex-grow-1 ms-1"
            @blur="capitalizarTexto('apellidos')"
            required
          />
        </div>
      </div>

      <!-- Email y Móvil -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Email -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="email" class="form-label mb-0 text-nowrap w-25"
            >Email:</label
          >
          <input
            type="email"
            id="email"
            v-model="nuevoCliente.email"
            class="form-control flex-grow-1"
            @blur="validarEmail"
            :class="{ 'is-invalid': !emailValido }"
            required
          />
        </div>

        <!-- Móvil -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="movil" class="form-label me-4 ms-5 mb-0 text-nowrap"
            >Móvil:</label
          >
          <input
            type="tel"
            id="movil"
            v-model="nuevoCliente.movil"
            @blur="validarMovil"
            class="form-control flex-grow-1 text-center ms-4"
            :class="{ 'is-invalid': !movilValido }"
          />
        </div>
      </div>

      <!-- Dirección, Provincia y Municipio -->
      <div class="mb-3 row g-3 align-items-center">
        <!-- Dirección -->
        <div class="col-md-5 d-flex align-items-center">
          <label for="direccion" class="form-label mb-0 w-25 text-nowrap"
            >Dirección:</label
          >
          <input
            type="text"
            id="direccion"
            @blur="capitalizarTexto('direccion')"
            v-model="nuevoCliente.direccion"
            class="form-control flex-grow-1"
          />
        </div>

        <!-- Provincia -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="provincia" class="form-label me-2 ms-5 mb-0 text-nowrap"
            >Provincia:</label
          >
          <select
            id="provincia"
            v-model="nuevoCliente.provincia"
            class="form-select flex-grow-1 w-25"
            @change="filtrarMunicipios"
          >
            <option disabled value="">Seleccione provincia</option>
            <option v-for="prov in provincias" :key="prov" :value="prov.nm">
              {{ prov.nm }}
            </option>
          </select>
        </div>

        <!-- Municipio -->
        <div class="col-md-3 d-flex align-items-center">
          <label for="municipio" class="form-label me-2 ms-4 mb-0 text-nowrap"
            >Municipio:</label
          >
          <select
            id="municipio"
            v-model="nuevoCliente.municipio"
            class="form-select flex-grow-1 w-auto"
          >
            <option disabled value="">Seleccione municipio</option>
            <option
              v-for="mun in municipiosFiltrados"
              :key="mun"
              :value="mun.nm"
            >
              {{ mun.nm }}
            </option>
          </select>
        </div>
      </div>

      <!-- Histórico -->
      <div class="d-flex justify-content-end mb-2">
        <input
          type="checkbox"
          id="historico"
          v-model="nuevoCliente.historico"
          class="form-check-input"
        />
        <label for="historico" class="form-check-label ms-3 me-5 mb-0"
          >Histórico</label
        >
      </div>

      <!-- Botón centrado -->
      <div class="text-center">
        <button
          type="submit"
          class="btn btn-primary border-0 shadow-none rounded-0"
        >
          Grabar
        </button>
      </div>
    </form>
    <!-- Lista de Clientes -->
    <div class="table-responsive">
      <h4 class="text-center w-100">Listado Clientes</h4>
      <table class="table table-bordered table-striped w-100">
        <thead class="table-primary">
          <tr>
            <th class="text-center">ID</th>
            <th class="text-center">Apellidos</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Móvil</th>
            <th class="text-center">Municipio</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cliente, index) in clientes" :key="index">
            <th scope="row" class="text-center">{{ index + 1 }}</th>
            <td>{{ cliente.apellidos }}</td>
            <td>{{ cliente.nombre }}</td>
            <td class="text-center">{{ cliente.movil }}</td>
            <td class="text-center">{{ cliente.municipio }}</td>
            <td class="align-middle text-center">
              <button
                @click="eliminarCliente(cliente.movil)"
                class="btn btn-danger btn-sm me-2 border-0 shadow-none rounded-0"
                title="Eliminar cliente"
                aria-label="Eliminar cliente"
              >
                <i class="bi bi-trash"></i>
              </button>
              <button
                @click="editarCliente(cliente.movil)"
                class="btn btn-warning btn-sm border-0 shadow-none rounded-0"
                title="Editar cliente"
                aria-label="Editar cliente"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import provmuniData from "@/data/provmuni.json";
import Swal from "sweetalert2";
import { getClientes, deleteCliente } from "@/api/clientes.js";

/* =================================== SCRIPT CRUD =================================== */

const nuevoCliente = ref({
  dni: "",
  nombre: "",
  apellidos: "",
  email: "",
  movil: "",
  direccion: "",
  provincia: "",
  municipio: "",
  fechaAlta: "",
  historico: false,
});

const editando = ref(false);
const clienteEditandoId = ref(null);

// Función Listar Clientes con get

const clientes = ref([]);

// Cargar clientes al montar el componente
onMounted(async () => {
  clientes.value = await getClientes();
  Swal.fire({
    icon: "success",
    title: "Listando Clientes...",
    showConfirmButton: false,
    timer: 1500,
  });
});

const agregarCliente = () => {
  clientes.value.push({ ...nuevoCliente.value });
  // Reiniciar el formulario
  nuevoCliente.value = {
    dni: "",
    nombre: "",
    apellidos: "",
    email: "",
    movil: "",
    direccion: "",
    provincia: "",
    municipio: "",
    fechaAlta: "",
    historico: false,
  };
};

// Funcion Eliminar Cliente con patch (histórico a false)
const eliminarCliente = async (movil) => {
  // Refrescar lista desde la API
  clientes.value = await getClientes();
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
  clientes.value = await getClientes();

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
  nuevoCliente.value = { ...cliente }; // 🔁 Aquí cargas el formulario con los datos
  editando.value = true;
  // Formatear fecha para el input type="date"
  nuevoCliente.value.fecha_alta = formatearFechaParaInput(cliente.fecha_alta);
  // Actualiza municipios filtrados según la provincia seleccionada
  filtrarMunicipios();
  nuevoCliente.value.municipio = cliente.municipio; // 🟢 Ahora estamos en modo edición
  clienteEditandoId.value = cliente.id;
};

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
const formatearFechaParaInput = (fecha) => {
  if (!fecha) return "";
  const partes = fecha.split("/");
  if (partes.length !== 3) return "";
  // partes = [dd, mm, yyyy]
  return `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(
    2,
    "0"
  )}`;
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
