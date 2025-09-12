document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const contenedor = document.getElementById("contenedorOrdenes");
  const ventasDelDia = document.getElementById("ventasDelDia");

  fetch("http://localhost:4000/api/ordenes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success && Array.isArray(data.data)) {
        let totalVentas = 0;

        contenedor.innerHTML = data.data
          .map((orden) => {
            const fecha = new Date(orden.createdAt);
            const fechaStr = fecha.toLocaleDateString();
            const horaStr = fecha.toLocaleTimeString("es-CO", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            // Calcular total de esta orden
            const totalOrden = orden.productos.reduce((acc, prod) => {
              return (
                acc + parseFloat(prod.precio) * prod.orden_producto.cantidad
              );
            }, 0);

            totalVentas += totalOrden;

            const productosHTML = orden.productos
              .map((prod) => {
                return `<li>
                <p><strong>Producto:</strong> ${prod.nombre_producto}</p>
                <p><strong>Precio:</strong>  $${parseFloat(
                  prod.precio
                ).toLocaleString("es-CO")}</p>
                <p><strong>Cantidad:</strong> ${
                  prod.orden_producto.cantidad
                }</p>
                </li>`;
              })
              .join("");

            return `
              <div class="card-orden">
                <div class="orden-header">
                  <span class="orden-fecha">${fechaStr}</span>
                  <span class="orden-hora">${horaStr}</span>
                </div>
                <div class="orden-cliente">
                  <p><strong>Cliente:</strong> ${orden.nombre}</p>
                  <p><strong>Teléfono:</strong> ${orden.telefono}</p>
                  <p><strong>Dirección:</strong> ${orden.direccion}</p>
                </div>
                <div class="orden-metodo">
                  <p><strong>Método de pago:</strong> ${
                    orden.metodoPago?.nombre_metodo_pago || "No especificado"
                  }</p>
                </div>
                <div class="orden-productos">
                  <h5>Productos:</h5>
                  <ul>${productosHTML}</ul>
                </div>
                <p><strong>Total de la orden:</strong> $${totalOrden.toLocaleString(
                  "es-CO"
                )}</p>
              </div>
            `;
          })
          .join("");

        ventasDelDia.innerHTML = `<h3>Ventas del día: $${totalVentas.toLocaleString(
          "es-CO"
        )}</h3>`;
      } else {
        contenedor.innerHTML = "<p>No hay órdenes disponibles.</p>";
        ventasDelDia.innerHTML = `<h3>Ventas del día: $0.00</h3>`;
      }
    })
    .catch((error) => {
      console.error("Error al cargar órdenes:", error);
      contenedor.innerHTML = "<p>Error al cargar las órdenes.</p>";
      ventasDelDia.innerHTML = `<h3>Ventas del día: $0.00</h3>`;
    });
});
