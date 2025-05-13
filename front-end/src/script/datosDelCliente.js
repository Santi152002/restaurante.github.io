

// ACA SE REALIZA LOS DATOS DEL CLIENTE:

function realizarPedido() {
  if (carrito.length === 0) {
    // Mostrar modal en vez de alert
    document.getElementById("modalCarritoVacio").style.display = "flex";
    return;
  } else {
    document.getElementById("carritoPanel").style.display = "none";
    document.getElementById("ventanaDatosCliente").style.display = "block";
  }
}

function cerrarModalCarrito() {
  document.getElementById("modalCarritoVacio").style.display = "none";
}

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
  
  function enviarPedido(e) {
    e.preventDefault();
  
    // Validar teléfono
    const telefonoInput = document.getElementById("telefono");
    const errorTelefono = document.getElementById("errorTelefono");
    const telefonoValor = telefonoInput.value.trim();
    const soloNumeros = /^\d{10}$/;
  
    if (!soloNumeros.test(telefonoValor)) {
      errorTelefono.style.display = "inline";
      telefonoInput.focus();
      return;
    } else {
      errorTelefono.style.display = "none";
    }
  
    // Validar que se haya seleccionado un método de pago
    const metodoPago = document.querySelector('select[name="metodo_pago"]').value;
    const errorMetodoPago = document.getElementById("errorMetodoPago");
  
    if (metodoPago === "Seleccionar") {
      errorMetodoPago.style.display = "inline";
      return;
    } else {
      errorMetodoPago.style.display = "none";
    }
  
    // Validar que se haya seleccionado un medio de transferencia si el pago es por transferencia
    const medioTransferencia = document.querySelector('select[name="medio_transferencia"]').value;
    const errorMedioTransferencia = document.getElementById("errorMedioTransferencia");
  
    if (metodoPago === "transferencia" && !medioTransferencia) {
      errorMedioTransferencia.style.display = "inline";
      return;
    } else {
      errorMedioTransferencia.style.display = "none";
    }
  
    // Validar comprobante si el método de pago es transferencia
    const archivoComprobante = document.getElementById("archivoComprobante");
    const errorComprobante = document.getElementById("errorComprobante");
  
    if (metodoPago === "transferencia") {
      const archivo = archivoComprobante.files[0];
  
      if (!archivo) {
        errorComprobante.textContent = "Debes adjuntar el comprobante de pago.";
        errorComprobante.style.display = "inline";
        archivoComprobante.focus();
        return;
      }
  
      // Verificar si el archivo es .jpg, pdf, png.
      const extension = archivo.name.split('.').pop().toLowerCase();
      console.log(extension);
      
      if (extension !== "jpg" && extension !== "pdf" && extension !== "png") {
        errorComprobante.textContent = "El comprobante debe ser una imagen en formato JPG, PDF O PNG.";
        errorComprobante.style.display = "inline";
        archivoComprobante.value = ""; // limpia el input
        archivoComprobante.focus();
        return;
      }
  
      errorComprobante.style.display = "none";
    }
  
    cerrarVentanaDatosCliente();
    mostrarMensajeExito();
  }
  
  function mostrarMensajeExito() {
    document.getElementById("mensajePedidoEnviado").style.display = "flex";
  }
  
  function cerrarMensajeExito() {
    document.getElementById("mensajePedidoEnviado").style.display = "none";
  }
  