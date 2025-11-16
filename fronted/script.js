

// Aseguramos que GSAP y ScrollTrigger estén registrados si existen.
if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
} else {
    console.warn("GSAP ScrollTrigger no está cargado.");
}


// funcion principal al cargar el DOM


document.addEventListener('DOMContentLoaded', () => {

   

    // 1. Animación de la Cabecera (Header) - Entrada desde arriba
    gsap.fromTo("header", 
        { y: -50, opacity: 0, visibility: 'hidden' }, 
        { y: 0, opacity: 1, duration: 1, visibility: 'visible', ease: "power3.out" }
    );

    // Animación de los elementos internos del Header (H1, logo, nav links)
    gsap.from("header h1, header .logo, header .nav a", {
        y: -20, 
        opacity: 0,
        duration: 0.8,
        delay: 0.3, 
        stagger: 0.1, 
        ease: "back.out(1.2)"
    });


    //  Animacion de entrada de los contenedores principales (Fade In y subir)
    // Se activa por scroll (ScrollTrigger)
    gsap.fromTo(".gsap-fade-in", 
        { opacity: 0, y: 50, visibility: 'hidden' }, 
        {
            opacity: 1, 
            y: 0, 
            duration: 1.5, 
            stagger: 0.3, 
            visibility: 'visible', 
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".gsap-fade-in",
                start: "top 90%",
                toggleActions: "play none none none"
            }
        }
    );
    
    //  Animacion del contenedor principal del carrusel (ScrollTrigger)
    gsap.fromTo(".carrousel-contenedor-principal",
        { opacity: 0, y: 30, visibility: 'hidden' },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            visibility: 'visible',
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".carrousel-contenedor-principal",
                start: "top 95%", 
                toggleActions: "play none none none"
            }
        }
    );

    // ---  logica del carrousel ---
const carouselSlide = document.querySelector('.carousel-slide');
        const images = document.querySelectorAll('.carousel-slide img');

        let counter = 0;
        const size = images[0].clientWidth; // Obtiene el ancho de la primera imagen

        // Mover el carrusel a la primera imagen al cargar
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

        setInterval(() => {
            counter++;
            carouselSlide.style.transition = 'transform 0.5s ease-in-out';
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

            // Cuando llega al final, resetear al principio sin transición para que no se vea el "salto"
            if (counter === images.length) {
                setTimeout(() => {
                    carouselSlide.style.transition = 'none';
                    counter = 0;
                    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
                }, 500); // Esperar a que termine la transición actual
            }
        }, 3000); // Cambia de imagen cada 3 segundos (3000 milisegundos)

});
    

//logica y animaciones para el footer




gsap.from(".animated-footer", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".animated-footer",
        start: "top 80%", 
        toggleActions: "play none none reverse",
         // Reproduce la animación una vez y la revierte al salir
         
    }
});

// Animación de los elementos individuales dentro del footer
gsap.timeline({
    scrollTrigger: {
        trigger: ".animated-footer",
        start: "top 80%",
        toggleActions: "play none none reverse",
        
    }
})
.from(".footer-logo", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out"
}, "<")
.from(".footer-divider", {
    opacity: 0,
    scaleX: 0,
    duration: 0.8,
    ease: "power2.out"
}, "-=0.4") 
.from(".footer-heading-redes", {
    opacity: 0,
    x: -20,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.3")
.from(".container-footerRedes .social-icon", {
    opacity: 0,
    y: 20,
    stagger: 0.15, 
    duration: 0.5,
    ease: "back.out(1.7)" 
}, "-=0.2")
.from(".footer-heading-contact", {
    opacity: 0,
    x: 20,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.3");



document.querySelectorAll(".social-icon").forEach(icon => {
    icon.addEventListener("mouseenter", () => {
        gsap.to(icon, {
            y: -5,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    icon.addEventListener("mouseleave", () => {
        gsap.to(icon, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});
