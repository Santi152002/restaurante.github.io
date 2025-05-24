// === Mostrar modal principal ===
const abrirModalBtns = document.querySelectorAll('.abrirModalCrear');
const modalCrear = document.getElementById('modalCrear');
const cerrarModalCrear = document.getElementById('cerrarModalCrear');

abrirModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modalCrear.style.display = 'block';
    resetearEstadoModal();
  });
});

cerrarModalCrear.addEventListener('click', () => {
  modalCrear.style.display = 'none';
});

// === Función para resetear botones Sí/No al abrir el modal ===
function resetearEstadoModal() {
  document.querySelectorAll('.btn-si, .btn-no').forEach(btn => {
    btn.classList.remove('activo');
  });
}

// === Función para seleccionar Sí o No ===
function asignarEventosDisponibilidad() {
  document.querySelectorAll(".producto").forEach(producto => {
    const btnSi = producto.querySelector(".btn-si");
    const btnNo = producto.querySelector(".btn-no");

    btnSi.addEventListener("click", () => {
      btnSi.classList.add("activo");
      btnNo.classList.remove("activo");
    });

    btnNo.addEventListener("click", () => {
      btnNo.classList.add("activo");
      btnSi.classList.remove("activo");
    });
  });
}

// Ejecutar al cargar
asignarEventosDisponibilidad();

// === Modal para agregar nuevo producto ===
const btnAgregarProducto = document.getElementById("btnAgregarProducto");

// Crear y mostrar modal de agregar producto
btnAgregarProducto.addEventListener("click", () => {
  const nuevoModal = document.createElement("div");
  nuevoModal.classList.add("modal");
  nuevoModal.style.display = "block";
  nuevoModal.innerHTML = `
    <div class="modal-contenido">
      <span class="cerrar cerrar-nuevo-modal">&times;</span>
      <h2>Agregar Nuevo Producto</h2>
      <label>Nombre del producto:</label>
      <input type="text" id="nuevoNombreProducto" placeholder="Ej. Tacos"><br>
      <label>Imagen:</label>
      <input type="file" id="nuevaImagen"><br>
      <label>Información:</label>
      <textarea id="nuevaInfo" placeholder="Describe el producto"></textarea><br>
      <label>Precio:</label>
      <input type="number" id="nuevoPrecio" placeholder="Ej. 12000"><br>
      <button id="guardarNuevoProducto">Guardar</button>
    </div>
  `;
  document.body.appendChild(nuevoModal);

  // Cerrar nuevo modal
  nuevoModal.querySelector('.cerrar-nuevo-modal').addEventListener('click', () => {
    document.body.removeChild(nuevoModal);
  });

  // Guardar nuevo producto
  nuevoModal.querySelector('#guardarNuevoProducto').addEventListener('click', () => {
    const nombre = document.getElementById('nuevoNombreProducto').value;
    if (nombre.trim() === "") {
      alert("El nombre del producto no puede estar vacío.");
      return;
    }

    const nuevoProducto = document.createElement("div");
    nuevoProducto.classList.add("producto");
    nuevoProducto.innerHTML = `
      <label class="nombre-producto">${nombre}</label>
      <div class="disponibilidad">
        <span>¿Producto disponible?</span>
        <button class="btn-si">Sí</button>
        <button class="btn-no">No</button>
      </div>
    `;

    const contenedor = document.getElementById("contenedorModalproductos");
    contenedor.insertBefore(nuevoProducto, document.querySelector(".contenedor-botones"));

    // Reasignar eventos Sí/No
    asignarEventosDisponibilidad();

    mostrarNotificacion("Producto agregado con éxito.");
    document.body.removeChild(nuevoModal);
  });
});

// === Guardar disponibilidad ===
const btnGuardarDisponibilidad = document.getElementById("btnGuardarDisponibilidad");

btnGuardarDisponibilidad.addEventListener("click", () => {
  const productos = document.querySelectorAll(".producto");
  const resultados = [];

  productos.forEach(producto => {
    const nombre = producto.querySelector(".nombre-producto").textContent;
    const btnSi = producto.querySelector(".btn-si");
    const btnNo = producto.querySelector(".btn-no");

    let disponible = null;
    if (btnSi.classList.contains("activo")) {
      disponible = true;
    } else if (btnNo.classList.contains("activo")) {
      disponible = false;
    }

    resultados.push({ nombre, disponible });
  });

  console.log("Disponibilidad guardada:", resultados);
  mostrarNotificacion("Disponibilidad guardada correctamente.");
});

