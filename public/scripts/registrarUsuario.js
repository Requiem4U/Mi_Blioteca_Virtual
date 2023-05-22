const inputCorreo = document.getElementById("correo")
const inputContrasena = document.getElementById("contraseña")
const inputNombre = document.getElementById('nombre')
const inputTipoUsuario = document.getElementsByName('usuario')

const registrarUsuario = document.getElementById("registrarUsuario")

const mensajeRegistro = document.getElementById("mensajeRegistro")

let tipoUsuario = ''

inputTipoUsuario.forEach(tipo => {
    //Cambia el valor del tipo de Usuario cuando se le da click a una opcion
    tipo.addEventListener('click',(e)=>{ 
        tipoUsuario = e.target.value
        
        mensajeRegistro.textContent = ''
    })
})

registrarUsuario.addEventListener("click", () => {

    const correo = inputCorreo.value
    const contrasena = inputContrasena.value
    const nombre = inputNombre.value
    
    if(tipoUsuario==''){
        mensajeRegistro.textContent = 'Seleccione si es Alumno o Profesor'
        return
    }

    const nuevoUsuario = {
        tipo: tipoUsuario, nombre: nombre, email: correo, contrasena: contrasena
    }

    fetch('/api/usuarios/' + correo)
        .then(response => response.json())
        .then(data => {
            // verificar si el correo ya esta registrado
            if (!data.existe) {
                fetch('/api/add_usuario/', {
                    method: 'POST',
                    body: JSON.stringify(nuevoUsuario),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                    .catch(error => {
                        console.error('Error al obtener los usuarios:', error);
                    })
                    .then(data => {
                        if (tipoUsuario == 'alumno') {
                            window.location.href = "menu_alumno.html"
                        } else {
                            localStorage.setItem('idProfesor', data.id)
                            window.location.href = "menu_profesor.html"
                        }
                    })
            } else {
                mensajeRegistro.textContent = 'Correo ya registrado'
            }
        })
        .catch(error => {
            console.error('Error al obtener los usuarios:', error);
        });

})

inputCorreo.addEventListener('focus', () => {
    mensajeRegistro.textContent = ''
})

inputContrasena.addEventListener('focus', () => {
    mensajeRegistro.textContent = ''
})

inputNombre.addEventListener('focus', () => {
    mensajeRegistro.textContent = ''
})