document.addEventListener('DOMContentLoaded', () => {
  const modalCrear = document.getElementById('modalCrear');
  const modalEditar = document.getElementById('modalEditar');
  const modalEliminar = document.getElementById('modalEliminar');

  const abrirModalCrear = document.getElementById('abrirModalCrear');
  const cerrarModalCrear = document.getElementById('cerrarModalCrear');

  const formCrearEmpleado = document.getElementById('formCrearEmpleado');
  const formEditar = document.getElementById('formEditar');
  const confirmarEliminar = document.getElementById('confirmarEliminar');
  const cancelarEliminar = document.getElementById('cancelarEliminar');

  let empleadoEditando = null;
  let empleadoAEliminar = null;

  // Abrir modal crear
  abrirModalCrear.addEventListener('click', e => {
    e.preventDefault();
    modalCrear.style.display = 'flex';
  });

  // Cerrar modal crear
  cerrarModalCrear.addEventListener('click', () => {
    modalCrear.style.display = 'none';
  });
  // Crear nuevo empleado
  formCrearEmpleado.addEventListener('submit', async e => {
    e.preventDefault();

    // Obtener valores del formulario
    const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
    const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const idRol = parseInt(document.getElementById('rolUsuario').value); // Asegúrate que este select exista

    // Validar campos (puedes agregar más validaciones si quieres)
    if (!nombreCompleto || !nombreUsuario || !contrasena || !idRol) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      // Enviar petición al backend
      const response = await fetch('http://localhost:4000/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre_completo_usuario: nombreCompleto,
          nombre_usuario: nombreUsuario,
          contrasena: contrasena,
          id_roles: idRol
        })
      });

      const data = await response.json();

      // Verificar si el registro fue exitoso
      if (data.success) {
        // Crear el nuevo bloque visual en el frontend
        const nuevo = document.createElement('div');
        nuevo.classList.add('empleados');
        nuevo.innerHTML = `
        <span contenteditable="true" class="nombre-empleado">${data.data.nombre}</span>
        <div class="iconos">
          <a href="#" class="abrir-editar"><ion-icon name="person-outline"></ion-icon></a>
          <a href="#" class="abrir-eliminar"><ion-icon name="trash-outline"></ion-icon></a>
        </div>
      `;
        document.querySelector('.opcionesmenu1').appendChild(nuevo);

        // Cerrar modal y limpiar formulario
        modalCrear.style.display = 'none';
        formCrearEmpleado.reset();
        asignarEventos(nuevo);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Ocurrió un error al registrar el usuario');
    }
  });

})
