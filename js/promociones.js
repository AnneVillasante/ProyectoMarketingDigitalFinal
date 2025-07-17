document.addEventListener('DOMContentLoaded', () => {
    const promociones = [
        {
            id: 1,
            titulo: 'Pack Inicio Digital',
            descripcion: 'Diseño de sitio web básico + 1 mes de gestión de redes sociales.',
            precio: '$499',
            duracion: 'Validez: 30 días',
            oferta: 'ideal para pequeños negocios.',
            link: '#'
        },
        {
            id: 2,
            titulo: 'SEO Acelerado',
            descripcion: 'Optimización SEO completa para tu web + consultoría de palabras clave.',
            precio: '$350',
            duracion: 'Validez: 60 días',
            oferta: 'impulsa tu visibilidad orgánica.',
            link: '#'
        },
        {
            id: 3,
            titulo: 'Campaña Redes Sociales Pro',
            descripcion: 'Diseño y ejecución de campaña de publicidad en Facebook e Instagram.',
            precio: '$599',
            duracion: 'Validez: 45 días',
            oferta: 'aumenta tu engagement y ventas.',
            link: '#'
        },
        {
            id: 4,
            titulo: 'Branding Completo',
            descripcion: 'Diseño de logo, manual de marca y estrategia de identidad corporativa.',
            precio: '$750',
            duracion: 'Validez: Indefinida',
            oferta: 'construye una marca sólida.',
            link: '#'
        },
        {
            id: 5,
            titulo: 'Consultoría Estratégica',
            descripcion: 'Sesión personalizada de 2 horas para definir tu estrategia digital.',
            precio: '$99',
            duracion: 'Validez: 90 días',
            oferta: 'guía experta para tu negocio.',
            link: '#'
        }
    ];

    const listaPromocionesDiv = document.getElementById('listaPromociones');
    const btnVerPromociones = document.getElementById('btnVerPromociones');
    const btnSuscribirse = document.getElementById('btnSuscribirse');
    const marqueeDinamica = document.getElementById('marqueeDinamica');

    const mostrarPromociones = () => {
        listaPromocionesDiv.innerHTML = '';
        for (let i = 0; i < promociones.length; i++) {
            const promo = promociones[i];
            const promocionItem = document.createElement('div');
            promocionItem.classList.add('promocion-item');
            promocionItem.setAttribute('data-id', promo.id); 

            promocionItem.innerHTML = `
                <h3>${promo.titulo}</h3>
                <p>${promo.descripcion}</p>
                <span class="precio-promo">${promo.precio}</span>
                <span class="duracion-promo">${promo.duracion}</span>
                <a href="${promo.link}" class="boton-promo">Más Información</a>
            `;
            listaPromocionesDiv.appendChild(promocionItem);
        }
        btnVerPromociones.style.display = 'none'; 
    };

    btnVerPromociones.addEventListener('click', () => {
        mostrarPromociones();
        seleccionarPromocionDestacada();
    });

    const seleccionarPromocionDestacada = () => {
        let inputUsuario = prompt("¿Te gustaría destacar alguna promoción en particular? (Introduce el número de ID de la promoción, o 'no' para saltar)");

        if (inputUsuario === null || inputUsuario.toLowerCase() === 'no') {
            alert('No se destacará ninguna promoción en este momento.');
            return;
        }

        let idSeleccionado = parseInt(inputUsuario.trim());
        let promocionEncontrada = null;

        document.querySelectorAll('.promocion-item').forEach(item => {
            item.classList.remove('destacada');
        });

        switch (idSeleccionado) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                promocionEncontrada = promociones.find(promo => promo.id === idSeleccionado);
                if (promocionEncontrada) {
                    const elementoPromo = document.querySelector(`.promocion-item[data-id="${idSeleccionado}"]`);
                    if (elementoPromo) {
                        elementoPromo.classList.add('destacada');
                        alert(`Se ha destacado la promoción: "${promocionEncontrada.titulo}"`);
                        marqueeDinamica.textContent = `✨ ¡Oferta Destacada! ${promocionEncontrada.titulo} por solo ${promocionEncontrada.precio} - ${promocionEncontrada.oferta}`;
                    }
                } else {
                    alert('No se encontró una promoción con ese ID.');
                }
                break;
            default:
                alert('ID de promoción no válido. Por favor, introduce un número entre 1 y ' + promociones.length + ' o "no".');
                break;
        }
    };

    btnSuscribirse.addEventListener('click', () => {
        const confirmacion = confirm('¿Estás seguro de que deseas suscribirte a nuestras promociones y recibir ofertas exclusivas?');
        if (confirmacion) {
            alert('¡Gracias por suscribirte! Recibirás nuestras mejores promociones directamente en tu bandeja de entrada.');
        } else {
            alert('Suscripción cancelada.');
        }
    });
});