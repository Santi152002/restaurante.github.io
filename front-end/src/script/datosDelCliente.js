// VENTANA DE DATOS DE CLIENTE

function cerrarVentanaDatosCliente() {
  document.getElementById("ventanaDatosCliente").style.display = "none";
}

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

function enviarFormularioPedido(e) {
  e.preventDefault();

  if (!validarFormularioCliente()) {
    return;
  }

  finalizarPedido();
}

function validarFormularioCliente() {
  // Quitar el e.preventDefault()

  // Validar teléfono
  const telefonoInput = document.getElementById("telefono");
  const errorTelefono = document.getElementById("errorTelefono");
  const telefonoValor = telefonoInput.value.trim();
  const soloNumeros = /^\d{10}$/;

  if (!soloNumeros.test(telefonoValor)) {
    errorTelefono.style.display = "inline";
    telefonoInput.focus();
    return false;
  } else {
    errorTelefono.style.display = "none";
  }

  // Validar método de pago
  const metodoPago = document.querySelector('select[name="metodo_pago"]').value;
  const errorMetodoPago = document.getElementById("errorMetodoPago");

  if (metodoPago === "Seleccionar") {
    errorMetodoPago.style.display = "inline";
    return false;
  } else {
    errorMetodoPago.style.display = "none";
  }

  // Validar medio si es transferencia
  const medioTransferencia = document.querySelector('select[name="medio_transferencia"]').value;
  const errorMedioTransferencia = document.getElementById("errorMedioTransferencia");

  if (metodoPago === "transferencia" && !medioTransferencia) {
    errorMedioTransferencia.style.display = "inline";
    return false;
  } else {
    errorMedioTransferencia.style.display = "none";
  }

  // Validar archivo si es transferencia
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

    const extension = archivo.name.split('.').pop().toLowerCase();
    if (!["jpg", "pdf", "png"].includes(extension)) {
      errorComprobante.textContent = "El comprobante debe ser una imagen en formato JPG, PDF O PNG.";
      errorComprobante.style.display = "inline";
      archivoComprobante.value = "";
      archivoComprobante.focus();
      return false;
    }

    errorComprobante.style.display = "none";
  }

  return true;
}

function finalizarPedido() {
  carrito = [];
  total = 0;
  guardarCarrito();

  cerrarVentanaDatosCliente();
  mostrarMensajeExito();
}

function mostrarMensajeExito() {
  document.getElementById("mensajePedidoEnviado").style.display = "flex";
}

function cerrarMensajeExito() {
  document.getElementById("mensajePedidoEnviado").style.display = "none";
}
