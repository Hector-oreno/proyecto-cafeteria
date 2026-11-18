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


//declaracion de variable 
let totalVentas = 0;

//LocalStorage Recuperar
const pedidosGuardados = localStorage.getItem("pedidosCafe");
const pedidosRecuperados = JSON.parse(pedidosGuardados) ?? [];

pedidosRecuperados.forEach(pedido =>{
    //Bloque Mostrar la tabla de pedidos
let newTablatr = document.createElement("tr");
tablaPedidos.appendChild(newTablatr);

let newtd = document.createElement("td");
newTablatr.appendChild(newtd);

newtd.textContent = (`# ${String(pedido.numero).padStart(3, "0")}`);

//Bloque Mostrar la tabla de hora
let newtdhora = document.createElement("td");
newTablatr.appendChild(newtdhora);

newtdhora.textContent = (`${String(pedido.hora)}`);

//Bloque Mostrar la tabla de unidades
let newtdUnidades = document.createElement("td");
newTablatr.appendChild(newtdUnidades);

newtdUnidades.textContent = (`${String(pedido.unidades)}`);

//Bloque Mostrar la tabla de total 
let newtdPedido = document.createElement("td");
newTablatr.appendChild(newtdPedido);

newtdPedido.textContent = (`Q ${pedido.total.toFixed(2)}`);

//Bloque Mostrar la tabla de detalle
let newtdConsulta = document.createElement("td");
newTablatr.appendChild(newtdConsulta);

let botonDetalle = document.createElement("button");

botonDetalle.textContent = (`Ver Detalles`);
newtdConsulta.appendChild(botonDetalle);

//asignar el btn para el css
botonDetalle.className = "btn-detalle";

//suma de ventas y pedidos totales para que de el total de todos los pedidos
totalVentas += pedido.total;

});

//codigo que muestra el total de los pedidos o ventas como sea
dineroVentas.textContent = (`Q${totalVentas.toFixed(2)}`);

//codigo que muestra todas las ventas registradas
pedidosConfirmados.textContent = (`${pedidosRecuperados.length} Pedidos`);

console.log(pedidosRecuperados);

