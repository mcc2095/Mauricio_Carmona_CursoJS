const saludarUsuario = "Bienvenido a la lista de tareas";
alert(saludarUsuario);

let listaDeTareas = [];
let nuevaTarea;

function agregarTarea() {
    nuevaTarea = prompt("Ingresa una nueva tarea:");
    if (nuevaTarea) {
        listaDeTareas.push(nuevaTarea);
        alert(`Tarea "${nuevaTarea}" agregada.`);
    } else {
        alert("Tarea no válida.");
    }
}

function mostrarTareas() {
    console.log("Lista de tareas:");
    for (let i = 0; i < listaDeTareas; i++) {
        console.log(`${i + 1}. ${listaDeTareas[i]}`);
    }
    alert("Ver consola");
}

while (true) {
    let elección = prompt("Elige una opción: \n1. Agregar tarea \n2. Mostrar tareas \n3. Salir");

    if (elección === '1') {
        agregarTarea();
    } else if (elección === '2') {
        mostrarTareas();
    } else if (elección === '3') {
        if (confirm("¿Estás seguro de que quieres salir?")) {
            break;
        }
    } else {
        alert("Opción no válida.");
    }
}