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
function agregarAlCarrito(nombre, idCantidad, precio, imagen, descripcion) {
  /*  console.log("📦 Imagen enviada al carrito:", imagen); */
  const cantidad = parseInt(document.getElementById(idCantidad).textContent);
  /*   console.log("Imagen enviada al carrito:", imagen); */ // 👈 Verifica que es válida
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
  console.log(JSON.parse(localStorage.getItem("carrito")));
  renderizarCarrito();
  actualizarContador();
}

function actualizarContador() {
  const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById("contador-carrito").textContent = totalProductos;
}

function actualizarContador() {
  const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById("contador-carrito2").textContent = totalProductos;
}

function renderizarCarrito() {
  const contenedor = document.getElementById("lista-carrito");
  contenedor.innerHTML = "";

  carrito.forEach((item, index) => {
    /* console.log("🖼️ Imagen en renderizarCarrito:", item.imagen); */
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
  /*   console.log("Carrito actual:", carrito); // Verifica que el objeto tenga imagen */
  guardarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  guardarCarrito();
}

//PARA MOSTRAR FORMULARIO DATOS DEL CLIENTE
function mostrarFormularioPedido() {
  if (carrito.length === 0) {
    // Mostrar modal en vez de alert
    document.getElementById("modalCarritoVacio").style.display = "flex";
    return;
  } else {
    document.getElementById("carritoPanel").classList.remove("mostrar");
    document.getElementById("ventanaDatosCliente").style.display = "block";
  }
}

//CIERRA EL MODAL DEL CARRITO VACIO
function cerrarModalCarrito() {
  document.getElementById("modalCarritoVacio").style.display = "none";
}
// Cuando carga la página
window.addEventListener("DOMContentLoaded", () => {
  renderizarCarrito();
  actualizarContador();
});


