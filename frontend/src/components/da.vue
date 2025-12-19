<template>
    <div class="container-fluid my-2 p-3 border rounded-4 shadow-lg bg-white">
      <form @submit.prevent="guardarVehiculo" class="mb-2">
        <!-- SECCIÓN: REGISTRO DE VEHÍCULOS -->
        <h6
          class="text-center fw-semibold bg-primary text-white py-1 rounded mb-2 mt-1"
        >
          <i class="bi bi-car-front me-2"></i>Registro de Vehículos
        </h6>
        <!-- FILA: Tipo, Marca, Modelo, Año y Estado -->
        <div class="row g-1 align-items-center">
          <div class="col d-flex align-items-center">
            <label class="form-label mb-0 me-1 text-nowrap small">Tipo:</label>
            <div class="form-check form-check-inline mb-0">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-coche"
                value="coche"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label small" for="tipo-coche">Coche</label>
            </div>
            <div class="form-check form-check-inline mb-0">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-furgoneta"
                value="furgoneta"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label small" for="tipo-furgoneta"
                >Furgoneta</label
              >
            </div>
            <div class="form-check form-check-inline mb-0">
              <input
                class="form-check-input"
                type="radio"
                id="tipo-moto"
                value="moto"
                v-model="vehiculo.tipo"
              />
              <label class="form-check-label small" for="tipo-moto">Moto</label>
            </div>
          </div>
  
          <div class="col d-flex align-items-center ms-5">
            <label for="marca" class="form-label mb-0 me-1 text-nowrap small"
              >Marca:</label
            >
            <input
              type="text"
              id="marca"
              v-model="vehiculo.marca"
              @blur="capitalizarTexto('marca')"
              class="form-control form-control-sm rounded-0 shadow-none border"
              required
            />
          </div>
  
          <div class="col d-flex align-items-center ms-5">
            <label for="modelo" class="form-label mb-0 me-1 text-nowrap small"
              >Modelo:</label
            >
            <input
              type="text"
              id="modelo"
              v-model="vehiculo.modelo"
              @blur="capitalizarTexto('modelo')"
              class="form-control form-control-sm rounded-0 shadow-none border"
              required
            />
          </div>
  
          <div class="col d-flex align-items-center ms-5">
            <label for="matricula" class="form-label mb-0 me-1 text-nowrap small"
              >Matrícula:</label
            >
            <input
              type="text"
              id="matricula"
              v-model="vehiculo.matricula"
              @blur="convertirMatriculaMayusculas"
              class="form-control form-control-sm rounded-0 shadow-none border"
            />
          </div>
  
          <div class="col d-flex align-items-center ms-5">
            <label for="anio" class="form-label mb-0 me-1 text-nowrap small"
              >Año:</label
            >
            <select
              id="anio"
              v-model="vehiculo.anio"
              class="form-select form-select-sm d-inline-block w-auto rounded shadow-none border"
              required
            >
              <option disabled value="">Seleccione año</option>
              <option v-for="year in generarAños" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
  
          <div class="col-auto d-flex align-items-center">
            <label class="form-label mb-0 me-1 small">Estado:</label>
            <select
              v-model="vehiculo.estado"
              class="form-select form-select-sm d-inline-block w-auto rounded shadow-none border"
            >
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
              <option value="reservado">Reservado</option>
            </select>
          </div>
        </div>
  
        <!-- FILA: Año, Kilómetros, Precio -->
        <div class="row g-2 align-items-center mt-1">
          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="kilometros" class="form-label mb-0 me-3 text-nowrap"
              >Kilómetros:</label
            >
            <input
              type="number"
              id="kilometros"
              v-model="vehiculo.kilometros"
              class="form-control rounded-0 shadow-none border text-end"
              required
            />
          </div>
  
          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="precio" class="form-label mb-0 me-3 text-nowrap"
              >Precio (€):</label
            >
            <input
              type="number"
              id="precio"
              v-model="vehiculo.precio"
              class="form-control rounded-0 shadow-none border text-end"
              required
            />
          </div>
  
          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="combustible" class="form-label mb-0 me-3 text-nowrap"
              >Combustible:</label
            >
            <select
              id="combustible"
              v-model="vehiculo.combustible"
              class="form-select rounded-0 shadow-none border"
            >
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
                <input
                  class="form-check-input"
                  type="radio"
                  id="transmision-manual"
                  value="coche"
                  v-model="vehiculo.transmision"
                />
                <label class="form-check-label" for="transmision-manual"
                  >Manual</label
                >
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  id="transmision-automatica"
                  value="automatica"
                  v-model="vehiculo.transmision"
                />
                <label class="form-check-label" for="transmision-automatica"
                  >Automática</label
                >
              </div>
            </div>
          </div>
  
          <div class="col-12 col-md-2 d-flex align-items-center">
            <label for="potencia" class="form-label mb-0 me-3 text-nowrap"
              >Potencia (CV):</label
            >
            <input
              type="number"
              id="potencia"
              v-model="vehiculo.potencia_cv"
              class="form-control rounded-0 shadow-none border text-end"
            />
          </div>
        </div>
        <!-- FILA: Descripción -->
        <div class="col g-2 mt-1">
          <label for="descripcion" class="form-label mb-1">Descripción:</label>
          <textarea
            id="descripcion"
            v-model="vehiculo.descripcion"
            rows="2"
            class="form-control rounded shadow-none border"
            placeholder="Describe el estado, revisiones, etc."
          >
          </textarea>
        </div>
  
        <!-- FILA: Imagen del vehículo-->
        <div class="row g-2 align-items-center mt-1 mb-1">
          <div class="col-12 col-md-3 d-flex align-items-center">
            <label for="foto" class="form-label mb-0 me-2 text-nowrap"
              >Imagen del Vehículo:</label
            >
            <input
              type="file"
              id="foto"
              accept="image/*"
              @change="onFileChange"
              class="form-control-file col-md-10 border rounded-0 shadow-none btn-file-azul"
            />
          </div>
        </div>
  
        <!-- SECCIÓN: CLIENTE Y UBICACIÓN -->
        <h6
          class="text-center fw-semibold bg-primary text-white py-1 rounded mb-2 mt-2"
        >
          <i class="bi bi-geo-alt-fill me-2"></i>Cliente y Ubicación
        </h6>
        <!-- FILA: Ubicación -->
        <div class="row g-2 align-items-center">
          <div class="col-12 col-md-4">
            <label for="provincia" class="form-label">Provincia:</label>
            <select
              id="provincia"
              v-model="vehiculo.ubicacion.provincia"
              class="form-select rounded shadow-none border"
              @change="filtrarCiudades"
            >
              <option disabled value="">Seleccione provincia</option>
              <option v-for="prov in provincias" :key="prov.id" :value="prov.nm">
                {{ prov.nm }}
              </option>
            </select>
          </div>
  
          <div class="col-12 col-md-4">
            <label for="ciudad" class="form-label">Ciudad:</label>
            <select
              id="ciudad"
              v-model="vehiculo.ubicacion.ciudad"
              class="form-select rounded shadow-none border"
            >
              <option disabled value="">Seleccione ciudad</option>
              <option
                v-for="mun in municipiosFiltrados"
                :key="mun.id"
                :value="mun.nm"
              >
                {{ mun.nm }}
              </option>
            </select>
          </div>
  
          <div class="col-12 col-md-4">
            <label for="fecha_publicacion" class="form-label"
              >Fecha Publicación:</label
            >
            <input
              type="date"
              id="fecha_publicacion"
              v-model="vehiculo.fecha_publicacion"
              class="form-control rounded shadow-none border"
            />
          </div>
        </div>
  
        <!-- FILA: Contacto -->
        <div class="row g-2 align-items-center mt-1">
          <div class="col-12 col-md-4">
            <label for="contacto_nombre" class="form-label"
              >Nombre Contacto:</label
            >
            <input
              type="text"
              id="contacto_nombre"
              v-model="vehiculo.contacto.nombre"
              @blur="capitalizarContacto('nombre')"
              class="form-control rounded shadow-none border"
            />
          </div>
          <div class="col-12 col-md-4">
            <label for="contacto_telefono" class="form-label">Teléfono:</label>
            <input
              type="tel"
              id="contacto_telefono"
              v-model="vehiculo.contacto.telefono"
              @blur="validarTelefono"
              class="form-control rounded shadow-none border text-center"
              :class="{ 'is-invalid': !telefonoValido }"
            />
            <div v-if="!telefonoValido" class="invalid-feedback">
              Teléfono inválido (debe empezar por 6 o 7 y tener 9 dígitos).
            </div>
          </div>
          <div class="col-12 col-md-4">
            <label for="contacto_email" class="form-label">Email:</label>
            <input
              type="email"
              id="contacto_email"
              v-model="vehiculo.contacto.email"
              @blur="validarEmail"
              class="form-control rounded shadow-none border"
              :class="{ 'is-invalid': !emailValido }"
            />
            <div v-if="!emailValido" class="invalid-feedback">
              Email inválido.
            </div>
          </div>
        </div>
  
        <!-- BOTONES DE ACCIÓN -->
        <div class="d-flex justify-content-center gap-2 mt-2">
          <button
            class="btn btn-success btn-sm rounded shadow px-3"
            type="submit"
            v-if="!editando"
          >
            <i class="bi bi-save me-1"></i>Guardar
          </button>
          <button
            class="btn btn-primary btn-sm rounded shadow px-3"
            type="submit"
            v-if="editando"
          >
            <i class="bi bi-pencil-square me-1"></i>Modificar
          </button>
          <button
            class="btn btn-danger btn-sm rounded shadow px-3"
            type="button"
            v-if="editando"
            @click="eliminarVehiculo"
          >
            <i class="bi bi-trash me-1"></i>Eliminar
          </button>
          <button
            class="btn btn-danger btn-sm rounded shadow px-3"
            type="button"
            @click="limpiarFormulario"
          >
            <i class="bi bi-x-circle me-1"></i>Cancelar
          </button>
          <button
            type="button"
            @click="imprimirPDF"
            class="btn btn-secondary btn-sm rounded shadow px-3"
          >
            <i class="bi bi-printer"></i> Imprimir
          </button>
        </div>
      </form>
  
      <!-- TABLA DE VEHÍCULOS -->
      <div class="table-responsive mt-2">
        <h6
          class="text-center fw-semibold bg-secondary text-white py-1 rounded mb-2"
        >
          <i class="bi bi-list-ul me-2"></i>Listado de Vehículos
        </h6>
        <table class="table table-sm table-bordered table-hover align-middle">
          <thead class="table-primary text-center">
            <tr>
              <th>Matrícula</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Estado</th>
              <th>Contacto</th>
              <th style="width: 80px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, index) in vehiculos" :key="index">
              <td class="text-center fw-bold">{{ v.matricula }}</td>
              <td>{{ v.marca }}</td>
              <td>{{ v.modelo }}</td>
              <td class="text-center">
                <span
                  class="badge"
                  :class="{
                    'bg-success': v.estado === 'disponible',
                    'bg-danger': v.estado === 'vendido',
                    'bg-warning': v.estado === 'reservado',
                  }"
                >
                  {{ v.estado }}
                </span>
              </td>
              <td class="small">
                <strong>{{ v.contacto.nombre }}</strong> |
                <i class="bi bi-telephone me-1"></i>{{ v.contacto.telefono }}
              </td>
              <td class="text-center">
                <button
                  @click="cargarVehiculo(v)"
                  class="btn btn-warning btn-sm shadow-none py-0"
                  title="Editar vehículo"
                >
                  <i class="bi bi-pencil"></i>
                </button>
              </td>
            </tr>
            <tr v-if="vehiculos.length === 0">
              <td colspan="6" class="text-center text-muted">
                No hay vehículos registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import Swal from "sweetalert2";
  import { ref, computed, onMounted } from "vue";
  import {
    addArticulo,
    getArticulos,
    updateArticulo,
    deleteArticulo,
  } from "@/api/articulos.js";
  import provmuniData from "@/data/provmuni.json";
  import { jsPDF } from "jspdf";
  import "jspdf-autotable";
  
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
      ciudad: "",
    },
    contacto: {
      nombre: "",
      telefono: "",
      email: "",
    },
    fecha_publicacion: "",
    estado: "disponible",
  });
  
  const vehiculos = ref([]);
  const editando = ref(false);
  const vehiculoIdActual = ref(null);
  
  // Cargar vehículos al montar el componente
  onMounted(async () => {
    await cargarVehiculos();
  });
  
  const cargarVehiculos = async () => {
    try {
      const data = await getArticulos();
      vehiculos.value = data || [];
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los vehículos.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  
  const limpiarFormulario = () => {
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
        ciudad: "",
      },
      contacto: {
        nombre: "",
        telefono: "",
        email: "",
      },
      fecha_publicacion: "",
    });
    archivo.value = null;
    editando.value = false;
    vehiculoIdActual.value = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const cargarVehiculo = (v) => {
    Object.assign(vehiculo.value, {
      tipo: v.tipo || "",
      matricula: v.matricula || "",
      marca: v.marca || "",
      modelo: v.modelo || "",
      anio: v.anio || "",
      estado: v.estado || "disponible",
      kilometros: v.kilometros || "",
      precio: v.precio || "",
      combustible: v.combustible || "",
      transmision: v.transmision || "",
      potencia_cv: v.potencia_cv || "",
      descripcion: v.descripcion || "",
      ubicacion: {
        provincia: v.ubicacion?.provincia || "",
        ciudad: v.ubicacion?.ciudad || "",
      },
      contacto: {
        nombre: v.contacto?.nombre || "",
        telefono: v.contacto?.telefono || "",
        email: v.contacto?.email || "",
      },
      fecha_publicacion: v.fecha_publicacion || "",
    });
    editando.value = true;
    vehiculoIdActual.value = v._id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const eliminarVehiculo = async () => {
    if (!vehiculoIdActual.value) return;
  
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      try {
        await deleteArticulo(vehiculoIdActual.value);
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El vehículo ha sido eliminado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
        limpiarFormulario();
        await cargarVehiculos();
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el vehículo.",
          showConfirmButton: true,
        });
      }
    }
  };
  
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
  
  // Convertir matrícula a mayúsculas al salir del campo
  const convertirMatriculaMayusculas = () => {
    const m = vehiculo.value.matricula ?? "";
    if (m.trim() === "") return;
    vehiculo.value.matricula = m.toUpperCase();
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
        icon: "error",
        title: "Campo obligatorio",
        text: "Debe seleccionar el tipo de vehículo.",
        showConfirmButton: true,
      });
      return;
    }
  
    if (!vehiculo.value.marca || !vehiculo.value.modelo || !vehiculo.value.anio) {
      Swal.fire({
        icon: "error",
        title: "Campos obligatorios",
        text: "Marca, modelo y año son campos obligatorios.",
        showConfirmButton: true,
      });
      return;
    }
  
    if (!vehiculo.value.kilometros || !vehiculo.value.precio) {
      Swal.fire({
        icon: "error",
        title: "Campos obligatorios",
        text: "Kilómetros y precio son campos obligatorios.",
        showConfirmButton: true,
      });
      return;
    }
  
    if (!vehiculo.value.combustible) {
      Swal.fire({
        icon: "error",
        title: "Campo obligatorio",
        text: "Debe seleccionar el tipo de combustible.",
        showConfirmButton: true,
      });
      return;
    }
  
    if (!vehiculo.value.transmision) {
      Swal.fire({
        icon: "error",
        title: "Campo obligatorio",
        text: "Debe seleccionar el tipo de transmisión.",
        showConfirmButton: true,
      });
      return;
    }
  
    if (!vehiculo.value.ubicacion.provincia || !vehiculo.value.ubicacion.ciudad) {
      Swal.fire({
        icon: "error",
        title: "Campos obligatorios",
        text: "Provincia y ciudad son campos obligatorios.",
        showConfirmButton: true,
      });
      return;
    }
  
    if (
      !vehiculo.value.contacto.nombre ||
      !vehiculo.value.contacto.telefono ||
      !vehiculo.value.contacto.email
    ) {
      Swal.fire({
        icon: "error",
        title: "Datos de contacto incompletos",
        text: "Nombre, teléfono y email de contacto son obligatorios.",
        showConfirmButton: true,
      });
      return;
    }
  
    // Validar teléfono antes de guardar
    if (!telefonoValido.value) {
      Swal.fire({
        icon: "error",
        title: "Teléfono inválido",
        text: "El teléfono debe empezar por 6 o 7 y tener 9 dígitos.",
        showConfirmButton: true,
      });
      return;
    }
  
    // Validar email antes de guardar
    if (!emailValido.value) {
      Swal.fire({
        icon: "error",
        title: "Email inválido",
        text: "Por favor, introduce un email válido.",
        showConfirmButton: true,
      });
      return;
    }
  
    try {
      const formData = new FormData();
  
      if (archivo.value) {
        formData.append("imagen", archivo.value);
      }
  
      formData.append("vehiculo", JSON.stringify(vehiculo.value));
  
      if (editando.value && vehiculoIdActual.value) {
        // Actualizar vehículo existente
        await updateArticulo(vehiculoIdActual.value, formData);
        Swal.fire({
          icon: "success",
          title: "Vehículo actualizado",
          text: "El vehículo ha sido actualizado correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Crear nuevo vehículo
        const nuevo = await addArticulo(formData);
        if (nuevo && nuevo._id) {
          Swal.fire({
            icon: "success",
            title: "Vehículo guardado",
            text: "El vehículo ha sido guardado correctamente.",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          console.error("Error al guardar el vehículo");
        }
      }
  
      limpiarFormulario();
      await cargarVehiculos();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el vehículo.",
        showConfirmButton: true,
      });
    }
  };
  
  const archivo = ref(null);
  
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      archivo.value = file;
    }
  };
  
  // Generar años desde el actual hasta 50 años atrás
  const generarAños = computed(() => {
    const añoActual = new Date().getFullYear();
    const años = [];
    for (let i = 0; i <= 50; i++) {
      años.push(añoActual - i);
    }
    return años;
  });
  
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
      ["Matrícula", "Marca", "Modelo", "Estado", "Combustible", "Precio"],
    ];
  
    // Definir las filas de la tabla
    const body = vehiculos.value.map((v) => [
      v.matricula,
      v.marca,
      v.modelo,
      v.estado,
      v.combustible,
      v.precio + " €",
    ]);
  
    // Generar la tabla con estilos mejorados
    doc.autoTable({
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
  
    // Guardar el PDF
    doc.save(`listado_vehiculos_${ahora.toISOString().split("T")[0]}.pdf`);
  };
  </script>
  