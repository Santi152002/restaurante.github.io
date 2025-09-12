var swiper = new Swiper(".mySwiper-1", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

var swiper = new Swiper(".mySwiper-2", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    520: {
      slidesPerView: 2,
    },
    950: {
      slidesPerView: 3,
    },
  },
});

let tabInputs = document.querySelectorAll(".tabImput");
tabInputs.forEach(function (input) {
  input.addEventListener("change", function () {
    let id = input.ariaValueMax;
    let thisSwiper = document.getElementById("swiper" + id);
    thisSwiper?.swiper?.update();
  });
});

async function obtenerProductos() {
  try {
    const res = await fetch("http://localhost:4000/api/productos");
    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      const productos = data.data;
      renderizarProductos(productos);
      renderizarProductosPorCategoria(productos);
    } else {
      console.error("Respuesta inesperada:", data);
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "")
    .replace(/\r/g, "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderizarProductos(productos) {
  const contenedor = document.getElementById("contenedor-productos");
  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    const idProducto = producto.id;
    const descripcionEscapada = escapeHtml(producto.descripcion);
    const nombreEscapado = escapeHtml(producto.nombre_producto);
    const precioFormateado = parseInt(producto.precio).toLocaleString();

    const htmlProducto = `
      <div class="swiper-slide">
        <div class="slider">
          <div class="slider-txt">
            <h1>${nombreEscapado}</h1>
            <p>${descripcionEscapada}</p>
            <br>
            <p class="price" style="font-size: 24px;"><strong>$${precioFormateado}</strong></p>
            <div class="botones">
              <a class="btn-1" onclick="detalleProductoOpen('${idProducto}')">Comprar</a>

              <div id="${idProducto}" class="ventana" style="display:none;">
                <div class="detalle-producto">
                  <span class="cerrar" onclick="detalleProductoClose('${idProducto}','valorContador${idProducto}')">&times;</span>
                  <h2 style="margin-left: 3%; font-size: 40px">${nombreEscapado}</h2>
                  <div class="contenido-producto">
                    <img id="url${idProducto}" src="${
      producto.imagen_producto
    }" alt="${nombreEscapado}" />
                    <div class="descripcion">
                      <p>${descripcionEscapada}</p>
                      <br />
                      <p class="price" style="font-size: 24px;"><strong>$${precioFormateado}</strong></p>
                      <div class="contador">
                        <button class="Boton Boton-restar" onclick="negativo('valorContador${idProducto}')">-</button>
                        <span class="valor" id="valorContador${idProducto}" style="color: black">1</span>
                        <button class="Boton Boton-sumar" onclick="positivo('valorContador${idProducto}')">+</button>
                      </div>
                      <a class="btn-1" style="padding: 2% 5%; margin-top: 5%;"
                        onclick="agregarAlCarrito('${nombreEscapado}', 'valorContador${idProducto}', ${parseInt(
      producto.precio
    )}, document.getElementById('url${idProducto}').src, '${descripcionEscapada}', ${idProducto})">Agregar</a>
                    </div>
                  </div>
                </div>
              </div>

              <a onclick="location.href='#menu_principal'" class="btn-1">Menu</a>
            </div>
          </div>
          <div class="slider-img">
            <img src="${producto.imagen_producto}" alt="${nombreEscapado}" />
          </div>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML("beforeend", htmlProducto);
  });
}

function renderizarProductosPorCategoria(productos) {
  const contenedores = {
    hamburguesa: document.getElementById("productos-hamburguesas"),
    burrito: document.getElementById("productos-burritos"),
    otro: document.getElementById("productos-otros"),
  };

  Object.values(contenedores).forEach((c) => (c.innerHTML = ""));

  productos.forEach((producto) => {
    const nombreLower = producto.nombre_producto.toLowerCase();
    let categoria = "otro";
    if (nombreLower.startsWith("hamburguesa")) {
      categoria = "hamburguesa";
    } else if (nombreLower.startsWith("burrito")) {
      categoria = "burrito";
    }

    const contenedor = contenedores[categoria];
    const nombre = escapeHtml(producto.nombre_producto);
    const descripcion = escapeHtml(producto.descripcion);
    const precio = parseInt(producto.precio).toLocaleString();
    const imagen = producto.imagen_producto;

    const productoHTML = `
      <div class="swiper-slide">
        <div class="product">
          <div class="product-txt">
            <h4>${nombre}</h4>
            <div class="product-img">
              <img src="${imagen}" alt="${nombre}" />
            </div>
            <p>${descripcion}</p>
            <p class="price"><strong>$${precio}</strong></p>
            <br />
            <button class="botonDeCompraMenu">
              <a onclick="agregarAlCarrito('${nombre}', 'valorContador${producto.id}', ${producto.precio}, '${imagen}', '${descripcion}', ${producto.id})">
                Comprar
              </a>
            </button>
          </div>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML("beforeend", productoHTML);
  });

  if (window.Swiper) {
    new Swiper("#swiper-hamburguesas", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      loop: false,
    });
    new Swiper("#swiper-burritos", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      loop: false,
    });
    new Swiper("#swiper-otros", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      loop: false,
    });
  }
}

function detalleProductoOpen(id) {
  document.getElementById(id).style.display = "block";
}

function detalleProductoClose(id, contadorId) {
  document.getElementById(id).style.display = "none";
  document.getElementById(contadorId).innerText = "1";
}

window.addEventListener("DOMContentLoaded", obtenerProductos);
