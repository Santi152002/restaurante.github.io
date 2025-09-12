//para ventana flotante
function detalleProductoOpen(id) {
  const ventana = document.getElementById(id);
  if (ventana) {
    ventana.style.display = "block";
  } else {
    console.error("No se encontró el elemento con ID " + id);
  }
}

function detalleProductoClose(idVentana, idContador) {
  const ventana = document.getElementById(idVentana);
  if (ventana) {
    ventana.style.display = "none";
  }

  // Reiniciar contador al cerrar la ventana
  contadores[idContador] = 1;
  const valor = document.getElementById(idContador);
  if (valor) {
    valor.textContent = "1";
  }
}

//para el contador

let contadores = {}; //guarda mas id

function positivo(id) {
  if (!contadores[id]) {
    contadores[id] = 1; //por si el id es diferente lo inicia en 1
  }

  contadores[id]++; //incrementa de 1
  const valor = document.getElementById(id);
  if (valor) {
    //se pone condicion por si el valor es null
    valor.textContent = contadores[id]; //actualizo el valor
  }
}

function negativo(id) {
  if (!contadores[id]) {
    contadores[id] = 1; //por si el id es diferente lo inicia en 1
  }

  if (contadores[id] > 0) {
    contadores[id]--; //incrementa de 1
  }

  const valor = document.getElementById(id);
  if (valor) {
    //se pone condicion por si el valor es null
    valor.textContent = contadores[id]; //actualizo el valor
  }
}
