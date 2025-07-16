// js/gestionActivos.js

document.addEventListener('DOMContentLoaded', () => {
    const formActivo = document.getElementById('formActivo');
    const activoIdInput = document.getElementById('activoId');
    const nombreActivoInput = document.getElementById('nombreActivo');
    const tipoActivoSelect = document.getElementById('tipoActivo');
    const descripcionActivoTextarea = document.getElementById('descripcionActivo');
    const btnGuardarActivo = document.getElementById('btnGuardarActivo');
    const btnLimpiarForm = document.getElementById('btnLimpiarForm');
    const listaActivosDiv = document.getElementById('listaActivos');
    const busquedaInput = document.getElementById('busquedaInput');
    const btnBuscar = document.getElementById('btnBuscar');
    const btnMostrarTodos = document.getElementById('btnMostrarTodos');

    let activos = JSON.parse(localStorage.getItem('activos')) || [];
    let nextId = activos.length > 0 ? Math.max(...activos.map(a => a.id)) + 1 : 1; 

    function guardarActivos() {
        localStorage.setItem('activos', JSON.stringify(activos));
    }

    function renderizarActivos(activosARenderizar = activos) {
        listaActivosDiv.innerHTML = ''; 

        if (activosARenderizar.length === 0) {
            listaActivosDiv.innerHTML = '<p>No hay activos registrados o no se encontraron resultados.</p>';
            return;
        }

        activosARenderizar.forEach(activo => {
            const activoItem = document.createElement('div');
            activoItem.classList.add('activo-item');
            activoItem.setAttribute('data-id', activo.id); 

            activoItem.innerHTML = `
                <h3>${activo.nombre}</h3>
                <p class="tipo">Tipo: ${activo.tipo}</p>
                <p>${activo.descripcion}</p>
                <div class="acciones">
                    <button class="btn-editar">Editar</button>
                    <button class="btn-eliminar">Eliminar</button>
                </div>
            `;
            listaActivosDiv.appendChild(activoItem);
        });

        document.querySelectorAll('.btn-editar').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.activo-item').dataset.id);
                editarActivo(id);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.activo-item').dataset.id);
                eliminarActivo(id);
            });
        });
    }

    formActivo.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const id = activoIdInput.value ? parseInt(activoIdInput.value) : null;
        const nombre = nombreActivoInput.value;
        const tipo = tipoActivoSelect.value;
        const descripcion = descripcionActivoTextarea.value;

        if (id) {
            const index = activos.findIndex(a => a.id === id);
            if (index !== -1) {
                activos[index] = { id, nombre, tipo, descripcion };
                alert('Activo actualizado exitosamente.');
            }
        } else {
            const nuevoActivo = {
                id: nextId++,
                nombre,
                tipo,
                descripcion
            };
            activos.push(nuevoActivo);
            alert('Activo insertado exitosamente.');
        }

        limpiarFormulario();
        guardarActivos();
        renderizarActivos();
    });

    function editarActivo(id) {
        const activo = activos.find(a => a.id === id);
        if (activo) {
            activoIdInput.value = activo.id;
            nombreActivoInput.value = activo.nombre;
            tipoActivoSelect.value = activo.tipo;
            descripcionActivoTextarea.value = activo.descripcion;
            btnGuardarActivo.textContent = 'Actualizar Activo'; 
        }
    }

    function eliminarActivo(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este activo?')) {
            activos = activos.filter(activo => activo.id !== id);
            guardarActivos();
            renderizarActivos();
            alert('Activo eliminado exitosamente.');
        }
    }

    btnLimpiarForm.addEventListener('click', () => {
        limpiarFormulario();
    });

    function limpiarFormulario() {
        formActivo.reset(); 
        activoIdInput.value = ''; 
        btnGuardarActivo.textContent = 'Guardar Activo'; 
    }

    btnBuscar.addEventListener('click', () => {
        const searchTerm = busquedaInput.value.toLowerCase();
        const resultados = activos.filter(activo =>
            activo.nombre.toLowerCase().includes(searchTerm) ||
            activo.descripcion.toLowerCase().includes(searchTerm)
        );
        renderizarActivos(resultados);
    });

    btnMostrarTodos.addEventListener('click', () => {
        busquedaInput.value = ''; 
        renderizarActivos(); 
    });

    renderizarActivos();
});