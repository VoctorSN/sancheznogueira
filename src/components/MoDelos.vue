<template>
    <div class="container-fluid my-4 p-4 border rounded-4 shadow-lg bg-white">
        <h4 class="text-center mb-4 fw-semibold text-primary border-bottom pb-2 mt-2">
            <i class="bi bi-car-front me-2"></i>Registro de Vehículos
        </h4>

        <form @submit.prevent="guardarVehiculo" class="mb-2 mt-1">
            <!-- FILA: Tipo, Marca, Modelo -->
            <div class="row g-3 align-items-center mt-1">
                <div class="col-12 col-md-3 d-flex align-items-center">
                    <label class="form-label mb-0 me-3 text-nowrap">Tipo:</label>
                    <div class="d-flex align-items-center">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="tipo-coche" value="coche"
                                v-model="vehiculo.tipo" />
                            <label class="form-check-label" for="tipo-coche">Coche</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="tipo-furgoneta" value="furgoneta"
                                v-model="vehiculo.tipo" />
                            <label class="form-check-label" for="tipo-furgoneta">Furgoneta</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="tipo-moto" value="moto"
                                v-model="vehiculo.tipo" />
                            <label class="form-check-label" for="tipo-moto">Moto</label>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-2 d-flex align-items-center">
                    <label for="marca" class="form-label mb-0 me-3 text-nowrap">Marca:</label>
                    <input type="text" id="marca" v-model="vehiculo.marca" @blur="capitalizarTexto('marca')"
                        class="form-control rounded-0 shadow-none border" required />
                </div>

                <div class="col-12 col-md-2 d-flex align-items-center">
                    <label for="modelo" class="form-label mb-0 me-3 text-nowrap">Modelo:</label>
                    <input type="text" id="modelo" v-model="vehiculo.modelo" @blur="capitalizarTexto('modelo')"
                        class="form-control rounded-0 shadow-none border" required />
                </div>

                <div class="col-12 col-md-2 d-flex align-items-center">
                    <label for="matricula" class="form-label mb-0 me-3 text-nowrap">Matrícula:</label>
                    <input type="text" id="matricula" v-model="vehiculo.matricula"
                        @blur="vehiculo.matricula = vehiculo.matricula.toUpperCase()"
                        class="form-control rounded-0 shadow-none border" />
                </div>

                <div class="col-12 col-md-2 d-flex align-items-center">
                    <label for="anio" class="form-label mb-0 me-3 text-nowrap">Año:</label>
                    <input type="number" id="anio" v-model="vehiculo.anio"
                        class="form-control rounded-0 shadow-none border text-end" required />
                </div>
            </div>

            <!-- FILA: Año, Kilómetros, Precio -->
            <div class="row g-3 align-items-center mt-2">
                <div class="col-12 col-md-2 d-flex align-items-center">
                    <label for="kilometros" class="form-label mb-0 me-3 text-nowrap">Kilómetros:</label>
                    <input type="number" id="kilometros" v-model="vehiculo.kilometros"
                        class="form-control rounded-0 shadow-none border text-end" required />
                </div>

                <div class="col-12 col-md-2 d-flex align-items-center">
                    <label for="precio" class="form-label mb-0 me-3 text-nowrap">Precio (€):</label>
                    <input type="number" id="precio" v-model="vehiculo.precio"
                        class="form-control rounded-0 shadow-none border text-end" required />
                </div>

                <div class="col-12 col-md-2 d-flex align-items-center">
                    <label for="combustible" class="form-label mb-0 me-3 text-nowrap">Combustible:</label>
                    <select id="combustible" v-model="vehiculo.combustible"
                        class="form-select rounded-0 shadow-none border">
                        <option disabled value="">Seleccione</option>
                        <option>Gasolina</option>
                        <option>Diésel</option>
                        <option>Híbrido</option>
                        <option>GLP</option>
                        <option>Eléctrico</option>
                    </select>
                </div>

                <div class="col-12 col-md-3 d-flex align-items-center">
                    <label class="form-label mb-0 me-3 text-nowrap">Transmisión:</label>
                    <div class="d-flex align-items-center">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="transmision-manual" value="coche"
                                v-model="vehiculo.transmision" />
                            <label class="form-check-label" for="transmision-manual">Manual</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="transmision-automatica" value="automatica"
                                v-model="vehiculo.transmision" />
                            <label class="form-check-label" for="transmision-automatica">Automática</label>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-2 d-flex align-items-center">
                    <label for="potencia" class="form-label mb-0 me-3 text-nowrap">Potencia (CV):</label>
                    <input type="number" id="potencia" v-model="vehiculo.potencia_cv"
                        class="form-control rounded-0 shadow-none border text-end" />
                </div>
            </div>
            <!-- FILA: Descripción -->
            <div class="col g-2 mt-3">
                <label for="descripcion" class="form-label">Descripción:</label>
                <textarea id="descripcion" v-model="vehiculo.descripcion" rows="3"
                    class="form-control rounded shadow-none border mb-2"
                    placeholder="Describe el estado, revisiones, etc.">
          </textarea>
            </div>

            <!-- FILA: Imagen del vehículo-->
            <div class="row g-3 align-items-center mb-3">
                <div class="col-12 col-md-3 d-flex align-items-center">
                    <label for="foto" class="form-label mb-0 me-2 text-nowrap">Imagen del Vehículo:</label>
                    <input type="file" id="foto" accept="image/*" @change="onFileChange"
                        class="form-control-file col-md-10 border rounded-0 shadow-none btn-file-azul" />
                </div>
            </div>

            <h6 class="text-center fw-semibold bg-primary-subtle py-1 rounded">
                <i class="bi bi-person me-2"></i>Cliente Ubicación
            </h6>
            <!-- FILA: Ubicación -->
            <div class="row g-3 align-items-center mt-3">
                <div class="col-12 col-md-4">
                    <label for="provincia" class="form-label">Provincia:</label>
                    <select id="provincia" v-model="vehiculo.ubicacion.provincia"
                        class="form-select rounded shadow-none border" @change="filtrarCiudades">
                        <option disabled value="">Seleccione provincia</option>
                        <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">{{ prov.nm }}</option>
                    </select>
                </div>

                <div class="col-12 col-md-4">
                    <label for="ciudad" class="form-label">Ciudad:</label>
                    <select id="ciudad" v-model="vehiculo.ubicacion.ciudad"
                        class="form-select rounded shadow-none border">
                        <option disabled value="">Seleccione ciudad</option>
                        <option v-for="mun in municipiosFiltrados" :key="mun.id" :value="mun.nm">{{ mun.nm }}</option>
                    </select>
                </div>

                <div class="col-12 col-md-4">
                    <label for="fecha_publicacion" class="form-label">Fecha Publicación:</label>
                    <input type="date" id="fecha_publicacion" v-model="vehiculo.fecha_publicacion"
                        class="form-control rounded shadow-none border" />
                </div>
            </div>

            <!-- FILA: Contacto -->
            <div class="row g-3 align-items-center mt-3">
                <div class="col-12 col-md-4">
                    <label for="contacto_nombre" class="form-label">Nombre Contacto:</label>
                    <input type="text" id="contacto_nombre" v-model="vehiculo.contacto.nombre"
                        @blur="capitalizarContacto('nombre')" class="form-control rounded shadow-none border" />
                </div>
                <div class="col-12 col-md-4">
                    <label for="contacto_telefono" class="form-label">Teléfono:</label>
                    <input type="tel" id="contacto_telefono" v-model="vehiculo.contacto.telefono"
                        @blur="validarTelefono" class="form-control rounded shadow-none border text-center"
                        :class="{ 'is-invalid': !telefonoValido }" />
                    <div v-if="!telefonoValido" class="invalid-feedback">
                        Teléfono inválido (debe empezar por 6 o 7 y tener 9 dígitos).
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <label for="contacto_email" class="form-label">Email:</label>
                    <input type="email" id="contacto_email" v-model="vehiculo.contacto.email" @blur="validarEmail"
                        class="form-control rounded shadow-none border" :class="{ 'is-invalid': !emailValido }" />
                    <div v-if="!emailValido" class="invalid-feedback">
                        Email inválido.
                    </div>
                </div>
            </div>

            <!-- FILA: Estado y botón -->
            <div class="d-flex align-items-center justify-content-between mt-3">
                <div>
                    <label class="form-label me-2">Estado:</label>
                    <select v-model="vehiculo.estado"
                        class="form-select d-inline-block w-auto rounded shadow-none border">
                        <option value="disponible">Disponible</option>
                        <option value="vendido">Vendido</option>
                        <option value="reservado">Reservado</option>
                    </select>
                </div>

                <div>
                    <button class="btn btn-primary rounded border shadow-none px-4" type="submit">{{ editando ?
                        "Modificar" : "Guardar" }}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import Swal from "sweetalert2"
