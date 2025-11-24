// =================================
// Helpers: obtención de productos
// =================================
// Esta función obtiene la lista de productos desde el localStorage. Si no hay datos, entonces los carga desde un archivo JSON y los almacena localmente para reutilizarlos.
async function obtenerProductos() {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Si los productos no existen, el sistema intenta cargarlos desde productos.json
    if (!productos || productos.length === 0) {
        try {
            const resp = await fetch("./productos.json");
            if (resp.ok) {
                // Si la carga es exitosa, la información se guarda en localStorage
                productos = await resp.json();
                localStorage.setItem("productos", JSON.stringify(productos));
            } else {
                console.error("No se pudo cargar productos.json:", resp.status);
                productos = [];
            }
        } catch (err) {
            // Si ocurre un error en la petición, se reporta y se continúa con un arreglo vacío
            console.error("Error fetch productos.json:", err);
            productos = [];
        }
    }

    return productos;
}


// ===================================================
// Renderización de productos (solo imagen y nombre)
// ===================================================
// Esta función muestra los productos en pantalla, permitiendo al usuario elegir cuáles agregará a su fórmula. Filtra por categoría si así se solicita.
async function cargarProductosParaFormula(categoria = "todos") {
    const productos = await obtenerProductos();

    // El sistema identifica el contenedor donde se deben mostrar los productos
    const contenedor =
        document.getElementById("contenedorProductosFormula") ||
        document.getElementById("contenedor-productos");

    if (!contenedor) {
        console.error("No existe el contenedor para productos en fórmula.");
        return;
    }

    contenedor.innerHTML = "";

    // Filtrado opcional por categoría
    let filtrados = productos;
    if (categoria !== "todos") {
        filtrados = productos.filter(
            p => p.categoria && p.categoria.id === categoria
        );
    }

    // Se construye visualmente cada producto
    filtrados.forEach(prod => {
        const div = document.createElement("div");
        div.classList.add("producto");

        // Se agrega la imagen, el título y un checkbox para poder seleccionar el producto
        div.innerHTML = `
            <img class="producto-imagen" src="${prod.imagen}" alt="${escapeHtml(prod.titulo)}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${escapeHtml(prod.titulo)}</h3>

                <label style="margin-top:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" class="checkbox-producto" value="${prod.id}">
                    <span style="font-size:0.95rem;">Agregar a fórmula</span>
                </label>
            </div>
        `;

        contenedor.appendChild(div);
    });
}

// Esta función protege ciertos textos para evitar inyección de código
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================
// Filtros
// ========================
// Esta función activa los botones de categorías, permitiendo filtrar productos al hacer clic en cada categoría.
function activarBotonesCategoriasFormula() {
    const botones = document.querySelectorAll(".filtro-btn, .boton-categoria-formula");

    botones.forEach(boton => {
        boton.addEventListener("click", async () => {

            // El sistema resalta solo el botón seleccionado
            botones.forEach(b => b.classList.remove("active"));
            boton.classList.add("active");

            // Se actualiza la vista de productos según la categoría seleccionada
            const categoria = boton.dataset.categoria;
            await cargarProductosParaFormula(categoria);
        });
    });
}


// =============================
// Guardado de fórmula
// =============================
// Esta función registra una fórmula seleccionando los productos marcados y guardándolos en localStorage bajo un código único generado aleatoriamente.
function guardarFormula() {

    // Se obtiene la lista de productos marcados por el usuario
    const seleccionados = [...document.querySelectorAll(".checkbox-producto:checked")]
        .map(chk => chk.value);

    // El sistema toma los comentarios adicionales, si los hay
    const comentarios =
        document.getElementById("comentariosFormula")?.value ||
        document.getElementById("notasFormula")?.value ||
        "";

    // Validación: se exige al menos un producto
   	if (seleccionados.length === 0) {
        alert("Debe seleccionar al menos un producto.");
        return;
    }

    // Código aleatorio único para identificar la fórmula creada
    const codigo = Math.floor(1000000000 + Math.random() * 9000000000);

    // Se construye la estructura de la fórmula con sus datos
    const formula = {
        productos: seleccionados,
        comentarios: comentarios
    };

    // La fórmula se guarda en localStorage
    localStorage.setItem("formula_" + codigo, JSON.stringify(formula));

    // El sistema muestra el código generado en pantalla o por alerta
    const salida = document.getElementById("codigoGenerado") || document.getElementById("codigoFormula");
    if (salida) {
        salida.innerHTML = `Fórmula guardada. Código: <span style="color:var(--clr-main);">${codigo}</span>`;
    } else {
        alert("Fórmula guardada. Código: " + codigo);
    }
}


// ==================================
// Inicialización del sistema
// ==================================
// Cuando la página termina de cargar, se cargan los productos, se activan los filtros y se configura el guardado.
document.addEventListener("DOMContentLoaded", () => {

    cargarProductosParaFormula("todos");
    activarBotonesCategoriasFormula();

    // Configura el formulario para guardar la fórmula sin recargar la página
    const form = document.getElementById("formFormula");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarFormula();
        });
    }
});

