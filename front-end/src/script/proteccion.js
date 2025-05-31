// Script para proteger las páginas privadas de empleados y admin
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const rol = parseInt(localStorage.getItem("rol"));

    // Si no hay token, redirigimos al login
    if (!token) {
        alert("No has iniciado sesión.");
        window.location.href = "/front-end/src/views/iniciosesion.html";
        return;
    }

    // Validamos rol según la página actual
    const pathname = window.location.pathname;

    if (pathname.includes("Menuadmin.html") && rol !== 1) {
        alert("Acceso denegado. Solo administradores.");
        window.location.href = "/front-end/src/views/MenuEmpleado.html";
    }

    if (pathname.includes("MenuEmpleado.html") && rol === 1) {
        // Opcional: los admins pueden acceder a todo, o redirigir si quieres
    }

    // Agregamos botón para cerrar sesión (si lo hay)
    const cerrarSesionBtn = document.getElementById("cerrarSesion");
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "/front-end/src/views/iniciosesion.html";
        });
    }
});
