const form = document.getElementById("form-crear-producto");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // recuperar campos
    const titulo = document.getElementById("titulo").value;
    const precio = parseInt(document.getElementById("precio").value);
    const imagen = document.getElementById("imagen").value;
    const categoria = document.getElementById("categoria").value;

    // crear ID único
    const id = categoria + "-" + Date.now();

    // nuevo producto
    const nuevoProducto = {
        id: id,
        titulo: titulo,
        imagen: imagen,
        precio: precio,
        categoria: {
            nombre: categoria,
            id: categoria
        }
    };

    // obtener productos guardados previamente
    let productosNuevos = JSON.parse(localStorage.getItem("productos-nuevos")) || [];

    // agregar al array
    productosNuevos.push(nuevoProducto);

    // guardar en localStorage
    localStorage.setItem("productos-nuevos", JSON.stringify(productosNuevos));

    alert("Producto creado con éxito");
    form.reset();
});
