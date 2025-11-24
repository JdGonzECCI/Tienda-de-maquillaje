// Se declara un arreglo vacío donde se almacenarán los productos del JSON.
let productos = [];

// Se obtiene el archivo productos.json y se convierte su contenido a formato JSON.
// Luego se asignan los datos al arreglo 'productos' y se cargan en pantalla.
fetch("./productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;

        // 🔥 LÍNEA AGREGADA PARA FORMULADERMATOLOGO
        localStorage.setItem("productos", JSON.stringify(productos));

        cargarProductos(productos);
    });

// Se seleccionan distintos elementos del DOM que serán utilizados en la aplicación.
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Cada botón de categoría cierra el menú lateral cuando es presionado.
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

// Esta función recibe un listado de productos y los renderiza en el contenedor principal.
function cargarProductos(productosElegidos) {

    // Limpia el contenedor antes de cargar nuevos productos.
    contenedorProductos.innerHTML = "";

    // Se recorre la lista y se crea un elemento HTML para cada producto.
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

        // Se agrega el producto al contenedor.
        contenedorProductos.append(div);
    });

    // Se actualizan los botones de agregar ya que se regeneran en cada carga.
    actualizarBotonesAgregar();
}

// Se asignan eventos a los botones de categorías para filtrar productos.
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        // Se remueve la clase 'active' de todas las categorías y se aplica a la seleccionada.
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        // Si la categoría no es "todos", se filtran los productos.
        if (e.currentTarget.id != "todos") {

            // Se obtiene el nombre visible de la categoría (del span o del texto del botón).
            const nombreCategoria = e.currentTarget.querySelector('span')
                ? e.currentTarget.querySelector('span').innerText
                : e.currentTarget.innerText;

            // Se actualiza el título principal con el nombre de la categoría.
            tituloPrincipal.innerText = nombreCategoria;

            // Se filtran los productos según la categoría seleccionada.
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);

        } else {
            // Si es "todos", se carga la lista completa.
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

// Esta función agrega los eventos "click" a los botones de agregar producto.
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

// Se obtiene el carrito almacenado en LocalStorage si existe.
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

// Esta función se ejecuta al presionar el botón "Agregar" en un producto.
function agregarAlCarrito(e) {

    // Se muestra una notificación cuando el producto es agregado.
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
        },
        onClick: function () { }
    }).showToast();

    // Se obtiene el id del producto desde el botón presionado.
    const idBoton = e.currentTarget.id;

    // Se busca el producto correspondiente.
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    // Si el producto ya existe en el carrito, se incrementa su cantidad.
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        // Si es la primera vez que se agrega, se inicializa su cantidad.
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    // Se actualiza el contador visual del carrito.
    actualizarNumerito();

    // Se guarda el carrito en LocalStorage.
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Actualiza el numerito del carrito sumando las cantidades de todos los productos.
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}

