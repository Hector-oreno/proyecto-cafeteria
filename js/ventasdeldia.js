const fecha = document.getElementById("fecha");
const dineroVentas = document.getElementById("VR");
const pedidosConfirmados = document.getElementById("PC");
const tablaPedidos = document.getElementById("tabla-pedidos");


//Bloque Recuperar Pedidos de LocalStorage

let pedidosRecuperados = [];

try {
    const pedidosGuardados = localStorage.getItem("pedidosCafe");

    //Si hay pedidos guardados, convertirlos a un array
    if (pedidosGuardados) {
        const datos = JSON.parse(pedidosGuardados);

        //Verificar que los datos sean un array
        if (Array.isArray(datos)) {
            pedidosRecuperados = datos;
        }
    }

} catch (error) {
    console.error("Error al recuperar los pedidos:", error);
}


//Bloque Funciones de fecha
function fechaAClave(texto) {
    const partes = String(texto).split(",")[0].trim().split("/");

    if (partes.length !== 3) {
        return "";
    }

    return partes[2] + "-" + partes[1].padStart(2, "0") + "-" + partes[0].padStart(2, "0");
}

// Fecha de hoy en formato "2026-11-18", usando la hora local del dispositivo
function fechaDeHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return hoy.getFullYear() + "-" + mes + "-" + dia;
}


//Bloque Mostrar las ventas de una fecha

function mostrarVentas(fechaElegida) {

    //Vaciar la tabla antes de volver a llenarla
    tablaPedidos.textContent = "";

    let totalVentas = 0;
    let totalPedidos = 0;

    pedidosRecuperados.forEach(pedido => {

        //Comprobar que el pedido tenga fecha
        if (!pedido || !pedido.fecha) {
            return;
        }

        //Saltar los pedidos de otras fechas
        if (fechaAClave(pedido.fecha) !== fechaElegida) {
            return;
        }

        //Verificar que el pedido tenga productos
        if (!Array.isArray(pedido.productos) ||
            pedido.productos.length === 0) {
            return;
        }

        //Calcular unidades y total del pedido
        let unidades = 0;
        let total = 0;
        let pedidoValido = true;

        pedido.productos.forEach(producto => {

            const cantidad = Number(producto.cantidad);
            const precio = Number(producto.precio);

            //Evitar cantidades o precios incorrectos
            if (!Number.isInteger(cantidad) ||
                cantidad <= 0 ||
                !Number.isFinite(precio) ||
                precio < 0) {

                pedidoValido = false;
                return;
            }

            unidades += cantidad;
            total += precio * cantidad;

        });

        //No mostrar pedidos con datos inválidos
        if (!pedidoValido) {
            return;
        }

        //Fila de la tabla
        let newTablatr = document.createElement("tr");
        tablaPedidos.appendChild(newTablatr);

        //Número de pedido
        let newtd = document.createElement("td");
        newTablatr.appendChild(newtd);
        newtd.textContent = `#${String(pedido.numero).padStart(3, "0")}`;

        //Hora
        let newtdhora = document.createElement("td");
        newTablatr.appendChild(newtdhora);
        newtdhora.textContent = pedido.hora;

        //Unidades
        let newtdUnidades = document.createElement("td");
        newTablatr.appendChild(newtdUnidades);
        newtdUnidades.textContent = unidades;

        //Total
        let newtdPedido = document.createElement("td");
        newTablatr.appendChild(newtdPedido);
        newtdPedido.textContent = `Q${total.toFixed(2)}`;

        //Botón de detalle
        let newtdConsulta = document.createElement("td");
        newTablatr.appendChild(newtdConsulta);

        let botonDetalle = document.createElement("button");
        botonDetalle.type = "button";
        botonDetalle.textContent = "Ver Detalles";
        botonDetalle.className = "btn-detalle";
        newtdConsulta.appendChild(botonDetalle);

        //Abrir detalle del pedido seleccionado
        botonDetalle.addEventListener("click", function () {
            localStorage.setItem("pedidoSeleccionado", JSON.stringify(pedido));
            window.location.href = "detallepedido.html";
        });

        //Sumar Ventas y Pedidos Confirmados
        totalVentas += total;
        totalPedidos++;

    });

    //Mostrar Dinero de Ventas
    dineroVentas.textContent = `Q${totalVentas.toFixed(2)}`;

    //Mostrar Pedidos Confirmados
    if (totalPedidos === 1) {
        pedidosConfirmados.textContent = "1 pedido";
    } else {
        pedidosConfirmados.textContent = `${totalPedidos} pedidos`;
    }

    //Mostrar Mensaje si no hay Pedidos
    if (totalPedidos === 0) {

        let newTablatr = document.createElement("tr");
        tablaPedidos.appendChild(newTablatr);

        let newtd = document.createElement("td");
        newtd.colSpan = 5;
        newtd.textContent = "No hay pedidos registrados para la fecha seleccionada";
        newtd.style.textAlign = "center";

        newTablatr.appendChild(newtd);
    }
}


//Bloque Selector de fecha

// Al abrir la página, el selector empieza en hoy
fecha.value = fechaDeHoy();
mostrarVentas(fecha.value);

// Cada vez que se elige otra fecha, se vuelve a mostrar la tabla
fecha.addEventListener("change", function () {

    // Si presionan "Borrar" en el calendario, vuelve a hoy
    if (fecha.value === "") {
        fecha.value = fechaDeHoy();
    }

    mostrarVentas(fecha.value);
});