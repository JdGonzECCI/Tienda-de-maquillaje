// Esta función realiza la búsqueda de una fórmula dermatológica según el código ingresado
function buscarFormula() {
    // Se obtiene el código desde el input, eliminando espacios
    const codigo = document.getElementById("codigoConsulta").value.trim();
    // Se consulta la fórmula almacenada en localStorage con ese código
    const data = localStorage.getItem("formula_" + codigo);

    // Se obtiene el contenedor donde se mostrará el resultado
    const resultado = document.getElementById("resultado");

    // Si el usuario no ingresó un código, se muestra un mensaje
    if (!codigo) {
        resultado.innerHTML = "<p>Ingresa un código válido.</p>";
        return;
    }

    // Si no existe una fórmula con ese código, se informa al usuario
    if (!data) {
        resultado.innerHTML = "<p>No se encontró la fórmula.</p>";
        return;
    }

    // Se convierte la información de la fórmula a objeto
    const formula = JSON.parse(data);
    // Se obtienen todos los productos guardados en localStorage
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Se inicia el HTML con el título de productos recomendados
    let html = `<h3><i class="bi bi-bag-heart"></i> Productos recomendados</h3>`;
    html += `<div class="contenedor-productos">`;

    // Se recorren los productos recomendados dentro de la fórmula
    formula.productos.forEach(id => {
        // Se busca el producto correspondiente en el catálogo
        const prod = productos.find(p => p.id == id);
        if (prod) {

            // Si existe, se agrega su información al HTML
            html += `
            <div class="producto">
                <img class="producto-imagen" src="${prod.imagen}" alt="${prod.titulo}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${prod.titulo}</h3>
                </div>
            </div>`;
        }
    });

    html += `</div>`;

    // Se agregan los comentarios del dermatólogo
    html += `
        <h3 style="margin-top:25px;"><i class="bi bi-chat-square-text"></i> Comentarios del dermatólogo</h3>
        <p class="comentarios-box">${formula.comentarios || "Sin comentarios."}</p>

        <button onclick="enviarFormulaAlCarrito('${codigo}')" 
                class="boton-carrito" 
                style="margin-top:20px; display:inline-block;">
            <i class="bi bi-cart-fill"></i> Enviar al carrito
        </button>
    `;

    // Finalmente, se muestra el HTML generado dentro del contenedor de resultados
    resultado.innerHTML = html;
}

/* ============================================================
   AGREGAR AL CARRITO LOS PRODUCTOS DE LA FORMULA
   Esta función se encarga de tomar los productos recomendados por el dermatólogo y agregarlos directamente al carrito.
   ============================================================ */
function enviarFormulaAlCarrito(codigo) {

    // Se obtiene nuevamente la fórmula desde localStorage
    const data = localStorage.getItem("formula_" + codigo);
    if (!data) return;

    // Se convierte la información en objeto
    const formula = JSON.parse(data);
    const productosCatalogo = JSON.parse(localStorage.getItem("productos")) || [];

    // Se obtiene el carrito actual desde localStorage
    let carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    // Se recorren los productos recomendados por la fórmula
    formula.productos.forEach(id => {
        // Se busca cada producto dentro del catálogo
        const prod = productosCatalogo.find(p => p.id == id);
        if (!prod) return;

        // Se verifica si el producto ya está en el carrito
        const existe = carrito.find(p => p.id == prod.id);

        // Si ya existe, se incrementa su cantidad
        if (existe) {
            existe.cantidad++;
        } else {
            // Si no existe, se agrega como nuevo producto al carrito
            carrito.push({
                id: prod.id,
                titulo: prod.titulo,
                precio: prod.precio,
                imagen: prod.imagen,
                cantidad: 1
            });
        }
    });

    // Se guarda el carrito actualizado en localStorage
    localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));

    // Se redirige al usuario a la página del carrito
    window.location.href = "Carrito.html";
}


