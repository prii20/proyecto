// 1. Datos de las lámparas, organizados por categoría (ambiente)
const lampsDataByCategory = {
    "Lamparas colgantes": [
        { name: "Tubo facet", description: "Tubo Facet es una luminaria colgante que redefine la idea del tubo clásico, transformándolo en un objeto de geometría precisa y contemporánea.", image: "descripImg/lampcolgante1.webp" },
        { name: "Araña alpina", description: "La Araña Alpina surge con el deseo de iluminar un espacio y acompañar estéticamente una cabaña realizada en rollizos de madera. Su diseño combina lo rústico con lo delicado, conservando lo natural del material pero con una presencia refinada y escultórica.", image: "descripImg/lampcolgante2.webp" },
        { name: "Donde nace un sueño Colgante", description: "“Donde Nace el Sueño” es una lámpara inspirada en esos momentos suspendidos entre el deseo y la posibilidad. Como una luz flotante en el cielo, lleva consigo la memoria de algo que aún no ocurrió… pero que insiste en ser.", image: "descripImg/lampcolgante3.webp" },
        { name: "Celestia", description: "Celestia nace del pedido de un cliente que buscaba una pieza única, inspirada en la delicadeza de un cairel. Su forma helicoidal envuelve el espacio con movimiento y elegancia, convirtiendo la luz en un gesto dinámico que acompaña la doble altura del ambiente.", image: "descripImg/lampcolgante4.webp" }
    ],
    "Lamparas de mesa": [
        { name: "Donde nace un sueño- De Mesa", description:"“Donde Nace el Sueño” es una lámpara inspirada en esos momentos suspendidos entre el deseo y la posibilidad. Como una luz flotante en el cielo, lleva consigo la memoria de algo que aún no ocurrió… pero que insiste en ser.", image: "descripImg/lampmesa1.webp" },
        { name: "Etna", description: "Etna es una pieza que invita a detenerse, a sentir la luz como parte del entorno y de uno mismo. En ella, la esencia de la colección se vuelve cercana: una luz que no solo ilumina, sino que acompaña.", image: "descripImg/lampmesa2.webp" },
        { name: "Cupula", description: "Cúpula es una lámpara de mesa que explora el vínculo entre la luz, la forma y la materia. En su base, un delicado enrejado se revela solo al encenderse, proyectando sobre la superficie una trama de sombras que transforma el plano en un dibujo luminoso.", image: "descripImg/lampmesa3.webp" },
        { name: "Bruma", description: "Bruma nace como un objeto lumínico que parece encenderse desde su interior. La luz surge desde la base y asciende suavemente hacia la cúpula, generando una sensación de emisión interior, como si la pieza respirara luz. Esa iluminación traslúcida crea una atmósfera confortable y envolvente, pensada para acompañar sin invadir.", image: "descripImg/lampmesa4.webp" }
    ],
    "Lamparas de pared": [
        { name: "Yuru", description: "En lo estético, Yuru combina la calidez de la madera con la fluidez de una pantalla de ondas suaves, que remite a un lenguaje contemporáneo y orgánico.", image: "descripImg/lamppared2.webp" },
        { name: "Nido", description: "Diseñada para adaptarse como aplique de techo o pared, Nido es una luminaria que integra estética y función, llevando la calma y la naturalidad de lo orgánico al espacio donde se instala.", image: "descripImg/lamppared1.webp" },
       
    
    ]
};

// 2. Elemento del DOM donde se insertarán las secciones
const mainContent = document.getElementById('main-content');

// 3. Función para renderizar todas las secciones y sus lámparas
function renderAllLampsByCategories() {
    mainContent.innerHTML = ''; // Limpiar el contenedor principal

    for (const categoryName in lampsDataByCategory) {
        if (lampsDataByCategory.hasOwnProperty(categoryName)) {
            const lampsInSection = lampsDataByCategory[categoryName];

            // Crear la sección para la categoría
            const categorySection = document.createElement('section');
            categorySection.classList.add('category-section');

            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = categoryName;
            categorySection.appendChild(categoryTitle);

            const lampsGrid = document.createElement('div');
            lampsGrid.classList.add('lamps-grid');

            // Crear las tarjetas de lámpara para esta categoría
            if (lampsInSection.length === 0) {
                lampsGrid.innerHTML = '<p class="no-results">No hay lámparas en esta categoría.</p>';
            } else {
                lampsInSection.forEach(lamp => {
                    const lampCard = document.createElement('div');
                    lampCard.classList.add('lamp-card');

                    lampCard.innerHTML = `
                        <img src="${lamp.image}" alt="Lámpara ${lamp.name}">
                        <div class="lamp-info">
                            <h3>${lamp.name}</h3>
                            <p>${lamp.description}</p>
                        </div>
                    `;
                    lampsGrid.appendChild(lampCard);
                });
            }

            categorySection.appendChild(lampsGrid);
            mainContent.appendChild(categorySection);
        }
    }
}

// 4. Cargar todas las lámparas por categoría cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', renderAllLampsByCategories);


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
