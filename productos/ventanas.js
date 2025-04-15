function detalleProductoOpen() {
  const modal = document.getElementById("DetalleProducto");
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error("No se encontró el elemento con ID 'DetalleProducto'");
  }
}

function detalleProductoClose() {
  const modal = document.getElementById("DetalleProducto");
  if (modal) {
    modal.style.display = "none";
  }
}
