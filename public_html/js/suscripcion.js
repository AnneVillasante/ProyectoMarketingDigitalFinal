/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


document.addEventListener('DOMContentLoaded', function() {
    // URL de tu Google Apps Script
    const URL_SCRIPT = "https://sheetdb.io/api/v1/ur6sazkwt4naq";
    
    // Elementos del DOM
    const formulario = document.getElementById('formulario-newsletter');
    const resultadoDiv = document.getElementById('resultado-suscripcion');
    const btnEstadisticas = document.getElementById('btn-estadisticas');
    const ventanaEstadisticas = document.getElementById('ventana-estadisticas');
    const cerrarEstadisticas = document.getElementById('cerrar-estadisticas');
    const contenidoEstadisticas = document.getElementById('contenido-estadisticas');
    
    // Validación del formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Resetear mensajes de error
        document.querySelectorAll('.mensaje-error').forEach(el => el.textContent = '');
        
        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const temas = Array.from(document.querySelectorAll('input[name="temas"]:checked')).map(el => el.value);
        const pais = document.getElementById('pais').value;
        const comentarios = document.getElementById('comentarios').value.trim();
        
        // Validar campos
        let isValid = true;
        
        if (!nombre) {
            document.getElementById('error-nombre').textContent = 'Por favor ingresa tu nombre';
            isValid = false;
        }
        
        if (!email) {
            document.getElementById('error-email').textContent = 'Por favor ingresa tu correo electrónico';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('error-email').textContent = 'Por favor ingresa un correo válido';
            isValid = false;
        }
        
        if (temas.length === 0) {
            document.getElementById('error-temas').textContent = 'Por favor selecciona al menos un tema de interés';
            isValid = false;
        }
        
        if (!pais) {
            document.getElementById('error-pais').textContent = 'Por favor selecciona tu país';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Mostrar confirmación con prompt
        const confirmacion = confirm(`¿Confirmas que deseas suscribirte con el correo ${email}?`);
        
        if (confirmacion) {
            // Crear objeto con los datos
            const suscriptor = {
                nombre,
                email,
                temas,
                pais,
                comentarios: comentarios || "Sin comentarios",
                fecha: new Date().toLocaleDateString()
            };
            
            // Enviar datos a Google Sheets
            fetch(URL_SCRIPT, {
              method: 'POST',
              body: JSON.stringify({ data: suscriptor }), // 👈 importante
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(res => res.text())
            .then(respuesta => {
                if (respuesta === "OK") {
                    mostrarResultados(suscriptor);
                    formulario.reset();
                    alert('¡Gracias por suscribirte! Pronto recibirás nuestros mejores contenidos.');
                } else {
                    alert("Error al guardar: " + respuesta);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Ocurrió un error al enviar el formulario");
            });
        }
    });
    
    // Función para mostrar resultados
    function mostrarResultados(data) {
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = '';
        
        const titulo = document.createElement('h3');
        titulo.textContent = `¡Gracias por suscribirte, ${data.nombre}!`;
        titulo.style.color = '#0066FF';
        
        const emailP = document.createElement('p');
        emailP.innerHTML = `<strong>Correo electrónico:</strong> ${data.email}`;
        
        const paisP = document.createElement('p');
        paisP.innerHTML = `<strong>País:</strong> ${data.pais}`;
        
        const temasP = document.createElement('p');
        temasP.innerHTML = `<strong>Temas de interés:</strong>`;
        
        const temasLista = document.createElement('ul');
        data.temas.forEach(tema => {
            const item = document.createElement('li');
            item.textContent = formatearTema(tema);
            temasLista.appendChild(item);
        });
        
        if (data.comentarios) {
            const comentariosP = document.createElement('p');
            comentariosP.innerHTML = `<strong>Comentarios:</strong> ${data.comentarios}`;
            resultadoDiv.appendChild(comentariosP);
        }
        
        const fechaP = document.createElement('p');
        fechaP.innerHTML = `<strong>Fecha de suscripción:</strong> ${data.fecha}`;
        
        resultadoDiv.appendChild(titulo);
        resultadoDiv.appendChild(emailP);
        resultadoDiv.appendChild(paisP);
        resultadoDiv.appendChild(temasP);
        resultadoDiv.appendChild(temasLista);
        resultadoDiv.appendChild(fechaP);
    }
    
    // Formatear tema para mostrar
    function formatearTema(tema) {
        const temasFormateados = {
            'SEO': 'SEO (Optimización para motores de búsqueda)',
            'Ads': 'Publicidad Digital (Ads)',
            'Redes': 'Redes Sociales'
        };
        return temasFormateados[tema] || tema;
    }
    
    // Manejar ventana de estadísticas
    btnEstadisticas.addEventListener('click', function() {
        ventanaEstadisticas.classList.add('activo');
        mostrarEstadisticas();
    });
    
    cerrarEstadisticas.addEventListener('click', function() {
        ventanaEstadisticas.classList.remove('activo');
    });
    
    // Cerrar al hacer clic fuera del contenido
    ventanaEstadisticas.addEventListener('click', function(e) {
        if (e.target === ventanaEstadisticas) {
            ventanaEstadisticas.classList.remove('activo');
        }
    });
    
    // Función para mostrar estadísticas reales
    function mostrarEstadisticas() {
    fetch(URL_SCRIPT)
        .then(response => response.json())
        .then(suscripciones => {
            const totalSuscriptores = suscripciones.length;

            const paises = {};
            const temas = {};

            suscripciones.forEach(s => {
                // Contar por país
                paises[s.pais] = (paises[s.pais] || 0) + 1;

                // Contar por tema
                s.temas.split(',').map(t => t.trim()).forEach(t => {
                  temas[t] = (temas[t] || 0) + 1;
                });
            });

            // Limpiar contenido previo
            contenidoEstadisticas.innerHTML = '';

            const tituloTotal = document.createElement('h3');
            tituloTotal.textContent = `Total de suscriptores: ${totalSuscriptores}`;
            contenidoEstadisticas.appendChild(tituloTotal);

            // Mostrar países
            const tituloPaises = document.createElement('h3');
            tituloPaises.textContent = 'Suscriptores por país';
            contenidoEstadisticas.appendChild(tituloPaises);

            const contenedorPaises = document.createElement('div');
            contenedorPaises.className = 'grafico-barras';

            Object.entries(paises).forEach(([pais, cantidad]) => {
                const barraContainer = document.createElement('div');
                barraContainer.className = 'barra-container';

                const barraEtiqueta = document.createElement('div');
                barraEtiqueta.className = 'barra-etiqueta';
                barraEtiqueta.textContent = pais;

                const barra = document.createElement('div');
                barra.className = 'barra';
                barra.style.width = `${cantidad * 2}%`; // Escala ajustable

                const barraValor = document.createElement('span');
                barraValor.className = 'barra-valor';
                barraValor.textContent = cantidad;

                barra.appendChild(barraValor);
                barraContainer.appendChild(barraEtiqueta);
                barraContainer.appendChild(barra);
                contenedorPaises.appendChild(barraContainer);
            });

            contenidoEstadisticas.appendChild(contenedorPaises);

            // Mostrar temas
            const tituloTemas = document.createElement('h3');
            tituloTemas.textContent = 'Temas más populares';
            contenidoEstadisticas.appendChild(tituloTemas);

            const contenedorTemas = document.createElement('div');
            contenedorTemas.className = 'grafico-barras';

            Object.entries(temas).forEach(([tema, cantidad]) => {
                const barraContainer = document.createElement('div');
                barraContainer.className = 'barra-container';

                const barraEtiqueta = document.createElement('div');
                barraEtiqueta.className = 'barra-etiqueta';
                barraEtiqueta.textContent = formatearTema(tema);

                const barra = document.createElement('div');
                barra.className = 'barra';
                barra.style.width = `${cantidad * 2}%`;

                const barraValor = document.createElement('span');
                barraValor.className = 'barra-valor';
                barraValor.textContent = cantidad;

                barra.appendChild(barraValor);
                barraContainer.appendChild(barraEtiqueta);
                barraContainer.appendChild(barra);
                contenedorTemas.appendChild(barraContainer);
            });

            contenidoEstadisticas.appendChild(contenedorTemas);
        })
        .catch(error => {
            console.error("Error cargando estadísticas:", error);
            contenidoEstadisticas.innerHTML = "<p style='color:red'>No se pudieron cargar las estadísticas.</p>";
        });
    }
});