


//logica del carrousel automatico y manual

//variables del DOM
const carrouselPistas = document.getElementById('carrouselPistas');

if(!carrouselPistas){
  console.warn("Carrousel no encontrado. Verifica el ID 'carrouselPistas'");
  
}

const diapositivas = carrouselPistas.querySelectorAll('.diapositiva');
const totalDiapositiva = diapositivas.length;

const flechaIzquierda = document.getElementById('flechaIzquierda');
const flechaDerecha = document.getElementById('flechaDerecha');

let diapositivaActual= 0;
let carrouselIntervalo ;
const intervaloTiempo= 3000; //3 segudos para el autoplay


//funcion del movimiento

function moverCarrousel(){
  const desplazamiento = -diapositivaActual *100;
  carrouselPistas.style.transform=`translateX(${desplazamiento}%)`;
}

//funcion de navegacion

function siguienteDiapositiva (){
  if(diapositivaActual>= totalDiapositiva -1){
    diapositivaActual = 0;
  } else{
    diapositivaActual++;
  }
  moverCarrousel();
}

function anteriorDiapositiva(){
  if(diapositivaActual<= 0){
    diapositivaActual = totalDiapositiva - 1;
  } else{
    diapositivaActual--;
  }
  moverCarrousel();
}

//control de autoplay

function iniciarAutoplay(){
  if(carrouselIntervalo) clearInterval(carrouselIntervalo);
  carrouselIntervalo = setInterval(siguienteDiapositiva, intervaloTiempo);
}
function detenerAutoplay(){
  clearInterval(carrouselIntervalo);
}

//manejadores de eventos de las flechas

const handlArrowClick = (direccion) =>{
  detenerAutoplay();

  if(direccion === 'siguiente'){
    siguienteDiapositiva();
  }else{
    anteriorDiapositiva();
  }
};

flechaIzquierda.addEventListener('click', () => handlArrowClick('siguiente'));
flechaDerecha.addEventListener('click', ()=> handlArrowClick('anterior'));

//inicio

document.addEventListener('DOMContentLoaded', iniciarAutoplay);