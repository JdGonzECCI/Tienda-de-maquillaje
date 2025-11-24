document.addEventListener("DOMContentLoaded", () => {

    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
    const contenedorCarritoProductos = document.querySelector("#carrito-productos");
    const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
    const contenedorCarritoComprado = document.querySelector("#carrito-comprado");

    let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
    const botonComprar = document.querySelector("#carrito-acciones-comprar");
    const totalHTML = document.querySelector("#total");

    // Modal
    const modalPago = document.getElementById("modalPago");
    const metodoPago = document.getElementById("metodoPago");
    const pagoTarjeta = document.getElementById("pagoTarjeta");
    const pagoPayPal = document.getElementById("pagoPayPal");
    const btnProcesarPago = document.getElementById("btnProcesarPago");
    const btnCerrarPago = document.getElementById("btnCerrarPago");

    const numTarjeta = document.getElementById("numTarjeta");
    const expTarjeta = document.getElementById("expTarjeta");
    const cvvTarjeta = document.getElementById("cvvTarjeta");
    const nombreTarjeta = document.getElementById("nombreTarjeta");

    const correoPaypal = document.getElementById("correoPaypal");
    const passPaypal = document.getElementById("passPaypal");

    // Ocultar modal al inicio
    modalPago.classList.add("hidden");

    // ============================================================
    // CAMPOS NUMÉRICOS
    // ============================================================

    numTarjeta.addEventListener("input", () => {
        numTarjeta.value = numTarjeta.value.replace(/\D/g, "").slice(0, 16);
    });

    cvvTarjeta.addEventListener("input", () => {
        cvvTarjeta.value = cvvTarjeta.value.replace(/\D/g, "").slice(0, 3);
    });

    // ============================================================
    // CARGAR PRODUCTOS
    // ============================================================

    function cargarProductosCarrito() {

        if (productosEnCarrito.length === 0) {
            contenedorCarritoVacio.classList.remove("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.add("disabled");
            actualizarTotal();
            return;
        }

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");

            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}">
                    <i class="bi bi-trash-fill"></i>
                </button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    }

    cargarProductosCarrito();

    // ============================================================
    // ELIMINAR PRODUCTO
    // ============================================================

    function actualizarBotonesEliminar() {
        botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", eliminarDelCarrito);
        });
    }

    function eliminarDelCarrito(e) {
        const id = e.currentTarget.id;

        productosEnCarrito = productosEnCarrito.filter(p => p.id !== id);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        cargarProductosCarrito();

        Toastify({
            text: "Producto eliminado",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: { background: "linear-gradient(to right, #4b33a8, #785ce9)" }
        }).showToast();
    }

    // ============================================================
    // VACIAR CARRITO
    // ============================================================

    botonVaciar.addEventListener("click", () => {
        Swal.fire({
            icon: "question",
            title: "¿Vaciar carrito?",
            showCancelButton: true,
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                productosEnCarrito = [];
                localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                cargarProductosCarrito();
            }
        });
    });

    // ============================================================
    // TOTAL
    // ============================================================

    function actualizarTotal() {
        const totalCalculado = productosEnCarrito.reduce(
            (acc, producto) => acc + producto.precio * producto.cantidad,
            0
        );

        totalHTML.innerText = `$${totalCalculado}`;
    }

    // ============================================================
    // ABRIR MODAL
    // ============================================================

    botonComprar.addEventListener("click", () => {
        modalPago.classList.remove("hidden");
    });

    btnCerrarPago.addEventListener("click", () => {
        modalPago.classList.add("hidden");
    });

    // ============================================================
    // CAMBIO DE MÉTODO
    // ============================================================

    metodoPago.addEventListener("change", () => {
        if (metodoPago.value === "tarjeta") {
            pagoTarjeta.classList.remove("hidden");
            pagoPayPal.classList.add("hidden");
        } else {
            pagoPayPal.classList.remove("hidden");
            pagoTarjeta.classList.add("hidden");
        }
    });

    // ============================================================
    // PROCESAR PAGO
    // ============================================================

    btnProcesarPago.addEventListener("click", () => {

        if (metodoPago.value === "") {
            Swal.fire({ icon: "error", title: "Selecciona un método de pago" });
            return;
        }

        // ---------------- TARJETA ----------------
        if (metodoPago.value === "tarjeta") {

            if (numTarjeta.value.length !== 16) {
                Swal.fire({ icon: "error", title: "Número de tarjeta inválido (16 dígitos)" });
                return;
            }

            if (!expTarjeta.value) {
                Swal.fire({ icon: "error", title: "Selecciona la fecha de expiración" });
                return;
            }

            if (cvvTarjeta.value.length !== 3) {
                Swal.fire({ icon: "error", title: "CVV inválido (3 dígitos)" });
                return;
            }

            if (nombreTarjeta.value.trim().length < 3) {
                Swal.fire({ icon: "error", title: "Nombre en tarjeta inválido" });
                return;
            }
        }

        // ---------------- PAYPAL ----------------
        if (metodoPago.value === "paypal") {

            const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailReg.test(correoPaypal.value)) {
                Swal.fire({ icon: "error", title: "Correo PayPal inválido" });
                return;
            }

            if (passPaypal.value.length < 6) {
                Swal.fire({ icon: "error", title: "La contraseña debe tener al menos 6 caracteres" });
                return;
            }
        }

        // ---------------- EXITO ----------------

        Swal.fire({
            icon: "success",
            title: "Pago realizado con éxito",
            confirmButtonText: "Aceptar"
        }).then(() => {
            productosEnCarrito = [];
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            window.location.href = "index.html"; // REDIRECCIÓN
        });

    });

});

