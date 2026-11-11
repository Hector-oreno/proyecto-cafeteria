// Catálogo fijo de productos.
const productos = [
    {
        id: 1,
        nombre: "Café americano",
        categoria: "Bebida caliente",
        precio: 12
    },
    {
        id: 2,
        nombre: "Capuchino",
        categoria: "Bebida caliente",
        precio: 18
    },
    {
        id: 3,
        nombre: "Té",
        categoria: "Bebida caliente",
        precio: 10
    },
    {
        id: 4,
        nombre: "Sándwich",
        categoria: "Alimento",
        precio: 22
    }
];

// Busca en el HTML la lista donde aparecerán los productos.
const listaProductos = document.getElementById("lista-productos");

// Crea los elementos del catálogo.
function mostrarProductos() {
    // Limpia la lista para no repetir las tarjetas.
    listaProductos.textContent = "";

    for (const producto of productos) {
        const elemento = document.createElement("li");

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const categoria = document.createElement("p");
        categoria.textContent = producto.categoria;

        const precio = document.createElement("p");
        precio.textContent = "Q" + producto.precio.toFixed(2);

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Agregar";

        elemento.appendChild(nombre);
        elemento.appendChild(categoria);
        elemento.appendChild(precio);
        elemento.appendChild(boton);

        listaProductos.appendChild(elemento);
    }
}

// Ejecuta la función al cargar este archivo.
mostrarProductos();