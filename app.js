let categorias = [];
let productos = [];
let carrito = [];

async function cargarDatos() {
    try {
        const respuesta = await fetch('productos.json');
        const data = await respuesta.json();
        categorias = data.categorias;
        productos = data.productos;
        cargarCategorias();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        document.getElementById('listaDeProductos').innerHTML = '<p>Error al cargar los productos. Por favor, inténtalo más tarde.</p>';
    }
}

function cargarCategorias() {
    const menuCategorias = document.getElementById('menuCategorias');
    menuCategorias.innerHTML = '';
    categorias.forEach(categoria => {
        const enlace = document.createElement('a');
        enlace.href = "#";
        enlace.textContent = categoria;
        enlace.dataset.categoria = categoria;
        enlace.addEventListener('click', (event) => {
            event.preventDefault(); 
            const categoriaSeleccionada = event.target.dataset.categoria;
            const productosFiltrados = filtrarPorCategoria(categoriaSeleccionada);
            mostrarProductos(productosFiltrados);
        });
        menuCategorias.appendChild(enlace);
    });
}

function filtrarPorCategoria(categoriaSeleccionada) {
    return productos.filter(producto => producto.categoria === categoriaSeleccionada);
}

function buscarProductos(textoBusqueda) {
    return productos.filter(producto => 
        producto.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
}

function mostrarProductos(productosFiltrados) {
    const listaDeProductos = document.getElementById('listaDeProductos');
    listaDeProductos.innerHTML = '';

    productosFiltrados.forEach(producto => {
        const productoDiv = crearElementoProducto(producto);
        listaDeProductos.appendChild(productoDiv);
    });

    agregarEventosCarrito();
}

    function crearElementoProducto(producto) {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');
    
        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        imagen.classList.add('imagen-producto');
    
        const nombre = document.createElement('h3');
        nombre.textContent = producto.nombre;
    
        const descripcion = document.createElement('p');
        descripcion.textContent = producto.descripcion;
    
        const precio = document.createElement('p');
        precio.textContent = `$${producto.precio}`;
    
        const cantidadInput = document.createElement('input');
        cantidadInput.type = 'number';
        cantidadInput.id = `cantidad-${producto.nombre}`;
        cantidadInput.placeholder = 'Cantidad';
        cantidadInput.min = '1';
    
        const botonAgregar = document.createElement('button');
        botonAgregar.classList.add('agregarAlCarrito');
        botonAgregar.textContent = 'Agregar al Carrito';
        botonAgregar.dataset.nombre = producto.nombre;
        botonAgregar.dataset.precio = producto.precio;
    
        productoDiv.appendChild(imagen);
        productoDiv.appendChild(nombre);
        productoDiv.appendChild(descripcion);
        productoDiv.appendChild(precio);
        productoDiv.appendChild(cantidadInput);
        productoDiv.appendChild(botonAgregar);
    
        return productoDiv;
    }

function agregarEventosCarrito() {
    const botonesAgregar = document.querySelectorAll('.agregarAlCarrito');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombre = e.target.dataset.nombre;
            const precio = parseFloat(e.target.dataset.precio);
            const cantidad = parseInt(document.getElementById(`cantidad-${nombre}`).value);
            if (!isNaN(cantidad) && cantidad > 0) {
                agregarProductoCarrito(nombre, precio, cantidad);
                mostrarCarrito();
            }
        });
    });
}

function agregarProductoCarrito(nombre, precio, cantidad) {
    const productoExistente = carrito.find(item => item.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }
    actualizarStorage();
}

function mostrarCarrito() {
    const carritoElement = document.getElementById('carrito');
    const listaCarrito = carritoElement.querySelector('ul');
    listaCarrito.innerHTML = carrito.map(item => `
        <li>${item.nombre} - $${item.precio} x ${item.cantidad}</li>
    `).join('');

    const totalDiv = carritoElement.querySelector('#total');
    if (totalDiv) {
        totalDiv.remove();
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    carritoElement.innerHTML += `<div id="total">Total: $${total}</div>`;
    carritoElement.style.display = 'block';
}

function vaciarCarrito() {
    carrito = [];
    actualizarStorage();
    mostrarCarrito();
}

function confirmarCompra() {
    if (carrito.length > 0) {
        alert('Gracias por tu compra. ¡Tu carrito ha sido vaciado!');
        vaciarCarrito();
    } else {
        alert('El carrito está vacío.');
    }
}

function actualizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function recuperarCarrito() {
    const carritoStorage = JSON.parse(localStorage.getItem('carrito'));
    if (carritoStorage) {
        carrito = carritoStorage;
        mostrarCarrito();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('botonCategorias').addEventListener('click', () => {
        const menuCategorias = document.getElementById('menuCategorias');
        menuCategorias.style.display = menuCategorias.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('vaciarCarrito').addEventListener('click', vaciarCarrito);
    document.getElementById('confirmarCompra').addEventListener('click', confirmarCompra);

    document.getElementById('iconoCarrito').addEventListener('click', () => {
        const carritoElement = document.getElementById('carrito');
        carritoElement.style.display = carritoElement.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('buscarProducto').addEventListener('input', (event) => {
        const textoBusqueda = event.target.value;
        const productosFiltrados = buscarProductos(textoBusqueda);
        mostrarProductos(productosFiltrados);
    });

    
});

recuperarCarrito();
cargarDatos();