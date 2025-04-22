document.getElementById("boton-carrito").addEventListener("click", function () {
  //se ejecuta el evento click
  //mostrara esta funcion
  document.getElementById("carritoPanel").style.display = "block"; //se meustra el panel de style
});

function cerrarCarrito() {
  document.getElementById("carritoPanel").style.display = "none";
}

//funcion que agrega un nuevo producto al carrito

const carrito = [];
let total = 0;

function agregarAlCarrito(nombre, idCantidad, precio) {
  //recibe el nombre del prodcuto, el id del contador y el precio

  //cantidad va a tener el valor que tiene el contador gracias a textcontent y al id que tenga
  const cantidad = parseInt(document.getElementById(idCantidad).textContent);

  //find es un metodo que busca el primer elemento de la lista del carrito que si cumpla con las condiciones
  //existente busca si el producto ya existe en el carrito
  const existente = carrito.find((item) => item.nombre === nombre);

  //si existe ya el producto en el carrito, actualiza la cantidad y el precio
  if (existente) {
    //si encuentra algo
    existente.cantidad += cantidad;
    existente.total += cantidad * precio;
  }
  //si no esta en el carrito lo agrega como un nuevo objeto con nombre, cantidad y subtotal
  else {
    carrito.push({
      nombre,
      cantidad,
      total: cantidad * precio,
    });
  }

  //actualizar el total de todo el carrito
  total += cantidad * precio;
  actualizarCarrito();
}

//esta actualizara el carrito cada que se agregue un nuevo producto
function actualizarCarrito() {
  const contenedor = document.getElementById("lista-carrito");
  contenedor.innerHTML = ""; //limpia la lista del carrito borra todo el contenido del html dentro del div

  carrito.forEach((item) => {
    //el forEach ejecuta la funcion una vez por cada elemento del carrito

    const div = document.createElement("div"); //crea un nuevo div para un nuevo producto

    //le agrega contenido al div
    div.textContent = `${item.nombre} Cantidad:${item.cantidad} -${item.total}`;
    contenedor.appendChild(div);
  });

  document.getElementById("totalCarrito").textContent = total; //le pasa el nuevo precio
}

//al darle realizar pedido

function realizarPedido() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
}
