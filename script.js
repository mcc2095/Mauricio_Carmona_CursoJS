const botonesAgregarCarrito = document.querySelectorAll('.agregarAlCarrito');
const listaCarrito = document.getElementById('listaCarrito');
const botonVaciarCarrito = document.getElementById('vaciarCarrito');
const campoBusqueda = document.getElementById('searchInput');
const listaProductos = document.getElementById('listaProductos');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarCarrito() {
    listaCarrito.innerHTML = '';
    carrito.forEach((item) => {
        const li = document.createElement('li');
        const totalPrecio = item.precio * item.cantidad;
        li.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad} = $${totalPrecio}`;
        listaCarrito.appendChild(li);
    });
}

function agregarProducto(event) {
    const boton = event.target;
    const nombre = boton.getAttribute('data-nombre');
    const precio = parseFloat(boton.getAttribute('data-precio'));
    const campoCantidad = document.getElementById(`cantidad${nombre}`);
    const cantidad = parseInt(campoCantidad.value);

    if (cantidad > 0) {
        const producto = { nombre, precio, cantidad };
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        campoCantidad.value = '';
    } else {
        alert('Por favor, ingrese una cantidad válida.');
    }
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
}

function filtrarProductos() {
    const textoBusqueda = campoBusqueda.value.toLowerCase();
    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        const nombre = producto.getAttribute('data-nombre').toLowerCase();
        if (nombre.includes(textoBusqueda)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

botonesAgregarCarrito.forEach(boton => boton.addEventListener('click', agregarProducto));
botonVaciarCarrito.addEventListener('click', vaciarCarrito);
campoBusqueda.addEventListener('input', filtrarProductos);

mostrarCarrito();