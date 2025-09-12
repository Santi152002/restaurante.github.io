// === Mostrar modal principal ===

const modalCrear = document.getElementById("modalCrear");
const modalAgregarProducto = document.getElementById("modalAgregarProducto");
const listaProductosDiv = document.getElementById("listaProductos");

// Abrir modal principal productos disponibles (agrega el botón para abrirlo)
document.querySelector("#btnAbrirModalCrear")?.addEventListener("click", () => {
  modalCrear.style.display = "block";
  cargarProductos();
});

// Cerrar modales
document.getElementById("cerrarModalCrear").addEventListener("click", () => {
  modalCrear.style.display = "none";
});
document.getElementById("cerrarModalAgregar").addEventListener("click", () => {
  modalAgregarProducto.style.display = "none";
});
document.getElementById("cerrarNotificacion").addEventListener("click", () => {
  document.getElementById("modalNotificacion").style.display = "none";
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
  const modal = document.getElementById("modalNotificacion");
  const mensajeElemento = document.getElementById("mensajeNotificacion");
  mensajeElemento.textContent = mensaje;
  modal.style.display = "flex";
  setTimeout(() => {
    modal.style.display = "none";
  }, 3000);
}
// Cargar productos desde backend y mostrarlos
async function cargarProductos() {
  try {
    const res = await fetch("http://localhost:4000/api/productos", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }); // Endpoint que lista productos

    const productos = await res.json();

    console.log("Respuesta del backend:", productos); // Depuración

    // Validar que productos.data existe y es un array
    if (!productos || !Array.isArray(productos.data)) {
      throw new Error("La respuesta no contiene un array válido en 'data'");
    }

    listaProductosDiv.innerHTML = ""; // limpiar

    productos.data.forEach((producto) => {
      if (!producto.disponibilidad) return; // Solo mostrar disponibles

      const div = document.createElement("div");
      div.classList.add("producto");
      div.dataset.id = producto.id || producto.id; // id para actualizar

      div.innerHTML = `
        <label class="nombre-producto">${producto.nombre_producto}</label>
        <div class="disponibilidad">
          <span>¿Producto disponible?</span>
          <button class="btn-si activo">Sí</button>
          <button class="btn-no">No</button>
        </div>
      `;

      listaProductosDiv.appendChild(div);
    });

    asignarEventosDisponibilidad();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}
// Asignar evento a botones sí/no para cada producto
function asignarEventosDisponibilidad() {
  document.querySelectorAll(".producto").forEach((productoDiv) => {
    const btnSi = productoDiv.querySelector(".btn-si");
    const btnNo = productoDiv.querySelector(".btn-no");

    btnSi.onclick = () => {
      btnSi.classList.add("activo");
      btnNo.classList.remove("activo");
    };
    btnNo.onclick = () => {
      btnNo.classList.add("activo");
      btnSi.classList.remove("activo");
      // Al marcar No, eliminar el producto y actualizar backend
      const idProducto = productoDiv.dataset.id;
      eliminarProducto(idProducto, productoDiv);
    };
  });
}

// Función para eliminar producto en backend y UI
async function eliminarProducto(id, elementoDiv) {
  try {
    // Aquí puedes usar DELETE o PATCH para actualizar disponibilidad
    const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ disponibilidad: false }),
    });
    if (res.ok) {
      // Remover producto de la UI
      elementoDiv.remove();
      mostrarNotificacion("Producto quitado correctamente.");
    } else {
      mostrarNotificacion("Error al quitar producto.");
    }
  } catch (error) {
    console.error("Error al quitar producto:", error);
    mostrarNotificacion("Error de conexión.");
  }
}

// Abrir modal agregar nuevo producto
document.getElementById("btnAgregarProducto").addEventListener("click", () => {
  modalAgregarProducto.style.display = "block";
});

