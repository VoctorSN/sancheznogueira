
  <template>
  <div class="d-flex flex-column justify-content-center align-items-center vh-75 mt-5">
    <!-- Título -->
    <div class="text-center mb-4">
      <h5 class="fw-bold text-uppercase text-primary position-relative d-inline-block">
        <i class="bi bi-people-fill me-2 fs-3"></i> <!-- Icono decorativo con tamaño -->
        Iniciar sesión
        <span class="underline-effect"></span> <!-- Línea decorativa -->
      </h5>
    </div>

    <!-- Formulario -->
    <div class="border p-4 shadow-sm rounded w-100" style="max-width: 400px;">
      <form @submit.prevent="iniciarSesion">
        <!-- Campo DNI -->
        <div class="mb-3">
          <label for="dni" class="form-label fw-bold">DNI:</label>
          <input
            type="text"
            id="dni"
            class="form-control text-center"
            v-model="dni"
            required
          />
        </div>

        <!-- Campo Contraseña -->
        <div class="mb-3">
          <label for="pass" class="form-label fw-bold">Contraseña:</label>
          <input
            type="password"
            id="pass"
            class="form-control"
            v-model="pass"
            required
          />
        </div>

        <!-- Botón de login -->
        <div class="text-center">
          <button type="submit" class="btn btn-primary w-50">Iniciar sesión</button>
        </div>
      </form>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

  <script>
  /*
  import Swal from 'sweetalert2';
  import passport from  '../config/passport.mjs';
  
  export default {
    name: "TablaLogin",
    components: {
      
    },
    data() {
      return {
        dni: "",
        pass: "",
        errorMessage: "",
        usuarios: [] // Aquí se almacenarán los usuarios cargados desde el archivo JSON
      };
    },

    mounted() {
      // Cargar los usuarios desde el archivo datos.json al montar el componente
      console.log(this.$router.options.routes);

    },
  
    created() {
      // Cargar los usuarios desde el archivo datos.json al crear el componente
      this.getUsuarios();
    },

    methods: {

        async getUsuarios() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }

                // Obtener y ordenar usuarios por apellidos y luego por nombre
                this.usuarios = (await response.json()).sort((a, b) =>
                    a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre)
                );

                } catch (error) {
                    console.error(error);
                }
            },

        async iniciarSesion() {
            // Buscar el usuario con el DNI proporcionado
            const usuario = this.usuarios.find((user) => user.dni === this.dni);
    
            // Verificar si el usuario existe
            if (usuario) {
            // Verificar la contraseña usando passport para compararla con la encriptada
            const contrasenaCorrecta = await passport.verificarContrasena(
                this.pass,
                usuario.pass
            );
  
          if (contrasenaCorrecta) {
            // Guardar datos en Vuex al iniciar sesión
            this.$store.dispatch("login", usuario);
            if (usuario.tipo === "admin" || usuario.tipo === "usuario") {
              this.errorMessage = ""; // Limpiar mensaje de error si las credenciales son correctas
              this.mostrarAlerta("Bienvenido", "Sesión Iniciada", "success")
              localStorage.setItem('isLogueado', 'true')
              localStorage.setItem('userName', usuario.nombre)
              if (usuario.tipo === "admin") {
                localStorage.setItem('isAdmin', 'true')
                this.$router.push({ name: 'inicio' }).then(() => {
                window.location.reload();  // Recargar la página
              });
              } else {
                localStorage.setItem('isUsuario', 'true')
                this.$router.push({ name: 'inicio' }).then(() => {
                window.location.reload();  // Recargar la página
              });
              }
            
              // Redirigir o hacer algo después del inicio de sesión
            } else {
              this.errorMessage = "DNI y/o contraseña incorrectos 1.";
            }
            // Redirigir o hacer algo después del inicio de sesión
          } else {
            this.errorMessage = "DNI y/o contraseña incorrectos 2.";
          }
        } else {
          this.errorMessage = "DNI y/o contraseña incorrectos. 3";
        }
      },
           // Método para mostrar alertas
    mostrarAlerta(titulo, mensaje, icono) {
        Swal.fire({
          title: titulo,
          text: mensaje,
          icon: icono,
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            container: 'custom-alert-container',
            popup: 'custom-alert-popup',
            modal: 'custom-alert-modal'
          }
        });
      }
    }
  }; */
  </script>
  
  <style>
  /* Ajustes adicionales si Bootstrap no cubre todo */
  .form-label {
    background-color: transparent !important;
    margin-bottom: 0.5rem;
  }
  </style>
  