import { ref, computed } from "vue"
import { addArticulo } from "@/api/articulos.js"
import provmuniData from "@/data/provmuni.json"

const vehiculo = ref({
    tipo: "",
    matricula: "",
    marca: "",
    modelo: "",
    anio: "",
    estado: "",
    kilometros: "",
    precio: "",
    combustible: "",
    transmision: "",
    potencia_cv: "",
    descripcion: "",
    ubicacion: {
        provincia: "",
        ciudad: ""
    },
    contacto: {
        nombre: "",
        telefono: "",
        email: ""
    },
    fecha_publicacion: "",
    estado: "disponible"
})

const editando = ref(false);

// Cargar provincias y municipios desde JSON
const provincias = ref(provmuniData.provincias);
const municipios = ref(provmuniData.municipios);
const municipiosFiltrados = ref([]);

// Filtrar municipios según provincia seleccionada
const filtrarCiudades = () => {
    const nombreProv = vehiculo.value.ubicacion.provincia;
    const prov = provincias.value.find((p) => p.nm === nombreProv);
    if (!prov) {
        municipiosFiltrados.value = [];
        return;
    }
    const codigoProv = prov.id.slice(0, 2);
    municipiosFiltrados.value = municipios.value.filter((m) =>
        m.id.startsWith(codigoProv)
    );
    vehiculo.value.ubicacion.ciudad = "";
};

