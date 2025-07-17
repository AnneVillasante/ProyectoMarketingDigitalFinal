/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
const URL_SCRIPT = "https://sheetdb.io/api/v1/ur6sazkwt4naq";

// Simulación de acceso del administrador
const admin = {
    usuario: "admin",
    contrasena: "admin123"
};

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const areaLogin = document.getElementById('area-login');
    const areaPanel = document.getElementById('area-panel');
    const panelSuscripciones = document.getElementById('panel-suscripciones');
    const btnVer = document.getElementById('btn-ver-suscripciones');
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    const inputBuscar = document.getElementById('input-buscar');
    const contenedor = document.getElementById('contenedor-suscriptores');

    // Inicio de sesión
    formLogin.addEventListener('submit', e => {
        e.preventDefault();
        const user = document.getElementById('admin-user').value.trim();
        const pass = document.getElementById('admin-pass').value.trim();

        if (user === admin.usuario && pass === admin.contrasena) {
            areaLogin.style.display = 'none';
            areaPanel.style.display = 'block';
        } else {
            alert("Credenciales incorrectas");
        }
    });

    // Ver suscripciones
    btnVer.addEventListener('click', () => {
        cargarSuscripciones();
        panelSuscripciones.style.display = 'block';
    });

    // Cerrar sesión
    btnCerrarSesion.addEventListener('click', () => {
        areaPanel.style.display = 'none';
        panelSuscripciones.style.display = 'none';
        areaLogin.style.display = 'block';
        document.getElementById('form-login').reset();
    });

    // Buscar suscriptor
    inputBuscar.addEventListener('keyup', buscarSuscripcion);
});

// Cargar suscripciones desde Google Sheets
function cargarSuscripciones() {
    fetch(URL_SCRIPT)
        .then(res => res.json())
        .then(data => {
            window.suscripciones = data;
            actualizarListaSuscripciones();
        })
        .catch(error => {
            console.error('Error al cargar suscripciones:', error);
            alert("Error al cargar las suscripciones");
        });
}

// Mostrar todos los suscriptores
function actualizarListaSuscripciones() {
    const contenedor = document.getElementById('contenedor-suscriptores');
    contenedor.innerHTML = '';

    if (!window.suscripciones || window.suscripciones.length === 0) {
        contenedor.innerHTML = '<p>No hay suscripciones registradas.</p>';
        return;
    }

    window.suscripciones.forEach((s, index) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-suscriptor';
        tarjeta.innerHTML = `
            <div class="acciones-tarjeta">
                <span class="btn-eliminar" onclick="eliminarSuscripcion(${index})">✖</span>       
            </div>
                <p><strong>Nombre:</strong> ${s.nombre}</p>
                <p><strong>Email:</strong> ${s.email}</p>
                <p><strong>País:</strong> ${s.pais}</p>
                <p><strong>Temas:</strong> ${Array.isArray(s.temas) ? s.temas.join(', ') : s.temas}</p>
                <p><strong>Comentarios:</strong> ${s.comentarios || 'Sin comentarios'}</p>
                <p><strong>Fecha:</strong> ${s.fecha}</p>            
                <button onclick="editarSuscripcion(${index})" class="btn-accion editar">Editar</button>            
        `;
        contenedor.appendChild(tarjeta);
    });
}

// Editar un suscriptor
function editarSuscripcion(index) {
    const s = window.suscripciones[index];

    const nuevoNombre = prompt('Nuevo nombre:', s.nombre);
    const nuevoEmail = prompt('Nuevo correo:', s.email);
    const nuevoPais = prompt('Nuevo país:', s.pais);
    const nuevoComentarios = prompt('Comentarios:', s.comentarios);

    if (nuevoNombre) s.nombre = nuevoNombre;
    if (nuevoEmail) s.email = nuevoEmail;
    if (nuevoPais) s.pais = nuevoPais;
    if (nuevoComentarios !== null) s.comentarios = nuevoComentarios;

    // Actualizar en Google Sheets
    fetch(`${URL_SCRIPT}/email/${encodeURIComponent(s.email)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: s })
    })
    .then(res => res.text())
    .then(respuesta => {
        if (respuesta === "OK") {
            actualizarListaSuscripciones();
        } else {
            alert("Error al actualizar: " + respuesta);
        }
    });
}

// Eliminar un suscriptor
function eliminarSuscripcion(index) {
    if (confirm('¿Eliminar esta suscripción?')) {
        // Eliminar en Google Sheets
        const email = window.suscripciones[index].email;

        fetch(`${URL_SCRIPT}/email/${encodeURIComponent(email)}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(respuesta => {
            if (respuesta.deleted === 1) {
                alert("Suscripción eliminada");
                cargarSuscripciones(); // Recarga la lista
            } else {
                alert("No se pudo eliminar");
            }
        });
    }
}

// Buscar suscriptor
function buscarSuscripcion() {
    const termino = document.getElementById('input-buscar').value.toLowerCase();
    const resultados = window.suscripciones.filter(s =>
        s.nombre.toLowerCase().includes(termino) ||
        (s.pais && s.pais.toLowerCase().includes(termino)) ||
        (s.email && s.email.toLowerCase().includes(termino))
    );
    mostrarResultadosBusqueda(resultados);
}

// Mostrar resultados filtrados
function mostrarResultadosBusqueda(lista) {
    const contenedor = document.getElementById('contenedor-suscriptores');
    contenedor.innerHTML = '';

    if (!lista || lista.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron coincidencias.</p>';
        return;
    }

    lista.forEach((s) => {
        const index = window.suscripciones.findIndex(item =>
            item.nombre === s.nombre &&
            item.email === s.email &&
            item.fecha === s.fecha
        );

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-suscriptor';
        tarjeta.innerHTML = `
            <div class="acciones-tarjeta">
                <span class="btn-eliminar" onclick="eliminarSuscripcion(${index})">✖</span>       
            </div>
                <p><strong>Nombre:</strong> ${s.nombre}</p>
                <p><strong>Email:</strong> ${s.email}</p>
                <p><strong>País:</strong> ${s.pais}</p>
                <p><strong>Temas:</strong> ${Array.isArray(s.temas) ? s.temas.join(', ') : s.temas}</p>
                <p><strong>Comentarios:</strong> ${s.comentarios || 'Sin comentarios'}</p>
                <p><strong>Fecha:</strong> ${s.fecha}</p>
                <button onclick="editarSuscripcion(${index})" class="btn-accion editar">Editar</button>
            
        `;
        contenedor.appendChild(tarjeta);
    });
}
