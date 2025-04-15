function detalleProductoOpen() {
  const ventana = document.getElementById("DetalleProducto");
  if (ventana) {
    ventana.style.display = "block";
  } else {
    console.error("No se encontró el elemento con ID 'DetalleProducto'");
  }
}

function detalleProductoClose() {
  const ventana = document.getElementById("DetalleProducto");
  if (ventana) {
    ventana.style.display = "none";
  }
}
