const productos = {
    
    americano: { nombre: "Café americano", precio: 12 },
    capuchino: { nombre: "Capuchino", precio: 18 },
    te: { nombre: "Té", precio: 10 },
    sandwich: { nombre: "Sándwich", precio: 22 },

    
    espresso: { nombre: "Espresso", precio: 30 },
    latte: { nombre: "Latte", precio: 35 },
    americano2: { nombre: "Americano", precio: 35 },
    macchiato: { nombre: "Macchiato", precio: 45 },
    flatwhite: { nombre: "Flat White", precio: 45 },

    
    medialuna: { nombre: "Medialuna", precio: 20 },
    muffin: { nombre: "Muffin", precio: 25 },
    dona: { nombre: "Dona", precio: 35 },
    torta: { nombre: "Torta", precio: 45 },
    brownie: { nombre: "Brownie", precio: 40 },

    fresa: { nombre: "Smoothie de fresa", precio: 20 },
    mango: { nombre: "Smoothie de mango", precio: 25 },
    matcha: { nombre: "Smoothie de matcha", precio: 35 },

    lechealmendras: { nombre: "Leche de almendras", precio: 5 }
};

// "pedido" siempre representa el BORRADOR, nunca una venta.
let pedido = leerDatos("pedido", []);
if (!Array.isArray(pedido) || (pedido.length > 0 && !productosValidos(pedido))) {
    almacenamientoValido = false;
    mostrarMensaje("El borrador guardado no es válido. Revisa sus datos antes de continuar.");
    pedido = [];
}

const listaPedido = document.getElementById("lista-pedido");
const formulario = document.getElementById("formulario-pedido");
const buscador = document.getElementById("buscador");
const itemsCatalogo = document.querySelectorAll("#lista-productos li");

buscador.addEventListener("input", function () {
    const busqueda = buscador.value.trim().toLocaleLowerCase("es");
    let coincidencias = 0;
    for (const tarjeta of itemsCatalogo) {
        const nombre = tarjeta.querySelector("h3").textContent.toLocaleLowerCase("es");
        if (nombre.includes(busqueda)) {
            tarjeta.style.display = "";
            coincidencias++;
        } else {
            tarjeta.style.display = "none";
        }
    }
    document.getElementById("sin-resultados").hidden = coincidencias > 0;
});

function guardarYMostrar() {
    guardarDatos("pedido", pedido);
    mostrar();
}

function mostrar() {
    listaPedido.textContent = "";
    document.getElementById("pedido-vacio").hidden = pedido.length > 0;
    for (const item of pedido) {
        const fila = document.createElement("li");
        fila.className = "item-pedido";
        const nombre = document.createElement("h3");
        nombre.textContent = item.nombre;
        const importe = document.createElement("p");
        importe.textContent = dinero(item.precio) + " por unidad / Subtotal " + dinero(calcularTotal([item]));
        const controles = document.createElement("div");
        controles.className = "controles-cantidad";
        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = "cantidad-" + item.id;
        etiqueta.textContent = "Cantidad de " + item.nombre;
        const cantidad = document.createElement("input");
        cantidad.id = "cantidad-" + item.id;
        cantidad.type = "number";
        cantidad.min = "1";
        cantidad.step = "1";
        cantidad.required = true;
        cantidad.value = item.cantidad;
        cantidad.dataset.id = item.id;
        controles.appendChild(etiqueta);

        // Se crea el botón menos, el campo y luego los otros dos botones.
        for (const accion of ["menos", "mas", "quitar"]) {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.dataset.accion = accion;
            boton.dataset.id = item.id;
            if (accion === "menos") boton.textContent = "−";
            if (accion === "mas") boton.textContent = "+";
            if (accion === "quitar") {
                boton.textContent = "Quitar";
                boton.className = "boton-quitar";
            }
            boton.setAttribute("aria-label", accion + " " + item.nombre);
            controles.appendChild(boton);
            if (accion === "menos") controles.appendChild(cantidad);
        }
        fila.appendChild(nombre);
        fila.appendChild(importe);
        fila.appendChild(controles);
        listaPedido.appendChild(fila);
    }
    document.getElementById("total-pedido").textContent = dinero(calcularTotal(pedido));
}

function agregar(id) {
    const producto = productos[id];
    if (!producto) return;
    const existente = pedido.find(function (item) { return item.id === id; });
    if (existente) {
        existente.cantidad++;
    } else {
        pedido.push({ id: id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    guardarYMostrar();
}

for (const id in productos) {
    document.getElementById("agregar-" + id).addEventListener("click", function () {
        agregar(id);
    });
}

// Un manejador atiende los botones de todos los productos seleccionados.
listaPedido.addEventListener("click", function (evento) {
    const accion = evento.target.dataset.accion;
    const id = evento.target.dataset.id;
    if (!accion) return;
    const item = pedido.find(function (producto) { return producto.id === id; });
    if (!item) return;
    if (accion === "mas") item.cantidad++;
    if (accion === "menos") {
        if (item.cantidad > 1) item.cantidad--;
        else mostrarMensaje("La cantidad mínima es 1. Usa Quitar para eliminar el producto.");
    }
    if (accion === "quitar") {
        pedido = pedido.filter(function (producto) { return producto.id !== id; });
    }
    guardarYMostrar();
    // Mantiene el foco del teclado después de reconstruir los controles.
    const siguiente = listaPedido.querySelector('[data-accion="' + accion + '"][data-id="' + id + '"]');
    if (siguiente) siguiente.focus();
});

listaPedido.addEventListener("change", function (evento) {
    const campo = evento.target;
    if (campo.tagName !== "INPUT") return;
    const item = pedido.find(function (producto) { return producto.id === campo.dataset.id; });
    if (!item) return;
    const cantidad = Number(campo.value);
    if (!Number.isSafeInteger(cantidad) || cantidad < 1) {
        mostrarMensaje("Escribe una cantidad entera mayor o igual a 1.");
        campo.value = item.cantidad;
        return;
    }
    item.cantidad = cantidad;
    guardarYMostrar();
});

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!productosValidos(pedido)) {
        mostrarMensaje("Agrega productos con cantidades enteras mayores o iguales a 1.");
        return;
    }
    if (guardarDatos("pedido", pedido)) window.location.href = "resumenPedido.html";
});

// Al volver desde otra página (incluido el botón Atrás), recupera el borrador.
window.addEventListener("pageshow", function () {
    const guardado = leerDatos("pedido", []);
    if (Array.isArray(guardado) && (guardado.length === 0 || productosValidos(guardado))) {
        pedido = guardado;
        mostrar();
    }
});
mostrar();
