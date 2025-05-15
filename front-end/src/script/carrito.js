let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = carrito.reduce((sum, item) => sum + item.total, 0);

// Mostrar panel deslizante carrito
document.getElementById("boton-carrito").addEventListener("click", () => {
  document.getElementById("carritoPanel").classList.add("mostrar");
  renderizarCarrito();
});

// Cerrar panel carrito
function cerrarCarrito() {
  document.getElementById("carritoPanel").classList.remove("mostrar");
}

// Agrega producto al carrito
function agregarAlCarrito(nombre, idCantidad, precio, imagen, descripcion) {
  const cantidad = parseInt(document.getElementById(idCantidad).textContent);
  const existente = carrito.find((item) => item.nombre === nombre); // por si ya existe en el carrito

  if (existente) {
    existente.cantidad += cantidad; // si existe se le suma cantidad al carrito
    existente.total += cantidad * precio; // si se va cambiando el precio
  } else {
    carrito.push({
      nombre,
      cantidad,
      precio,
      imagen,
      descripcion,
      total: cantidad * precio,
    });
  }

  total += cantidad * precio; // va cambiando el precio final
  guardarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarCarrito();
  actualizarContador();
}

function actualizarContador() {
  const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById("contador-carrito").textContent = totalProductos;
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
  document.getElementById("totalCarrito").textContent = total.toFixed(2);
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
function realizarPedido() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  alert("¡Pedido realizado!");
  carrito = [];
  total = 0;
  guardarCarrito();
}

// Cuando carga la página
window.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
  actualizarContador();
});
