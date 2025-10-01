<template>
    <div class="mx-auto mt-2 p-4 pb-5 border rounded-3 shadow-sm min-vh-75 bg-light">
        <h3 class="text-center my-2">Gestión de Clientes</h3>
        <!-- Formulario -->
        <form @submit.prevent="agregarCliente" class="mb-4">
            <!-- DNI con validación visual -->
            <div class="mb-3 row align-items-center">
                <!-- Columna DNI -->
                <div class="col-md-4 d-flex align-items-center">
                    <label for="dni" class="form-label mb-0 w-25">DNI: </label>
                    <div class="flex-grow-1">
                        <input type="text" id="dni" v-model="nuevoCliente.dni" @blur="validarDni"
                            class="form-control w-auto" :class="{ 'is-invalid': !dniValido }" required />
                        <div v-if="!dniValido" class="invalid-feedback">
                            DNI o NIE inválido.
                        </div>
                    </div>
                </div>

                <!-- Columna Fecha de Alta a la derecha -->
                <div class="col-md-4 ms-auto d-flex align-items-center justify-content-end">
                    <label for="fechaAlta" class="form-label me-2 mb-0 text-nowrap">Fecha de Alta:</label>
                    <input type="date" id="fechaAlta" v-model="nuevoCliente.fechaAlta" class="form-control w-auto" />
                </div>
            </div>

            <!-- Nombre y Apellidos -->
            <div class="mb-3 row g-3 align-items-center">
                <!-- Nombre -->
                <div class="col-md-5 d-flex align-items-center">
                    <label for="nombre" class="form-label  mb-0 text-nowrap w-25">Nombre:</label>
                    <input type="text" id="nombre" v-model="nuevoCliente.nombre" class="form-control flex-grow-1"
                        @blur="capitalizarTexto('nombre')" required />
                </div>

                <!-- Apellidos -->
                <div class="col-md-6 d-flex align-items-center ms-5">
                    <label for="apellidos" class="form-label me-4 mb-0 text-nowrap">Apellidos:</label>
                    <input type="text" id="apellidos" v-model="nuevoCliente.apellidos" class="form-control flex-grow-1"
                        @blur="capitalizarTexto('apellidos')" required />
                </div>
            </div>

            <!-- Email y Móvil -->
            <div class="mb-3 row g-3 align-items-center">
                <!-- Email -->
                <div class="col-md-5 d-flex align-items-center">
                    <label for="email" class="form-label mb-0 text-nowrap w-25">Email:</label>
                    <input type="email" id="email" v-model="nuevoCliente.email" class="form-control flex-grow-1"
                        @blur="validarEmail" :class="{ 'is-invalid': !emailValido }" required />
                </div>

                <!-- Móvil -->
                <div class="col-md-3 d-flex align-items-center">
                    <label for="movil" class="form-label me-4 ms-5 mb-0 text-nowrap ">Móvil:</label>
                    <input type="tel" id="movil" v-model="nuevoCliente.movil" @blur="validarMovil"
                        class="form-control flex-grow-1 text-center" :class="{ 'is-invalid': !movilValido }" />
                </div>
            </div>



            <!-- Dirección, Provincia y Municipio -->
            <div class="mb-3 row g-3 align-items-center">
                <!-- Dirección -->
                <div class="col-md-5 d-flex align-items-center">
                    <label for="direccion" class="form-label mb-0 w-25 text-nowrap">Dirección:</label>
                    <input type="text" id="direccion" v-model="nuevoCliente.direccion"
                        @blur="capitalizarTexto('direccion')" class="form-control flex-grow-1" />
                </div>

                <!-- Provincia -->
                <div class="col-md-3 d-flex align-items-center">
                    <label for="provincia" class="form-label me-2 ms-5 mb-0 text-nowrap">Provincia:</label>
                    <select id="provincia" v-model="nuevoCliente.provincia" class="form-select flex-grow-1 w-25"
                        @change="filtrarMunicipios">
                        <option disabled value="">Seleccione provincia</option>
                        <option v-for="prov in provincias" :key="prov" :value="prov">{{ prov }}</option>
                    </select>
                </div>

                <!-- Municipio -->
                <div class="col-md-3 d-flex align-items-center">
                    <label for="municipio" class="form-label me-2 ms-4 mb-0 text-nowrap">Municipio:</label>
                    <select id="municipio" v-model="nuevoCliente.municipio" class="form-select flex-grow-1 w-auto">
                        <option disabled value="">Seleccione municipio</option>
                        <option v-for="mun in municipiosFiltrados" :key="mun" :value="mun">{{ mun }}</option>
                    </select>
                </div>
            </div>

            <!-- Histórico -->
            <div class="d-flex justify-content-end mb-2">
                <input type="checkbox" id="historico" v-model="nuevoCliente.historico" class="form-check-input" />
                <label for="historico" class="form-check-label ms-3 me-5 mb-0">Histórico</label>
            </div>

            <!-- Botón centrado -->
            <div class="text-center">
                <button type="submit" class="btn btn-primary">Grabar</button>
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
                            <div>
                                <button @click="eliminarCliente(index)" class="btn btn-danger btn-sm">
                                    <i class="bi bi-trash"></i>
                                </button>
                                <button @click="eliminarCliente(index)" class="btn btn-warning btn-sm ms-2">
                                    <i class="bi bi-pencil"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import provmuniData from '@data/provmuni.json';

