document.addEventListener('DOMContentLoaded', () => {
    // Lógica para el Acordeón
    const preguntasFaq = document.querySelectorAll('.pregunta-faq');

    preguntasFaq.forEach(pregunta => {
        pregunta.addEventListener('click', () => {
            preguntasFaq.forEach(otraPregunta => {
                if (otraPregunta !== pregunta && otraPregunta.classList.contains('activo')) {
                    otraPregunta.classList.remove('activo');
                    otraPregunta.nextElementSibling.classList.remove('mostrar');
                    otraPregunta.querySelector('.icono-acordeon').textContent = '+';
                }
            });

            pregunta.classList.toggle('activo');

            const respuesta = pregunta.nextElementSibling; 
            respuesta.classList.toggle('mostrar');

            const icono = pregunta.querySelector('.icono-acordeon');
            if (pregunta.classList.contains('activo')) {
                icono.textContent = 'x'; 
            } else {
                icono.textContent = '+';
            }
        });
    });

    const btnContactoSoporte = document.getElementById('btnContactoSoporte');
    const modalContacto = document.getElementById('modalContacto');
    const cerrarModal = document.querySelector('.cerrar-modal');
    const formContacto = document.getElementById('formContacto');

    btnContactoSoporte.addEventListener('click', () => {
        modalContacto.style.display = 'flex'; 
    });

    cerrarModal.addEventListener('click', () => {
        modalContacto.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalContacto) {
            modalContacto.style.display = 'none';
        }
    });

    formContacto.addEventListener('submit', (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (nombre === '' || email === '' || mensaje === '') {
            alert('Por favor, completa todos los campos del formulario.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }

        const confirmacion = confirm(`¿Estás seguro de que quieres enviar este mensaje?\n\nNombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje.substring(0, 100)}...`);

        if (confirmacion) {
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            formContacto.reset(); 
            modalContacto.style.display = 'none'; 
        } else {
            alert('El envío del mensaje ha sido cancelado.');
        }
    });
});