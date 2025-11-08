     //funcion para hacer cualquier elemento arrastrable
     function hacerElementoArrastrable(elemento){
      let pos1 = 0, pos2 = 0, pos3 =0, pos4 = 0;

      //al hacer click en el elemento(inicio del arrastre)
      elemento.onmousedown = dragMouseDown;

      function dragMouseDown(e){
        e = e || window.event;
        e.preventDefault();
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        pos1 = pos3 - e.clientX; 
        pos2 = pos4 - e.clientY; 
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Establecer la nueva posición del elemento
        elemento.style.top = (elemento.offsetTop - pos2) + "px";
        elemento.style.left = (elemento.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Detener el arrastre al soltar el ratón
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
      
     
     
     //variables del DOM

const video= document.getElementById('liveCameraFeed');
const canvas= document.getElementById('photoCanvas');
const simuladorArea= document.getElementById('simuladorArea');

const activateButton=document.getElementById('activateCameraButton');
const stopButton=document.getElementById('stopCameraButton');
const takePhotoButton = document.getElementById('takePhotoBtn');
const clearPhotoButton = document.getElementById('clearPhotoBtn');
const addLampButton = document.getElementById('addLampBtn');
const errorMessage = document.getElementById('errorMessage');

const lamparaSelectionDiv= document.getElementById('lamparaSeleccion');
const lampButtons = document.querySelectorAll('.add-lamp-btn');

let mediaStream = null //Variable global para detener la camara

// Logica de activacion de camara 

activateButton.addEventListener('click', async ()=>{
  try{
    errorMessage.textContent = '';

    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false});

    //asignar el stream al elemento <video>
    video.srcObject = mediaStream;
    video.style.display='block';

    //ocultar botones y mostrar controles de foto
    activateButton.style.display='none';
    stopButton.style.display='inline-block';
    takePhotoButton.style.display='inline-block';


  } catch (err){
    console.error('Error al acceder a la camara', err);
    errorMessage.textContent='No se puede acceder a la camara. Revisa los permisos.'
  }
});

//logica de detener camara

stopButton.addEventListener('click', ()=>{
  if(mediaStream){
    //detener todas las pistas (streams) de video
    mediaStream.getTracks().forEach(track => track.stop());
  }
  video.style.display='none';

  //resetear los botones
  activateButton.style.display='inline-block';
  stopButton.style.display='none';
  takePhotoButton.style.display='none';
      
    });
  
//logica de tomar foto y reemplazar el video
takePhotoButton.addEventListener('click', ()=>{
  //configurar el canvas para el tamaño exacto del video
  canvas.width= video.videoWidth;
  canvas.height=video.videoHeight;

  //dibujar el frame actual del video en el canvas
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  //detenr el video y obtener la imagen base64
  mediaStream.getTracks().forEach(track=> track.stop());
  const photoURL = canvas.toDataURL('image/png');

  //crear la imagen permanente y reemplazar el video
  video.style.display ='none' //oculta el video

  //crear el elemento de imagen capturada
  const capturedImage = document.createElement('img');
  capturedImage.id = 'capturedPhoto';
  capturedImage.src = photoURL;
  capturedImage.style.cssText = 'width: 100%, height: 100%, object-fit:cover;'; //estilos de fondo

  //limpiar el area de añadir la foto (por si hay una lampara)
  simuladorArea.innerHTML='';
  simuladorArea.appendChild(capturedImage);

  //mostrar los botones de simulacion
  takePhotoButton.style.display='none';
  stopButton.style.display='none';
  clearPhotoButton.style.display='inline-block';
  addLampButton.style.display='inline-block';

  lamparaSelectionDiv.style.display='block';
});

//logica para borrar foto
clearPhotoButton.addEventListener('click', ()=>{
  simuladorArea.innerHTML= `<video id="liveCameraFeed" autoplay playsinline></video>
                               <canvas id="photoCanvas" style="display: none;"></canvas>`;
  //restablecer los botones
clearPhotoButton.style.display='none';
addLampButton.style.display='none';
activateButton.style.display='inline-block';

lamparaSelectionDiv.style.display='none';

activateButton.style.display='inline-block';
});

// =========================================================
// LÓGICA FINAL: PONER/CAMBIAR LA LÁMPARA Y ACTIVAR ARRASTRE
// =========================================================

// Asignamos un event listener a CADA botón de lámpara
lampButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // 1. Obtener la ruta del PNG del atributo data-lampara-src del botón presionado
        const nuevaLamparaSrc = e.currentTarget.getAttribute('data-lampara-src');
        
        // 2. Verificar si ya hay una lámpara puesta (la que tiene el id 'lampara-draggable')
        let lampara = document.getElementById('lampara-draggable');
        
        if (lampara) {
            // Caso A: Ya existe una lámpara. Solo cambiamos la imagen (src) y la mantenemos en su lugar.
            lampara.src = nuevaLamparaSrc;
        } else {
            // Caso B: No existe. La creamos, la posicionamos y activamos el arrastre.
            lampara = document.createElement('img');
            lampara.src = nuevaLamparaSrc; 
            lampara.className = 'lampara-superpuesta'; // Aplica position: absolute
            lampara.id = 'lampara-draggable'; 
            lampara.alt = 'Lámpara de prueba';
            
            // Posición inicial
            lampara.style.top = '100px'; 
            lampara.style.left = '250px';
            
            // Insertar la lámpara y activar arrastre
            simuladorArea.appendChild(lampara);
            hacerElementoArrastrable(lampara); // LLAMADA A LA FUNCIÓN DE ARRASTRE
        }
        
        errorMessage.textContent = '¡Lámpara lista! Arrástrala para colocarla.';
    });
});