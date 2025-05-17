// Esperamos a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll("input");
  const usuarioInput = inputs[0];
  const claveInput = inputs[1];

  let mensaje = document.createElement("p");
  form.appendChild(mensaje);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

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
      mensaje.style.color = "green";
      mensaje.textContent = `Bienvenido/a, ${usuarioValido.usuario}!`;

      setTimeout(() => {
        // Redireccionar según el usuario
        switch (usuarioValido.usuario) {
          case "admin":
            window.location.href = "Menuadmin.html";
            break;
          case "santiago":
            window.location.href = "/front-end/src/views/MenuEmpleado.html";
            break;
          case "valentina":
            window.location.href = "/front-end/src/views/MenuEmpleado.html";
            break;
          case "marlon":
            window.location.href = "/front-end/src/views/MenuEmpleado.html";
            break;
        }
      }, 1000);
    } else {
      mensaje.style.color = "red";
      mensaje.textContent = "Usuario o contraseña incorrectos.";
    }
  });
});
