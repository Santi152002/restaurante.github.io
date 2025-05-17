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


