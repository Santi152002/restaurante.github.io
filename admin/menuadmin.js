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
  formCrearEmpleado.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = document.getElementById('nombreCompleto').value;

    const nuevo = document.createElement('div');
    nuevo.classList.add('empleados');
    nuevo.innerHTML = `
      <span contenteditable="true" class="nombre-empleado">${nombre}</span>
      <div class="iconos">
        <a href="#" class="abrir-editar"><ion-icon name="person-outline"></ion-icon></a>
        <a href="#" class="abrir-eliminar"><ion-icon name="trash-outline"></ion-icon></a>
      </div>
    `;

    document.querySelector('.opcionesmenu1').appendChild(nuevo);
    modalCrear.style.display = 'none';
    formCrearEmpleado.reset();
    asignarEventos(nuevo);
  });

  // Asignar eventos a todos los botones existentes
  function asignarEventos(contenedor = document) {
    contenedor.querySelectorAll('.abrir-editar').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const empleado = btn.closest('.empleados');
        empleadoEditando = empleado.querySelector('.nombre-empleado');
        document.getElementById('nombre').value = empleadoEditando.textContent;
        modalEditar.style.display = 'flex';
      });
    });

    contenedor.querySelectorAll('.abrir-eliminar').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        empleadoAEliminar = btn.closest('.empleados');
        modalEliminar.style.display = 'flex';
      });
    });
  }

  // Guardar edición
  formEditar.addEventListener('submit', e => {
    e.preventDefault();
    if (empleadoEditando) {
      const nuevoNombre = document.getElementById('nombre').value;
      empleadoEditando.textContent = nuevoNombre;
      modalEditar.style.display = 'none';
      empleadoEditando = null;
    }
  });

  // Confirmar eliminación
  confirmarEliminar.addEventListener('click', () => {
    if (empleadoAEliminar) {
      empleadoAEliminar.remove();
      modalEliminar.style.display = 'none';
      empleadoAEliminar = null;
    }
  });

  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // Cerrar botones en modales
  document.querySelectorAll('.cerrar').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal').style.display = 'none';
    });
  });

  // Asignar eventos a elementos existentes al cargar
  asignarEventos();
});
