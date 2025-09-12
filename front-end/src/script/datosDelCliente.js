// Cerrar ventana datos cliente
function cerrarVentanaDatosCliente() {
  document.getElementById("ventanaDatosCliente").style.display = "none";
}

// Mostrar u ocultar comprobante según método
function mostrarComprobante(metodo) {
  const comprobanteDiv = document.getElementById("comprobanteAdjunto");
  const metodoTransferencia = document.getElementById("metodoTransferencia");

  if (metodo === "transferencia") {
    comprobanteDiv.style.display = "block";
    metodoTransferencia.style.display = "block";
  } else {
    comprobanteDiv.style.display = "none";
    metodoTransferencia.style.display = "none";
  }
}

//mostrar mensajes de forma amigable
function mostrarMensaje(texto, tiempo = 4000) {
  const ventana = document.getElementById("ventanaMensaje");
  const textoElemento = document.getElementById("mensajeTexto");
  const botonCerrar = document.getElementById("cerrarMensaje");

  textoElemento.textContent = texto;
  ventana.classList.remove("oculto");

  // Cerrar al hacer clic en el botón
  botonCerrar.onclick = () => ventana.classList.add("oculto");

  // Auto cerrar después de cierto tiempo
  setTimeout(() => {
    ventana.classList.add("oculto");
  }, tiempo);
}

// Manejar envío formulario pedido
async function enviarFormularioPedido(e) {
  e.preventDefault();

  if (!validarFormularioCliente()) return;

  await finalizarPedido();
}

// Validar formulario cliente
function validarFormularioCliente() {
  const telefonoInput = document.getElementById("telefono");
  const errorTelefono = document.getElementById("errorTelefono");
  const telefonoValor = telefonoInput.value.trim();
  const soloNumeros = /^\d{10}$/;

  if (!soloNumeros.test(telefonoValor)) {
    errorTelefono.style.display = "inline";
    telefonoInput.focus();
    return false;
  }
  errorTelefono.style.display = "none";

  const metodoPago = document.querySelector('select[name="metodo_pago"]').value;
  const errorMetodoPago = document.getElementById("errorMetodoPago");

  if (metodoPago === "Seleccionar") {
    errorMetodoPago.style.display = "inline";
    return false;
  }
  errorMetodoPago.style.display = "none";

  const medioTransferencia = document.querySelector(
    'select[name="medio_transferencia"]'
  ).value;
  const errorMedioTransferencia = document.getElementById(
    "errorMedioTransferencia"
  );

  if (metodoPago === "transferencia" && !medioTransferencia) {
    errorMedioTransferencia.style.display = "inline";
    return false;
  }
  errorMedioTransferencia.style.display = "none";

  const archivoComprobante = document.getElementById("archivoComprobante");
  const errorComprobante = document.getElementById("errorComprobante");

  if (metodoPago === "transferencia") {
    const archivo = archivoComprobante.files[0];

    if (!archivo) {
      errorComprobante.textContent = "Debes adjuntar el comprobante de pago.";
      errorComprobante.style.display = "inline";
      archivoComprobante.focus();
      return false;
    }

    const extension = archivo.name.split(".").pop().toLowerCase();
    if (!["jpg", "pdf", "png"].includes(extension)) {
      errorComprobante.textContent =
        "El comprobante debe ser una imagen en formato JPG, PDF O PNG.";
      errorComprobante.style.display = "inline";
      archivoComprobante.value = "";
      archivoComprobante.focus();
      return false;
    }
  }
  errorComprobante.style.display = "none";

  return true;
}

// Finalizar pedido, enviar a backend y limpiar carrito
async function finalizarPedido() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío, no se puede realizar el pedido.");
    return;
  }

  const form = document.getElementById("formularioPedido");
  const formData = new FormData(form);

  // Mapeo método de pago a id
  let metodoPago = formData.get("metodo_pago");
  let id_metodo_pago = metodoPago === "transferencia" ? 2 : 1;

  let comprobante = "Sin comprobante";
  if (metodoPago === "transferencia") {
    comprobante = "Comprobante adjunto (no implementado subida archivo)";
  }

  // Preparar array productos para API
  const productosAPI = carrito.map((item) => ({
    id_producto: item.id_producto || null,
    cantidad: item.cantidad,
  }));

  if (productosAPI.some((p) => p.id_producto === null)) {
    mostrarMensaje("Error: algún producto no tiene id_producto definido.");
    return;
  }

  const body = {
    nombre: formData.get("nombre"),
    telefono: formData.get("telefono"),
    direccion: formData.get("direccion"),
    observaciones: formData.get("observaciones") || null,
    comprobante,
    id_metodo_pago,
    productos: productosAPI,
  };

  try {
    const response = await fetch("http://localhost:4000/api/ordenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      mostrarMensaje(
        "Error al enviar el pedido: " +
          (errorData.message || response.statusText)
      );
      return;
    }

    // Pedido enviado con éxito: limpiar carrito, cerrar modales, mostrar mensaje
    localStorage.removeItem("carrito");
    carrito = [];
    window.dispatchEvent(new Event("carritoActualizado"));

    cerrarVentanaDatosCliente();
    mostrarMensaje("Pedido enviado correctamente.");
  } catch (error) {
    mostrarMensaje("Error al enviar el pedido: " + error.message);
  }
}

// Evento para cambio método pago para mostrar/ocultar comprobante
document
  .querySelector('select[name="metodo_pago"]')
  .addEventListener("change", (e) => {
    mostrarComprobante(e.target.value);
  });

// Escuchar evento para mostrar formulario cliente desde carrito.js
window.addEventListener("mostrarFormularioPedido", mostrarFormularioPedido);

// Al cargar, actualizar contador carrito
document.addEventListener("DOMContentLoaded", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById("contador-carrito").textContent = totalProductos;
  document.getElementById("contador-carrito2").textContent = totalProductos;
});
