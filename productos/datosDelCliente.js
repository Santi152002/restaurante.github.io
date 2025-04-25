// ACA SE VA A TOMAR LA ID DE LOS PRODUCTOS:

let carrito = [
  // Ejemplo de productos en el carrito
  { id: 1, nombre: "hamburguesa", cantidad: 2, precio: 5000 },
  { id: 2, nombre: "Burrito", cantidad: 1, precio: 2000 }
  // Puedes agregar más productos aquí
];



// ACA SE REALIZA LOS DATOS DEL CLIENTE:

function realizarPedido() {
    // Verificar si el carrito tiene productos
    if (carrito.length === 0) {
      alert("Debes seleccionar al menos un producto en tu carrito antes de realizar el pedido.");
      return;  // Detiene la función si no hay productos en el carrito
    }
  
    // Oculta el carrito y abre la ventana de datos del cliente
    document.getElementById("carritoPanel").style.display = "none";
    document.getElementById("ventanaDatosCliente").style.display = "block";
  }
  


function realizarPedido() {
    // Oculta el carrito y abre la ventana de datos del cliente
    document.getElementById("carritoPanel").style.display = "none";
    document.getElementById("ventanaDatosCliente").style.display = "block";
  }
  
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
  
      // Verificar si el archivo es .jpg
      const extension = archivo.name.split('.').pop().toLowerCase();
      if (extension !== "jpg") {
        errorComprobante.textContent = "El comprobante debe ser una imagen en formato JPG.";
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
  