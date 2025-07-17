document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carrusel-simple .slide');
    const prevBtn = document.querySelector('.carrusel-simple .prev');
    const nextBtn = document.querySelector('.carrusel-simple .next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('activo');
        });

        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        slides[currentSlide].classList.add('activo');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); 
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); 
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide(); 
        });
    }

    startAutoSlide();

    const carruselContainer = document.querySelector('.carrusel-simple');
    if (carruselContainer) {
        carruselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carruselContainer.addEventListener('mouseleave', startAutoSlide);
    }

    showSlide(0);
});
