// Esperamos a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll("input");
  const usuarioInput = inputs[0]; // Primer input es usuario
  const claveInput = inputs[1];   // Segundo input es contraseña

  // Crear contenedor de mensaje dinámicamente
  let mensaje = document.createElement("p");
  form.appendChild(mensaje);

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir recarga

    const usuario = usuarioInput.value;
    const clave = claveInput.value;

    const usuarios = [
      { usuario: "admin", clave: "1234" },
      { usuario: "santiago", clave: "221510" },
      { usuario: "valentina", clave: "12345" },
      { usuario: "marlon", clave: "12345" },
    ];

    const usuarioValido = usuarios.find(
      (u) => u.usuario === usuario && u.clave === clave
    );

    if (usuarioValido) {  
      // Si las credenciales son correctas
      mensaje.style.color = "green";
      mensaje.textContent = `Bienvenido/a, ${usuarioValido.usuario}!`;

      // Redireccionar tras 1 segundo
      setTimeout(() => {
        // Esta es la redirección al archivo 'index.html' dentro de la carpeta 'Administrador'
        window.location.href = "Menuadmin.html"; // La ruta es relativa a tu ubicación
      }, 1000); // Redirige después de 1 segundo
    } else {
      // Si las credenciales no son correctas
      mensaje.style.color = "red";
      mensaje.textContent = "Usuario o contraseña incorrectos.";
    }
  });
});