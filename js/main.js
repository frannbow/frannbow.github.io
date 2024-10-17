const contenedor = document.querySelector('div#container')
const urlposts = "https://670ea48f3e7151861655592b.mockapi.io/posteos"
const botonCamara= document.querySelector('div#botonCamara')
const dialogo = document.querySelector('#dialogo')
const btnCancelar = document.querySelector('#btnCancelar')
const btnSubir = document.querySelector('#btnSubir')
const nuevaimg = document.querySelector('img#nuevaimg')

const posts = []//guardo los posts de forma local, usar esto en lugar de posting para tener datos de API

//------inicializar camara---------------//

const inputCamara = document.createElement('input')
inputCamara.type = 'file'
inputCamara.id = 'inputFile'
inputCamara.accept = '.png, .jpg, .webp'
inputCamara.capture = 'environment'






//----------------BUSQUEDA DE POST EN API---------------//





function obtenerPosts(){
    fetch(urlposts)
// este es el cuerpo del response, validaremos el status === 200 para saber que la pegada a la api se hizo correctamente
//.then se usan como metodo de control
//con el primer .then haremos una validacion tipo status y luego se almacena en un array, no se ejecuta un .then sin que la logica del anterior sea exitoso

    .then((response)=>{
        if(response.status === 200){
           //retorno se hace de forma implicita
           return response.json()
        }
        else{
            throw new Error('no se pudo obtener datos remotos'+response.status)
        }
    })
    //aca usaremos .then para almacenar los datos en un array
    .then((data)=>
        //data.forEach((post)=>posts.push(post)) se puede iterar con un foreach o hacer el siguiente metodo
    posts.push(...data)
        //... los tres puntos se llaman spread operator (agarra la info en un array y los separa con una coma)
        //usaremos este spread operator para evitar una iteracion, esto optimiza el codigo y es mas comodo el uso
    )
    //uso .then para ejecutar el generador de cards con los datos que correspondan
    .then(()=> crearPosts() )
    .catch((error) =>console.log(error))

}



//----------------------PUBLICACION POSTS WEB----------------------//


function generadorCard(post){
    //reempplazar posting.id y demas por el json que contenga los posts
    return `<div id="container">
                <div class="card">
                    <h2 id="titulo">${post.title}</h2>
                    <img id="foto" src=${post.img} alt="Imagen genérica">
                    <p id="fecha-hora">Fecha y hora:${post.fecha_hora}</p>
                    
                </div>
            </div>`
}
function noPost(){
    const main = document.querySelector('main')
    main.className = 'nopost'
    return `
                <div id="container">
            <div class="card">
                <h2 id="titulo">No tiene fotografias cargadas</h2>
                <img id="foto" src="/img/Image-not-load.png" alt="Imagen genérica">
                <p id="fecha-hora"><span id="fecha-hora"></span></p>
            </div>
        </div>
    `
}

function crearPosts (){
    //obtener un post
    //reemplazar posting por el json que contenga los post(revisar api)
    let cardPosts=''
    //podemos vaciar el contenedor con contenedor.innerHTML = '' para evitar que haya datos duplicados
   if(posts.length > 0){
    contenedor.innerHTML = ''
        posts.forEach((post) => {
            cardPosts += generadorCard(post)
        })
        contenedor.innerHTML = cardPosts
    }
    else{
        contenedor.innerHTML = noPost()
    } 
}
//configurar ids para pagina de previsualizacion de imagen







//------------------CARGA DE POST A API ------------------//






function  cargarPost(){
    const preimg=convertirAbase64()
    const nuevoposteo = {
        title: document.querySelector('#newtitulo').value,
        img: preimg,  //document.querySelector('#nuevaimg').value,
        //fecha y hora se ingresa de forma automatica, investigar
        fecha_hora: new Date()
    }
    console.log(nuevoposteo)
    //desde el json opciones se cargan los datos necesario para indicar al fetch que ejecutamos el metodo POST 
    // y los datos necesarios a cargar en la api (body y headers)

    const opciones = {
        method: 'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify(nuevoposteo)
    }
    fetch(urlposts, opciones)
    .then((response)=>{
        if (response.status === 201){
            return response.json()
        }
        else{
            throw new Error('no se pudo cargar ')
        }
    })
    .then((data)=>{
        //almaceno los datos de forma local para mostrarlos en el home, verificar el espacio que consume
        dialogo.close()
        obtenerPosts()
    })// una vez que se cargue el post de la API a la variable local ejecuto obtener post para mostrarlo en e home, se puede optimizar?*
    .catch((error)=>console.log(error))
}

//-----------------convertir img a Base64----------------//

function convertirAbase64() {
    const canvas = document.createElement('canvas') // Lienzo 
    canvas.width = nuevaimg.width
    canvas.height = nuevaimg.height

    const ctx = canvas.getContext('2d')
    //el metodo drawImage dibuja la imagen dentro del conetxto 2d indicado previamente. Necesita de coordenadas de inicio y fin, en esta caso asignaremos a coordenadas finales el ancho y alto de la imagen
    ctx.drawImage(nuevaimg, 0, 0, nuevaimg.width, nuevaimg.height)
    console.log(canvas.width,canvas.height)
    console.log(canvas)
    return canvas.toDataURL('image/webp')

}
/*function convertirAbase64A(imagen) {
    const canvas = document.createElement('canvas') // Lienzo 
    canvas.width = imagen.width
    canvas.height = imagen.height

    const ctx = canvas.getContext('2d')
    //el metodo drawImage dibuja la imagen dentro del conetxto 2d indicado previamente. Necesita de coordenadas de inicio y fin, en esta caso asignaremos a coordenadas finales el ancho y alto de la imagen
    ctx.drawImage(imagen, 0, 0, imagen.width, imagen.height)
   
    console.log(canvas)
    return canvas.toDataURL('image/webp')

}*/





botonCamara.addEventListener('click', ()=>inputCamara.click())
inputCamara.addEventListener('change',()=>{
    const imagencaptura = URL.createObjectURL(inputCamara.files[0])
    nuevaimg.src = imagencaptura
    dialogo.showModal()
})

btnCancelar.addEventListener('click', ()=> dialogo.close() )
btnSubir.addEventListener('click',()=>cargarPost())

window.onload = obtenerPosts()



//btnSubir.addEventListener('click', ()=>crearPosts())

//configurar la api de mockapi para almacenar imagenes y fecha-hora para mostrar todo correctamente
