const productos = {
    americano: { nombre: "Café americano", precio: 12 },
    capuchino: { nombre: "Capuchino", precio: 18 },
    te: { nombre: "Té", precio: 10 },
    sandwich: { nombre: "Sándwich", precio: 22 }
};

// Si ya había un pedido guardado, lo recupera; si no, empieza vacío por eso el ||
let pedido = JSON.parse(localStorage.getItem("pedido")) || [];

const listaPedido = document.getElementById("lista-pedido");
const totalPedido = document.getElementById("total-pedido");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formulario-pedido");


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

document.getElementById("agregar-americano").addEventListener("click", function () {
    agregar("americano");
});

document.getElementById("agregar-capuchino").addEventListener("click", function () {
    agregar("capuchino");
});

document.getElementById("agregar-te").addEventListener("click", function () {
    agregar("te");
});

document.getElementById("agregar-sandwich").addEventListener("click", function () {
    agregar("sandwich");
});


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
    e.preventDefault(); // evita que la página se recargue

    if (pedido.length === 0) {
        mostrarMensaje("Agrega al menos un producto");
        return;
    }

    const pedidoFinal = {
        productos: pedido,
        total: calcularTotal(),
        fecha: new Date().toLocaleString("es-GT")
    };

    localStorage.setItem("pedidoFinal", JSON.stringify(pedidoFinal));

    
    window.location.href = "detallepedido.html";
});


// Muestra lo guardado
mostrar();