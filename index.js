const formulario = document.querySelector('#formulario');
const inputText = document.querySelector('#busqueda');
const listaResultados = document.querySelector('#lista--resultados');
const microfono = document.querySelector('#microfono');
const popup = document.querySelector('#popup');
const urlApi = 'https://api.giphy.com/v1/gifs/search?api_key=CfQVYMHBy392CdKXEUs2WRQWWpwR486c&limit=10&q=';

// 1. Logica de formulario
formulario.addEventListener('submit',(e)=>{
    e.preventDefault(); 
    apiGiphy(inputText.value);
});

const apiGiphy = async(inputText)=> {
    
    const apiBusqueda = urlApi+inputText;
    try {
        const respuesta = await fetch(apiBusqueda);
        const resultado = await respuesta.json();

        if(resultado.data.length > 0){
            mostrarResultados(resultado.data);
        }else{
            listaResultados.textContent = 'No hay resultados';
        }
    } catch (error) {
        console.log(error);
    }
}
const mostrarResultados = (datos)=>{
    // eliminar elementos previos
    eliminarElementosPrevios();

    datos.forEach(giphy => {
        let imagen = document.createElement('img');
        imagen.src = giphy.images.downsized_medium.url;
        imagen.alt = giphy.title;
        imagen.width = '300';
        imagen.height = '300';
        let lista = document.createElement('li');
        lista.append(imagen);
        listaResultados.append(lista);
    });
}

// Logica del microfono
microfono.addEventListener('click',()=>{

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.start();

    //1.  Permiso aceptado
    recognition.onstart = ()=>{
        popup.classList.add('popup--dinamico');
    };

    // 1.1 Termina de grabar general
    recognition.onspeechend = ()=>{
        popup.classList.remove('popup--dinamico');
        recognition.stop();
    }

    // 1.1 Termina de grabar ios
    recognition.onend = ()=>{
        recognition.stop();
        popup.classList.remove('popup--dinamico');
    };
      
    //1.2 Resultado
    recognition.onresult = (event)=>{
        inputText.value = event.results[0][0].transcript.split('.')[0];
        apiGiphy(event.results[0][0].transcript.split('.')[0]);
    }

    //2.  Sin permiso
    recognition.onerror = ()=>{
        console.log('Microfono no activado');  
    }
});

function eliminarElementosPrevios() {
    while (listaResultados.firstChild) {
        listaResultados.removeChild(listaResultados.firstChild);
    }
}