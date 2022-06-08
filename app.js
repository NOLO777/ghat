const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const btnAcceder = document.querySelector('#btnAcceder')

firebase.auth().onAuthStateChanged(user => {
    if(user){
        nombreUsuario.innerHTML = user.displayName
        accionCerrarSesion()
    }else{
        accionAcceder()
        console.log('usuario no registrado')
        nombreUsuario.innerHTML = 'ChatTiger'
        contenidoWeb.innerHTML = /*html*/`
            <p class="lead mt-5 text-center">“Hay sólo dos clases de lenguajes de programación: aquellos de los que la gente está siempre quejándose y aquellos que nadie usa”.


Bjarne Stroustrup</p>
        `
    }
})

const accionAcceder = () => {

    botones.innerHTML = /*html*/`
        <button class="btn btn-outline-success" id="btnAcceder">Acceder</button>
    `
    
    const btnAcceder = document.querySelector('#btnAcceder')
    
    btnAcceder.addEventListener('click', async() => {
        console.log('entro')
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            console.log(error)
        }
    })

}

const accionCerrarSesion = () => {
    botones.innerHTML = /*html*/`
        <button class="btn btn-outline-danger" id="btnCerrar">Cerrar Sesión</button>
    `
    const btnCerrar = document.querySelector('#btnCerrar')
    btnCerrar.addEventListener('click', () => firebase.auth().signOut())
    firebase.auth().onAuthStateChanged(user => {
        if(user){
            formulario.classList = 'input-group mb-3 fixed-bottom container'
            contenidoChat(user)
        }else{
            formulario.classList = 'input-group mb-3 fixed-bottom container d-none'
        }
    })
    const contenidoChat = (user) => {

        formulario.addEventListener('submit', event => {
            event.preventDefault()
            console.log(texto.value)
            if(!texto.value.trim()){
                console.log('texto vacio')
                return
            }
            firebase.firestore().collection('chat').add({
                texto: texto.value,
                uid: user.uid,
                fecha: Date.now()
            }).then(res => {
                console.log('texto agregado')
            })
            texto.value = ''
        })
    
        firebase.firestore().collection('chat').orderBy('fecha')
            .onSnapshot(query => {
                query.forEach(doc => {
                    if(user.uid === doc.data().uid){
                        contenidoWeb.innerHTML += /*html*/`
                        <div class="d-flex justify-content-end mb-2">
                            <span class="badge badge-primary">
                                ${doc.data().texto}
                            </span>
                        </div>
                        `
                    }else{
                        contenidoWeb.innerHTML += /*html*/`
                        <div class="d-flex justify-content-start mb-2">
                            <span class="badge badge-secondary">${doc.data().texto}</span>
                        </div>
                        `
                    }
                    contenidoWeb.scrollTop = contenidoWeb.scrollHeight
                })
            })
    
    }
}