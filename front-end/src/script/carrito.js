let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = carrito.reduce((sum, item) => sum + item.total, 0);

// Mostrar panel deslizante carrito
document.getElementById("boton-carrito").addEventListener("click", () => {
  document.getElementById("carritoPanel").classList.add("mostrar");
  renderizarCarrito();
});

document.getElementById("boton-carrito2").addEventListener("click", () => {
  document.getElementById("carritoPanel").classList.add("mostrar");
  renderizarCarrito();
});

// Cerrar panel carrito
function cerrarCarrito() {
  document.getElementById("carritoPanel").classList.remove("mostrar");
}

// Agrega producto al carrito
function agregarAlCarrito(
  nombre,
  idCantidad,
  precio,
  imagen,
  descripcion,
  id_producto
) {
  const cantidad = parseInt(document.getElementById(idCantidad).textContent);
  const existente = carrito.find((item) => item.nombre === nombre);

  if (existente) {
    existente.cantidad += cantidad;
    existente.total += cantidad * precio;
  } else {
    carrito.push({
      nombre,
      cantidad,
      precio,
      imagen,
      descripcion,
      total: cantidad * precio,
      id_producto,
    });
  }

  total += cantidad * precio;
  guardarCarrito();
  console.log("Carrito antes de enviar:", carrito);
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarContador();
}

function actualizarContador() {
  const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const contador1 = document.getElementById("contador-carrito");
  const contador2 = document.getElementById("contador-carrito2");
  if (contador1) contador1.textContent = totalProductos;
  if (contador2) contador2.textContent = totalProductos;
}

function renderizarCarrito() {
  const contenedor = document.getElementById("lista-carrito");
  contenedor.innerHTML = "";

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = ` 
      <div class="tarjeta-carrito">
        <button class="boton-x" onclick="eliminarProducto(${index})">x</button>
        <div class="contenido-izquierda">
          <img src="${item.imagen}" class="imagen-carrito" />
          <div class="contenido-carrito">
            <strong>${item.nombre}</strong>
            <p>$${item.precio}</p>
          </div>
        </div>
        <div class="cantidad-controles">
          <button onclick="cambiarCantidad(${index}, 1)">+</button>
          <span class="contador">${item.cantidad}</span>
          <button onclick="cambiarCantidad(${index}, -1)">-</button>
        </div>
      </div>
    `;
    contenedor.appendChild(div);
  });

  total = carrito.reduce((sum, item) => sum + item.total, 0);
  document.getElementById("totalCarrito").textContent =
    total.toLocaleString("es-CO");
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  } else {
    carrito[index].total = carrito[index].precio * carrito[index].cantidad;
  }
  guardarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
}

// Mostrar formulario datos del cliente
function mostrarFormularioPedido() {
  if (carrito.length === 0) {
    document.getElementById("modalCarritoVacio").style.display = "flex";
    return;
  }
  document.getElementById("carritoPanel").classList.remove("mostrar");
  document.getElementById("ventanaDatosCliente").style.display = "block";
}

// Cerrar modal carrito vacío
function cerrarModalCarrito() {
  document.getElementById("modalCarritoVacio").style.display = "none";
}

// Cerrar panel carrito
function cerrarCarrito() {
  document.getElementById("carritoPanel").classList.remove("mostrar");
}