const capitalizarTexto = (campo) => {
    const texto = vehiculo.value[campo] ?? "";
    if (texto.trim() === "") return;
    vehiculo.value[campo] = texto
        .toLowerCase()
        .split(" ")
        .map((palabra) => {
            if (!palabra) return "";
            return palabra.charAt(0).toUpperCase() + palabra.slice(1);
        })
        .join(" ");
};

const capitalizarContacto = (campo) => {
    const texto = vehiculo.value.contacto[campo] ?? "";
    if (texto.trim() === "") return;
    vehiculo.value.contacto[campo] = texto
        .toLowerCase()
        .split(" ")
        .map((palabra) => {
            if (!palabra) return "";
            return palabra.charAt(0).toUpperCase() + palabra.slice(1);
        })
        .join(" ");
};

// Validar teléfono
const telefonoValido = ref(true);
const telefonoRegex = /^[67]\d{8}$/;

const validarTelefono = () => {
    const telefono = vehiculo.value.contacto.telefono.trim();

    if (telefono === "") {
        telefonoValido.value = true; // Vacío = válido (opcional)
        return true;
    }

    if (telefono.charAt(0) === "6" || telefono.charAt(0) === "7") {
        telefonoValido.value = telefonoRegex.test(telefono);
        return telefonoValido.value;
    } else {
        telefonoValido.value = false;
        return false;
    }
};

