const inputNombre = document.getElementById("nombreCompleto");
const errorNombre = document.getElementById("errorNombreCompleto");

if (inputNombre.value.trim() === "") {
  inputNombre.classList.add("error"); // Esto ya funciona con el CSS corregido
  errorNombre.textContent = "Este campo es obligatorio";
} else {
  inputNombre.classList.remove("error");
  errorNombre.textContent = "";
}
