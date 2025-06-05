document.addEventListener("DOMContentLoaded", () => {
  // Referencias modal y formulario
  const abrirModalCrear = document.getElementById("abrirModalCrear");
  const modalCrear = document.getElementById("modalCrear");
  const cerrarModalCrear = document.getElementById("cerrarModalCrear");
  const formUsuario = document.getElementById("formUsuario");
  const tituloModalUsuario = modalCrear.querySelector("#tituloModalUsuario");
  const botonEnviarUsuario = modalCrear.querySelector("#botonEnviarUsuario");

  // Campos y errores
  const nombreCompletoInput = document.getElementById("nombreCompleto");
  const nombreUsuarioInput = document.getElementById("nombreUsuario");
  const contrasenaInput = document.getElementById("contrasena");
  const rolUsuarioSelect = document.getElementById("rolUsuario");

  const errorNombreCompleto = document.getElementById("errorNombreCompleto");
  const errorNombreUsuario = document.getElementById("errorNombreUsuario");
  const errorContrasena = document.getElementById("errorContrasena");
  const errorRolUsuario = document.getElementById("errorRolUsuario");

  // Modal mensaje general
  const modalMensaje = document.getElementById("modalMensaje");
  const textoModalMensaje = document.getElementById("textoModalMensaje");
  const cerrarModalMensaje = document.getElementById("cerrarModalMensaje");

  function limpiarErroresCampos() {
    errorNombreCompleto.textContent = "";
    errorNombreUsuario.textContent = "";
    errorContrasena.textContent = "";
    errorRolUsuario.textContent = "";
  }

  function mostrarModalMensaje(mensaje) {
    textoModalMensaje.textContent = mensaje;
    modalMensaje.classList.remove("oculto");
  }

  cerrarModalMensaje.addEventListener("click", () => {
    modalMensaje.classList.add("oculto");
  });

  modalMensaje.addEventListener("click", (e) => {
    if (e.target === modalMensaje) {
      modalMensaje.classList.add("oculto");
    }
  });

  // Abrir modal crear usuario
  abrirModalCrear.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Abrir modal click detectado");
    limpiarErroresCampos();
    formUsuario.reset();
    formUsuario.dataset.id = "";
    tituloModalUsuario.textContent = "Crear Usuario";
    botonEnviarUsuario.textContent = "Crear usuario";
    modalCrear.classList.remove("oculto");
  });

  // Cerrar modal crear/editar
  cerrarModalCrear.addEventListener("click", () => {
    modalCrear.classList.add("oculto");
  });

  // Cargar usuarios y mostrar lista
  async function cargarUsuarios() {
    try {
      const response = await fetch("http://localhost:4000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const contenedor = document.querySelector(".opcionesmenu1");
        contenedor.innerHTML = "";

        data.data.forEach((usuario) => {
          const empleado = document.createElement("div");
          empleado.classList.add("empleados");
          empleado.innerHTML = `
            <span contenteditable="false" class="nombre-empleado">${usuario.nombre_completo_usuario}</span>
            <div class="iconos">
              <a href="#" class="abrir-editar" data-id="${usuario.id_usuario}">
                <ion-icon name="person-outline"></ion-icon>
              </a>
              <a href="#" class="abrir-eliminar" data-id="${usuario.id_usuario}">
                <ion-icon name="trash-outline"></ion-icon>
              </a>
            </div>
          `;
          contenedor.appendChild(empleado);
          asignarEventos(empleado);
        });
      } else {
        console.error("Error al obtener usuarios:", data.message);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }

  cargarUsuarios();

  // Crear o actualizar usuario
  formUsuario.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submit formulario detectado");
    limpiarErroresCampos();

    const nombreCompleto = nombreCompletoInput.value.trim();
    const nombreUsuario = nombreUsuarioInput.value.trim();
    const contrasena = contrasenaInput.value.trim();
    const idRol = parseInt(rolUsuarioSelect.value);

    let tieneError = false;
    if (!nombreCompleto) {
      errorNombreCompleto.textContent = "El nombre completo es obligatorio";
      tieneError = true;
    }
    if (!nombreUsuario) {
      errorNombreUsuario.textContent = "El nombre de usuario es obligatorio";
      tieneError = true;
    }
    if (!contrasena && !formUsuario.dataset.id) {
      // Solo obligatorio en creación
      errorContrasena.textContent = "La contraseña es obligatoria";
      tieneError = true;
    }
    if (!idRol) {
      errorRolUsuario.textContent = "Debes seleccionar un rol";
      tieneError = true;
    }
    if (tieneError) return;

    const payload = {
      nombre_completo_usuario: nombreCompleto,
      nombre_usuario: nombreUsuario,
      id_roles: idRol,
    };
    if (contrasena) payload.contrasena = contrasena;

    try {
      let response, data;
      if (formUsuario.dataset.id) {
        // Actualizar usuario
        response = await fetch(
          `http://localhost:4000/api/usuarios/${formUsuario.dataset.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );
        data = await response.json();
      } else {
        // Crear usuario
        response = await fetch("http://localhost:4000/api/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });
        data = await response.json();
      }

      if (data.success) {
        await cargarUsuarios();
        modalCrear.classList.add("oculto");
        console.log("click abrirModalCrear");
        formUsuario.reset();
        formUsuario.dataset.id = "";
      } else {
        if (data.errores) {
          for (const campo in data.errores) {
            switch (campo) {
              case "nombre_completo_usuario":
                errorNombreCompleto.textContent = data.errores[campo];
                break;
              case "nombre_usuario":
                errorNombreUsuario.textContent = data.errores[campo];
                break;
              case "contrasena":
                errorContrasena.textContent = data.errores[campo];
                break;
              case "id_roles":
                errorRolUsuario.textContent = data.errores[campo];
                break;
              default:
                mostrarModalMensaje(data.errores[campo]);
            }
          }
        } else if (data.message) {
          mostrarModalMensaje(`Error: ${data.message}`);
        } else {
          mostrarModalMensaje("Error desconocido");
        }
      }
    } catch (error) {
      console.error("Error en la operación:", error);
      mostrarModalMensaje("Error al procesar la solicitud");
    }
  });

  // Asignar eventos editar y eliminar a cada usuario listado
  function asignarEventos(empleadoElemento) {
    const editarBtn = empleadoElemento.querySelector(".abrir-editar");
    const eliminarBtn = empleadoElemento.querySelector(".abrir-eliminar");

    // Evento editar
    editarBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      limpiarErroresCampos();

      const id = editarBtn.dataset.id;
      console.log("Click en editar usuario:", id);

      try {
        const response = await fetch(
          `http://localhost:4000/api/usuarios/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          // Abrir modal con datos cargados
          tituloModalUsuario.textContent = "Editar Usuario";
          botonEnviarUsuario.textContent = "Actualizar usuario";

          nombreCompletoInput.value = data.data.nombre_completo_usuario;
          nombreUsuarioInput.value = data.data.nombre_usuario;
          contrasenaInput.value = ""; // contraseña no se muestra
          rolUsuarioSelect.value = data.data.id_roles.toString();

          formUsuario.dataset.id = data.data.id_usuario;

          modalCrear.classList.remove("oculto");
        } else {
          mostrarModalMensaje(data.message || "No se pudo cargar usuario");
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        mostrarModalMensaje("Error al cargar usuario");
      }
    });

    // Evento eliminar
    eliminarBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const id = eliminarBtn.dataset.id;

      if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

      try {
        const response = await fetch(
          `http://localhost:4000/api/usuarios/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();

        if (data.success) {
          await cargarUsuarios();
          mostrarModalMensaje("Usuario eliminado correctamente.");
        } else {
          mostrarModalMensaje(data.message || "Error al eliminar usuario.");
        }
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        mostrarModalMensaje("Error al eliminar usuario.");
      }
    });
  }
});
