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

// Si ya había un pedido guardado, lo recupera; si no, empieza vacío por eso el ||
let pedido = JSON.parse(localStorage.getItem("pedido")) || [];

const buscador = document.getElementById("buscador");
const sinResultados = document.getElementById("sin-resultados");
const itemsCatalogo = document.querySelectorAll("#lista-productos li");
const listaPedido = document.getElementById("lista-pedido");
const totalPedido = document.getElementById("total-pedido");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formulario-pedido");


buscador.addEventListener("input", function () {
    const busqueda = buscador.value.trim();
    let coincidencias = 0;

    for (let i = 0; i < itemsCatalogo.length; i++) {
        const nombre = itemsCatalogo[i].querySelector("h3").textContent;

        if (nombre.includes(busqueda)) {
            itemsCatalogo[i].style.display = "";   
            coincidencias++;
        } else {
            itemsCatalogo[i].style.display = "none";
        }
    }

    // Por si nada coincide
    sinResultados.style.display = coincidencias > 0 ? "none" : "block";
});

function guardar() {
    localStorage.setItem("pedido", JSON.stringify(pedido));
}

function calcularTotal() {
    let total = 0;
    for (let i = 0; i < pedido.length; i++) {
        total += pedido[i].precio * pedido[i].cantidad;
    }
    return total;
}

function mostrarMensaje(texto) {
    mensaje.textContent = texto;
    setTimeout(function () {
        mensaje.textContent = "";
    }, 3000);
}

// Muestra el pedido actual
function mostrar() {
    let html = "";

    for (let i = 0; i < pedido.length; i++) {
        const item = pedido[i];
        const subtotal = item.precio * item.cantidad;

        html += `
            <div class="item-pedido">
                <h3>${item.nombre}</h3>
                <p>Q${item.precio.toFixed(2)} por unidad / Subtotal Q${subtotal.toFixed(2)}</p>
                <div class="controles">
                    <button type="button" data-accion="menos" data-id="${item.id}">-</button>
                    <span>${item.cantidad}</span>
                    <button type="button" data-accion="mas" data-id="${item.id}">+</button>
                    <button type="button" data-accion="quitar" data-id="${item.id}">Quitar</button>
                </div>
            </div>
        `;
    }

    listaPedido.innerHTML = html;
    totalPedido.textContent = "Q" + calcularTotal().toFixed(2);
}

// Agrega un producto o le suma 1 si ya estaba
function agregar(id) {
    const existente = pedido.find(item => item.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        pedido.push({
            id: id,
            nombre: productos[id].nombre,
            precio: productos[id].precio,
            cantidad: 1
        });
    }

    guardar();
    mostrar();
}


// Botones "Agregar" 

for (const id in productos) {
    document.getElementById("agregar-" + id).addEventListener("click", function () {
        agregar(id);
    });
}


// Botones +, - y Quitar 
// Estos botones se crean con Javascript, así que un solo click en la lista mata a todos

listaPedido.addEventListener("click", function (e) {
    const accion = e.target.dataset.accion;
    const id = e.target.dataset.id;

    if (!accion) return; 

    const item = pedido.find(item => item.id === id);

    if (accion === "mas") {
        item.cantidad++;
    }

    if (accion === "menos") {
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            mostrarMensaje("Oprime el botón de quitar para eliminar el producto");
        }
    }

    if (accion === "quitar") {
        pedido = pedido.filter(item => item.id !== id);
    }

    guardar();
    mostrar();
});


// Botón Continuar 


formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    //Evitar pedidos vacíos
    if (pedido.length === 0) {
        mostrarMensaje("Agrega al menos un producto");
        return;
    }

    //Verificar cantidades y precios
    for (const producto of pedido) {

        if (!Number.isInteger(producto.cantidad) ||
            producto.cantidad <= 0 ||
            !Number.isFinite(producto.precio) ||
            producto.precio < 0) {

            mostrarMensaje("El pedido contiene datos incorrectos");
            return;
        }
    }

    //Crear borrador del pedido
    const pedidoFinal = {
        productos: pedido.map(producto => ({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: producto.cantidad
        })),
        total: calcularTotal()
    };

    //Guardar borrador
    localStorage.setItem("pedidoFinal", JSON.stringify(pedidoFinal));

    //Abrir resumen
    window.location.href = "resumenPedido.html";
});



// Muestra lo guardado
mostrar();