function mostrarNotificacion(mensaje) {
  const modal = document.getElementById("modalNotificacion");
  const mensajeElemento = document.getElementById("mensajeNotificacion");
  const cerrar = document.getElementById("cerrarNotificacion");

  mensajeElemento.textContent = mensaje;
  modal.style.display = "flex";

  cerrar.onclick = () => {
    modal.style.display = "none";
  };

  setTimeout(() => {
    modal.style.display = "none";
  }, 3000); // Se cierra en 3 segundos automáticamente
}

// MODAL GESTIONAR CANTIDAD
const modalCantidad = document.getElementById("modalCantidad");
const btnAbrirCantidad = document.querySelector(".abrirModalCantidad");
const btnCerrarCantidad = document.getElementById("cerrarModalCantidad");

btnAbrirCantidad.addEventListener("click", (e) => {
  e.preventDefault();
  modalCantidad.style.display = "flex";
});

btnCerrarCantidad.addEventListener("click", () => {
  modalCantidad.style.display = "none";
});

// GUARDAR CANTIDAD
document.getElementById("btnGuardarCantidad").addEventListener("click", () => {
  const hamburguesa = document.getElementById("cantidad-hamburguesa").value;
  const perro = document.getElementById("cantidad-perro").value;

  // Aquí puedes guardar o enviar los datos donde necesites
  console.log(`Hamburguesa: ${hamburguesa}, Perro: ${perro}`);

  // Mostrar notificación flotante si la usas, o simplemente cerrar
  modalCantidad.style.display = "none";
});

// === Mostrar notificación al guardar cantidades ===
const btnGuardarCantidad = document.getElementById("btnGuardarCantidad");

btnGuardarCantidad.addEventListener("click", () => {
  // Aquí podrías agregar lógica para guardar las cantidades si lo necesitas
  mostrarNotificacion("Cantidad de productos guardada correctamente.");
});

// Mostrar modal de gestión de información
const abrirModalInfo = document.querySelector('.abrirModalinfo');
const modalInfo = document.getElementById('modalInfo');
const cerrarModalInfo = document.getElementById('cerrarModalInfo');

abrirModalInfo.addEventListener('click', () => {
  modalInfo.style.display = 'block';
});

cerrarModalInfo.addEventListener('click', () => {
  modalInfo.style.display = 'none';
});

// Mostrar modal de edición
const modalEditarInfo = document.getElementById('modalEditarInfo');
const cerrarEditarInfo = document.getElementById('cerrarEditarInfo');
const btnGuardarCambiosInfo = document.getElementById('btnGuardarCambiosInfo');

// Variables para campos
const inputEditarNombre = document.getElementById('inputEditarNombre');
const inputEditarImagen = document.getElementById('inputEditarImagen');
const inputEditarDescripcion = document.getElementById('inputEditarDescripcion');
const inputEditarPrecio = document.getElementById('inputEditarPrecio');

// Simulación de datos de productos
const productosData = {
  "Hamburguesa": { descripcion: "Hamburguesa de res", precio: 12000 },
  "Perro": { descripcion: "Perro caliente con queso", precio: 9000 },
  "Burrito": { descripcion: "Burrito de pollo", precio: 10000 },
  "Pizza": { descripcion: "Pizza familiar", precio: 15000 }
};

// Editar producto
document.querySelectorAll('.btn-editar-info').forEach(btn => {
  btn.addEventListener('click', () => {
    const nombreProducto = btn.previousElementSibling.textContent.trim();
    const producto = productosData[nombreProducto];

    inputEditarNombre.value = nombreProducto;
    inputEditarDescripcion.value = producto.descripcion;
    inputEditarPrecio.value = producto.precio;

    modalEditarInfo.style.display = 'block';
  });
});

// Cerrar modal edición
cerrarEditarInfo.addEventListener('click', () => {
  modalEditarInfo.style.display = 'none';
});

// Guardar cambios
btnGuardarCambiosInfo.addEventListener('click', () => {
  mostrarNotificacion("Cambios realizados correctamente.");
  modalEditarInfo.style.display = 'none';
});





