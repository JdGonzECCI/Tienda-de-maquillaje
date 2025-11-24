// 🔥 MAIN.JS — MOSTRAR JSON + NUEVOS, PERO SOLO EDITAR/ELIMINAR LOS NUEVOS

let productos = [];
let productosJSON = [];

// --------------------------------------------------------------
// 1) CARGA DEL JSON ORIGINAL (SOLO LECTURA)
// --------------------------------------------------------------

fetch("./productos.json")
    .then(response => response.json())
    .then(data => {

        productosJSON = data; // ESTO NO SE MODIFICA NUNCA

        // Cargar productos creados por usuario
        const productosNuevos = JSON.parse(localStorage.getItem("productos-nuevos")) || [];

        // Combinar: JSON + NUEVOS
        productos = [...productosJSON, ...productosNuevos];

        // Guardar SOLO PARA VISUALIZAR en otras páginas (sin modificar JSON)
        localStorage.setItem("productos", JSON.stringify(productos));

        cargarProductos(productos);
    });

// --------------------------------------------------------------
// 2) ELEMENTOS DEL DOM
// --------------------------------------------------------------

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// --------------------------------------------------------------
// 3) CARGAR PRODUCTOS EN LA PÁGINA
// --------------------------------------------------------------

function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

// --------------------------------------------------------------
// 4) FILTRO POR CATEGORÍA
// --------------------------------------------------------------

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(btn => btn.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {

            const nombreCategoria =
                e.currentTarget.querySelector('span')
                    ? e.currentTarget.querySelector('span').innerText
                    : e.currentTarget.innerText;

            tituloPrincipal.innerText = nombreCategoria;

            const productosFiltrados = productos.filter(
                producto => producto.categoria.id === e.currentTarget.id
            );

            cargarProductos(productosFiltrados);

        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

// --------------------------------------------------------------
// 5) AGREGAR AL CARRITO
// --------------------------------------------------------------

let productosEnCarrito = [];
const carritoLS = JSON.parse(localStorage.getItem("productos-en-carrito"));

if (carritoLS) {
    productosEnCarrito = carritoLS;
    actualizarNumerito();
}

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {

        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;

    } else {

        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    const nuevoNumerito = productosEnCarrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}