// Guardar nuevo producto con POST
document
  .getElementById("formNuevoProducto")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreProducto").value.trim();
    const imagenFile = document.getElementById("imagenProducto").files[0];
    const descripcion = document.getElementById("infoProducto").value.trim();
    const precio = parseFloat(document.getElementById("precioProducto").value);

    if (!nombre || !imagenFile || !descripcion || isNaN(precio)) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre_producto", nombre);
    formData.append("descripcion", descripcion);
    formData.append("imagen_producto", imagenFile); // imagen como archivo
    formData.append("precio", precio);
    formData.append("disponibilidad", true);
    formData.append("cantidad_disponible", 0); // o puedes capturar otro input si agregas

    try {
      const res = await fetch("http://localhost:4000/api/productos/crear", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // NO pongas Content-Type aquí. El navegador lo pone automáticamente.
        },
        body: formData,
      });

      if (res.ok) {
        mostrarNotificacion("Producto creado exitosamente.");
        modalAgregarProducto.style.display = "none";
        cargarProductos(); // recarga lista con nuevo producto
        document.getElementById("formNuevoProducto").reset();
      } else {
        mostrarNotificacion("Error al crear producto.");
      }
    } catch (error) {
      console.error("Error crear producto:", error);
      mostrarNotificacion("Error de conexión.");
    }
  });

document
  .getElementById("btnGuardarDisponibilidad")
  .addEventListener("click", async () => {
    const productos = document.querySelectorAll(".producto");
    const actualizaciones = [];

    productos.forEach((productoDiv) => {
      const id = productoDiv.dataset.id;
      const btnSi = productoDiv.querySelector(".btn-si");
      const disponible = btnSi.classList.contains("activo");
      actualizaciones.push({ id, disponibilidad: disponible });
    });

    try {
      // Enviar actualizaciones en batch (suponiendo que backend lo soporte)
      // Sino debes hacer PATCH uno por uno
      for (const prod of actualizaciones) {
        await fetch(`http://localhost:4000/api/productos/${prod.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ disponibilidad: prod.disponibilidad }),
        });
      }
      mostrarNotificacion("Disponibilidad guardada correctamente.");
    } catch (error) {
      console.error("Error guardando disponibilidad:", error);
      mostrarNotificacion("Error guardando cambios.");
    }
  });

// MODAL GESTIONAR CANTIDAD//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7
const modalCantidad = document.getElementById("modalCantidad");
const btnAbrirCantidad = document.querySelector(".abrirModalCantidad");

// Abrir el modal y cargar productos
btnAbrirCantidad.addEventListener("click", async (e) => {
  e.preventDefault();
  modalCantidad.style.display = "flex";
  await cargarProductosCantidad(); // <-- Cargar contenido al abrir
});

// Función para cargar productos y mostrarlos en el modal
async function cargarProductosCantidad() {
  const contenedor = document.getElementById("contenedorModalCantidad");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  try {
    const res = await fetch("http://localhost:4000/api/productos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const productos = await res.json();

    contenedor.innerHTML = `
      <span class="cerrar" id="cerrarModalCantidad">&times;</span>
      <h2>Gestión de Cantidad de Productos</h2>
    `;

    productos.data.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("producto-cantidad");
      div.dataset.id = producto.id;

      div.innerHTML = `
        <label class="nombre-producto">${producto.nombre_producto}</label>
        <div class="cantidad-control">
          <label>Cantidad:</label>
          <input type="number" class="input-cantidad" value="${producto.cantidad_disponible}" min="0" />
        </div>
      `;

      contenedor.appendChild(div);
    });

    const botones = document.createElement("div");
    botones.className = "contenedor-botones";
    botones.innerHTML = `<button id="btnGuardarCantidad" class="btn-guardar">Guardar</button>`;
    contenedor.appendChild(botones);

    // Eventos del modal
    document
      .getElementById("btnGuardarCantidad")
      .addEventListener("click", guardarCantidades);
    document
      .getElementById("cerrarModalCantidad")
      .addEventListener("click", () => {
        modalCantidad.style.display = "none";
      });
  } catch (err) {
    console.error("Error al cargar productos:", err);
    mostrarNotificacion("Error al cargar productos.");
  }
}

// Guardar las cantidades nuevas con PATCH
async function guardarCantidades() {
  const productos = document.querySelectorAll(".producto-cantidad");

  try {
    for (const div of productos) {
      const id = div.dataset.id;
      const cantidad = parseInt(div.querySelector(".input-cantidad").value);

      await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ cantidad_disponible: cantidad }),
      });
    }
    mostrarNotificacion("Cantidad de productos guardada correctamente."); // Mostrar mensaje éxito

    await cargarProductosCantidad();
  } catch (err) {
    console.error("Error al guardar cantidades:", err);
    mostrarNotificacion("Error al guardar cantidades.");
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Mostrar modal de gestión de información
const abrirModalInfo = document.querySelector(".abrirModalinfo");
const modalInfo = document.getElementById("modalInfo");
const cerrarModalInfo = document.getElementById("cerrarModalInfo");

// Contenedor donde se listarán productos dinámicamente
const contenedorModalInfo = document.getElementById("contenedorModalInfo");

// Mostrar modal edición y sus campos
const modalEditarInfo = document.getElementById("modalEditarInfo");
const cerrarEditarInfo = document.getElementById("cerrarEditarInfo");
const btnGuardarCambiosInfo = document.getElementById("btnGuardarCambiosInfo");

const inputEditarNombre = document.getElementById("inputEditarNombre");
const inputEditarImagen = document.getElementById("inputEditarImagen");
const inputEditarDescripcion = document.getElementById(
  "inputEditarDescripcion"
);
const inputEditarPrecio = document.getElementById("inputEditarPrecio");

abrirModalInfo.addEventListener("click", async () => {
  modalInfo.style.display = "block";
  try {
    const res = await fetch("http://localhost:4000/api/productos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al cargar productos");

    const productos = await res.json();

    // Limpiar contenedor para refrescar listado
    contenedorModalInfo.innerHTML = `<h2>Gestión de Información de Productos</h2>`;

    // Crear listado dinámico de productos con botón editar
    productos.data.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("producto-info-item");
      div.innerHTML = `
        <span class="nombre-producto" data-id="${producto.id}">${producto.nombre_producto}</span>
        <button class="btn-editar-info">Editar</button>
      `;
      contenedorModalInfo.appendChild(div);
    });

    // Añadir evento a cada botón editar para abrir modal edición
    document.querySelectorAll(".btn-editar-info").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const span = btn.previousElementSibling;
        const idProducto = span.getAttribute("data-id");

        // Obtener datos del producto a editar
        const resDetalle = await fetch(
          `http://localhost:4000/api/productos/${idProducto}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!resDetalle.ok) {
          alert("Error al cargar datos del producto");
          return;
        }
        const productoDetalle = await resDetalle.json();

        // Rellenar formulario con datos reales
        inputEditarNombre.value = productoDetalle.data.nombre_producto || "";
        inputEditarDescripcion.value = productoDetalle.data.descripcion || "";
        inputEditarPrecio.value = productoDetalle.data.precio || 0;

        // Guardar idProducto en modal para usar al guardar
        modalEditarInfo.setAttribute("data-id-producto", idProducto);

        modalEditarInfo.style.display = "block";
      });
    });
  } catch (error) {
    alert("Error cargando productos");
  }
});