const nuevoCliente = ref({
    dni: '',
    nombre: '',
    apellidos: '',
    email: '',
    movil: '',
    direccion: '',
    provincia: '',
    municipio: '',
    fechaAlta: '',
    historico: false
});

const clientes = ref([]);

const agregarCliente = () => {
    clientes.value.push({ ...nuevoCliente.value });
    // Reiniciar el formulario
    nuevoCliente.value = {
        dni: '',
        nombre: '',
        apellidos: '',
        email: '',
        movil: '',
        direccion: '',
        provincia: '',
        municipio: '',
        fechaAlta: '',
        historico: false
    };
};

const eliminarCliente = (index) => {
    clientes.value.splice(index, 1);
};


///SCRIPTS AUXILIARES

// Estado de validez del DNI/NIE si la estructura de datos es más compleja se usa reactive
const dniValido = ref(true);  // Por defecto es válido y no muestra error al iniciar

// Función para validar DNI y NIE
const validarDniNie = (valor) => {
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

    valor = valor.toUpperCase();

    if (dniRegex.test(valor)) {
        const numero = parseInt(valor.slice(0, 8), 10);
        const letra = valor.charAt(8);
        return letra === letras[numero % 23];  //sale con true si es válido
    } else if (nieRegex.test(valor)) {
        const nie = valor.replace('X', '0').replace('Y', '1').replace('Z', '2');
        const numero = parseInt(nie.slice(0, 8), 10);
        const letra = valor.charAt(8);
        return letra === letras[numero % 23];  //sale con true si es válido
    }
    return false;
};
// control email 

const emailValido = ref(true);
const validarEmail = () => {
    const email = nuevoCliente.value.email.trim();
    if (email === '') {
        emailValido.value = true
        return true
    }
    // Expresión simple para email válido
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailValido.value = regex.test(email);
};

// Control móvil
const movilValido = ref(true);
const movilRegex = /^[67]\d{8}$/;

const validarMovil = () => {
    const movil = nuevoCliente.value.movil.trim();

    if (movil === '') {
        movilValido.value = true; // Vacío = válido (opcional)
        return true;
    }

    if (movil.charAt(0) === '6' || movil.charAt(0) === '7') {
        movilValido.value = movilRegex.test(movil);
        return movilValido.value;
    } else {
        movilValido.value = false;
        return false;
    }
};

const capitalizarTexto = (campo) => {
    const texto = nuevoCliente.value[campo] ?? '';
    nuevoCliente.value[campo] = texto
        .toLowerCase()
        .split(' ')
        .map(palabra => {
            if (!palabra) return '';
            return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
        })
        .join(' ');
};


// Validar al salir del campo
const validarDni = () => {
    nuevoCliente.value.dni = nuevoCliente.value.dni.trim().toUpperCase();
    dniValido.value = validarDniNie(nuevoCliente.value.dni);
};

// Provincias y municipios

const provincias = ref(provmuniData.provincias); // Array de provincias
const municipios = ref(provmuniData.municipios); // Array de municipios para filtrarlos
const municipiosFiltrados = ref([]);  // vacío pero contendrá los municipios filtrados

const filtrarMunicipios = () => {
    // nombre de la provincia elegida en el <select>
    const nombreProv = nuevoCliente.value.provincia;

    // 1️⃣ buscar en provincias el objeto con ese nombre
    const prov = provincias.value.find(p => p.nm === nombreProv);
    if (!prov) {
        municipiosFiltrados.value = [];
        return;
    }

    // 2️⃣ los dos primeros dígitos del id de la provincia
    const codigoProv = prov.id.slice(0, 2);

    // 3️⃣ filtrar los municipios cuyo id empiece por esos dos dígitos
    municipiosFiltrados.value = municipios.value.filter(
        m => m.id.startsWith(codigoProv)
    );

    // 4️⃣ opcional: resetear el municipio si ya no corresponde
    nuevoCliente.value.municipio = '';
};


</script>

<style scoped>
.is-invalid {
    border-color: rgb(194, 64, 64);
    background-color: rgb(241, 224, 224);
}

.is-invalid-feedback {
    display: block;
    color: red;
}
</style>
