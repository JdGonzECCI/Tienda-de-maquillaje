// =======================================
//     SOLO EDITA / ELIMINA PRODUCTOS NUEVOS
// =======================================

// Productos creados por usuario
let productosNuevos = JSON.parse(localStorage.getItem("productos-nuevos")) || [];

// Selección del cuerpo de la tabla
const tablaBody = document.querySelector("#tabla-productos-body");

// Renderizar productos creados por usuario
function cargarTabla() {
    tablaBody.innerHTML = "";

    if (productosNuevos.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay productos para modificar</td></tr>`;
        return;
    }

    productosNuevos.forEach((prod) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><img src="${prod.imagen}" alt="${prod.titulo}"></td>
            <td>${prod.titulo}</td>
            <td>$${prod.precio}</td>
            <td>${prod.categoria.id}</td>
            <td>
                <button class="btn-accion btn-editar" data-id="${prod.id}">Editar</button>
                <button class="btn-accion btn-eliminar" data-id="${prod.id}">Eliminar</button>
            </td>
        `;

        tablaBody.append(tr);
    });

    activarBotones();
}

cargarTabla();

// Funcionalidad de editar y eliminar
function activarBotones() {
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", editarProducto);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", eliminarProducto);
    });
}

// =======================================
//             EDITAR PRODUCTO
// =======================================
function editarProducto(e) {
    const id = e.target.dataset.id;
    const producto = productosNuevos.find(p => p.id === id);

    if (!producto) return alert("No se puede editar este producto.");

    const nuevoTitulo = prompt("Nuevo título:", producto.titulo);
    if (!nuevoTitulo) return;

    const nuevoPrecio = prompt("Nuevo precio:", producto.precio);
    if (!nuevoPrecio) return;

    const nuevaImagen = prompt("Nueva URL de imagen:", producto.imagen);
    if (!nuevaImagen) return;

    const nuevaCategoria = prompt(
        "Nueva categoría (higiene, maquillaje, cuidadoPiel, perfumeria, cuidadoCabello):",
        producto.categoria.id
    );
    if (!nuevaCategoria) return;

    producto.titulo = nuevoTitulo;
    producto.precio = Number(nuevoPrecio);
    producto.imagen = nuevaImagen;
    producto.categoria.id = nuevaCategoria;

    // Guardar cambios SOLO en productos nuevos
    localStorage.setItem("productos-nuevos", JSON.stringify(productosNuevos));

    // Volver a generar listado total para las otras páginas
    actualizarProductosGlobales();

    cargarTabla();
}

// =======================================
//             ELIMINAR PRODUCTO
// =======================================
function eliminarProducto(e) {
    const id = e.target.dataset.id;

    if (!confirm("¿Seguro que deseas borrar este producto?")) return;

    productosNuevos = productosNuevos.filter(p => p.id !== id);

    localStorage.setItem("productos-nuevos", JSON.stringify(productosNuevos));

    // Actualizar para el index
    actualizarProductosGlobales();

    cargarTabla();
}

// ======================================================
//     🔥 Actualiza el localStorage general para index
// ======================================================
async function actualizarProductosGlobales() {
    const productosJSON = await fetch("./productos.json").then(r => r.json());
    const productosTotales = [...productosJSON, ...productosNuevos];

    localStorage.setItem("productos", JSON.stringify(productosTotales));
}