cerrarModalInfo.addEventListener("click", () => {
  modalInfo.style.display = "none";
});

// Cerrar modal edición
cerrarEditarInfo.addEventListener("click", () => {
  modalEditarInfo.style.display = "none";
});

// Guardar cambios producto
btnGuardarCambiosInfo.addEventListener("click", async () => {
  const idProducto = modalEditarInfo.getAttribute("data-id-producto");
  if (!idProducto) {
    alert("No se pudo obtener el producto a actualizar");
    return;
  }

  const nombre = inputEditarNombre.value.trim();
  const descripcion = inputEditarDescripcion.value.trim();
  const precio = parseFloat(inputEditarPrecio.value);

  if (!nombre || !descripcion || isNaN(precio)) {
    alert("Completa todos los campos correctamente.");
    return;
  }

  const imagenFile = inputEditarImagen.files[0];

  let options = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  if (imagenFile) {
    const formData = new FormData();
    formData.append("nombre_producto", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("imagen_producto", imagenFile);
    options.body = formData;
  } else {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify({
      nombre_producto: nombre,
      descripcion,
      precio,
    });
  }

  try {
    const res = await fetch(
      `http://localhost:4000/api/productos/${idProducto}`,
      options
    );
    if (!res.ok) throw new Error("Error al actualizar producto");

    mostrarNotificacion("Producto actualizado correctamente.");
    modalEditarInfo.style.display = "none";
    modalInfo.style.display = "none";

    // Refrescar listado de productos tras guardar cambios
    abrirModalInfo.click();
  } catch (error) {
    console.error(error);
    alert("Error actualizando el producto");
  }
});
