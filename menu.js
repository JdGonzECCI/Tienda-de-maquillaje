// Se selecciona el botón encargado de abrir el menú lateral.
const openMenu = document.querySelector("#open-menu");

// Se selecciona el botón encargado de cerrar el menú lateral.
const closeMenu = document.querySelector("#close-menu");

// Se selecciona el elemento <aside>, que representa el menú lateral.
const aside = document.querySelector("aside");

// Cuando el usuario hace clic en el botón de abrir menú, se agrega la clase que hace visible el menú lateral.
openMenu.addEventListener("click", () => {
    aside.classList.add("aside-visible");
});

// Cuando el usuario hace clic en el botón de cerrar menú, se elimina la clase que hace visible el menú lateral.
closeMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
});
