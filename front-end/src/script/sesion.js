/* // Esperamos a que cargue el DOM
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
 */



// Esperamos a que cargue el DOM antes de acceder al formulario
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const inputs = document.querySelectorAll("input");
  const usuarioInput = inputs[0];
  const claveInput = inputs[1];

  let mensaje = document.createElement("p");
  form.appendChild(mensaje);

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitamos que el formulario recargue la página

    const nombre_usuario = usuarioInput.value.trim();
    const contrasena = claveInput.value.trim();

    try {
      // Consumimos el API para login
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre_usuario, contrasena }),
      });

      const result = await response.json();

      if (result.success) {
        const { token, rol, nombre } = result.data;

        // Guardamos los datos en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", nombre);
        localStorage.setItem("rol", rol);

        mensaje.style.color = "green";
        mensaje.textContent = `Bienvenido/a, ${nombre}! Redirigiendo...`;

        // Redirigimos según el rol
        setTimeout(() => {
          if (rol === 1) {
            window.location.href = "/front-end/src/views/Menuadmin.html";
          } else {
            window.location.href = "/front-end/src/views/MenuEmpleado.html";
          }
        }, 1000);
      } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Usuario o contraseña incorrectos.";
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      mensaje.style.color = "red";
      mensaje.textContent = "Error del servidor. Intenta más tarde.";
    }
  });
});