// Validar email
const emailValido = ref(true);
const validarEmail = () => {
    const email = vehiculo.value.contacto.email.trim();
    if (email === "") {
        emailValido.value = true; // Vacío = válido (opcional)
        return true;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    emailValido.value = regex.test(email);
};

// Enviar datos al backend
const guardarVehiculo = async () => {
    // Validar campos obligatorios
    if (!vehiculo.value.tipo) {
        Swal.fire({
            icon: 'error',
            title: 'Campo obligatorio',
            text: 'Debe seleccionar el tipo de vehículo.',
            showConfirmButton: true
        });
        return;
    }

    if (!vehiculo.value.marca || !vehiculo.value.modelo || !vehiculo.value.anio) {
        Swal.fire({
            icon: 'error',
            title: 'Campos obligatorios',
            text: 'Marca, modelo y año son campos obligatorios.',
            showConfirmButton: true
        });
        return;
    }

    if (!vehiculo.value.kilometros || !vehiculo.value.precio) {
        Swal.fire({
            icon: 'error',
            title: 'Campos obligatorios',
            text: 'Kilómetros y precio son campos obligatorios.',
            showConfirmButton: true
        });
        return;
    }

    if (!vehiculo.value.combustible) {
        Swal.fire({
            icon: 'error',
            title: 'Campo obligatorio',
            text: 'Debe seleccionar el tipo de combustible.',
            showConfirmButton: true
        });
        return;
    }

    if (!vehiculo.value.transmision) {
        Swal.fire({
            icon: 'error',
            title: 'Campo obligatorio',
            text: 'Debe seleccionar el tipo de transmisión.',
            showConfirmButton: true
        });
        return;
    }

    if (!vehiculo.value.ubicacion.provincia || !vehiculo.value.ubicacion.ciudad) {
        Swal.fire({
            icon: 'error',
            title: 'Campos obligatorios',
            text: 'Provincia y ciudad son campos obligatorios.',
            showConfirmButton: true
        });
        return;
    }

    if (!vehiculo.value.contacto.nombre || !vehiculo.value.contacto.telefono || !vehiculo.value.contacto.email) {
        Swal.fire({
            icon: 'error',
            title: 'Datos de contacto incompletos',
            text: 'Nombre, teléfono y email de contacto son obligatorios.',
            showConfirmButton: true
        });
        return;
    }

    // Validar teléfono antes de guardar
    if (!telefonoValido.value) {
        Swal.fire({
            icon: 'error',
            title: 'Teléfono inválido',
            text: 'El teléfono debe empezar por 6 o 7 y tener 9 dígitos.',
            showConfirmButton: true
        });
        return;
    }

    // Validar email antes de guardar
    if (!emailValido.value) {
        Swal.fire({
            icon: 'error',
            title: 'Email inválido',
            text: 'Por favor, introduce un email válido.',
            showConfirmButton: true
        });
        return;
    }

    try {

        const formData = new FormData();

        if (archivo.value) {
            formData.append('imagen', archivo.value);
        }

        formData.append('vehiculo', JSON.stringify(vehiculo.value));

        const nuevo = await addArticulo(formData);

        if (nuevo && nuevo._id) {
            Swal.fire({
                icon: "success",
                title: "Vehículo guardado",
                text: "El vehículo ha sido guardado correctamente.",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            console.error("Error al guardar el vehículo");
        }
        Object.assign(vehiculo.value, {
            tipo: "",
            matricula: "",
            marca: "",
            modelo: "",
            anio: "",
            estado: "disponible",
            kilometros: "",
            precio: "",
            combustible: "",
            transmision: "",
            potencia_cv: "",
            descripcion: "",
            ubicacion: {
                provincia: "",
                ciudad: ""
            },
            contacto: {
                nombre: "",
                telefono: "",
                email: ""
            },
            fecha_publicacion: ""
        });
        archivo.value = null;
        // Limpiar el input de archivo
        const inputFoto = document.getElementById('foto');
        if (inputFoto) {
            inputFoto.value = '';
        }

    } catch (error) {
        console.error("Error al guardar:", error);
    }
};

const archivo = ref(null);

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        archivo.value = file;
    }
};
</script>