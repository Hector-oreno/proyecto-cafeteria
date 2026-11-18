const fecha = document.getElementById("fecha");
const dineroVentas = document.getElementById("VR");
const pedidosConfirmados = document.getElementById("PC");
const tablaPedidos = document.getElementById("tabla-pedidos");

//Bloque Fecha Actual
const date = new Date();
const [month, day, year] = [
    date.getMonth() + 1,
    date.getDate(),
    date.getFullYear(),
]   

fecha.textContent = (`${day}/${month}/${year}`);

//Bloque Mostrar Dinero de Ventas
let totalVentas = 0;
dineroVentas.textContent = (`Q${totalVentas.toFixed(2)}`);

//Bloque Mostrar Pedidos Confirmados
let totalPedidos = 0;
pedidosConfirmados.textContent = (`${totalPedidos} Pedidos`);

//Bloque Mostrar la tabla de pedidos
let newTablatr = document.createElement("tr");
tablaPedidos.appendChild(newTablatr);

let newtd = document.createElement("td");
newTablatr.appendChild(newtd);

newtd.textContent = (`#001`);

//Bloque Mostrar la tabla de hora
let newtdhora = document.createElement("td");
newTablatr.appendChild(newtdhora);

newtdhora.textContent = (`09:15`);

//Bloque Mostrar la tabla de unidades
let newtdUnidades = document.createElement("td");
newTablatr.appendChild(newtdUnidades);

newtdUnidades.textContent = (`3`);

//Bloque Mostrar la tabla de total 
let precioPedido = 46;

let newtdPedido = document.createElement("td");
newTablatr.appendChild(newtdPedido);

newtdPedido.textContent = (`Q ${precioPedido.toFixed(2)}`);

//Bloque Mostrar la tabla de detalle
let newtdConsulta = document.createElement("td");
newTablatr.appendChild(newtdConsulta);

let botonDetalle = document.createElement("button");

botonDetalle.textContent = (`Ver Detalles`);
newtdConsulta.appendChild(botonDetalle);

//asignar el btn para el css
botonDetalle.className = "btn-detalle";