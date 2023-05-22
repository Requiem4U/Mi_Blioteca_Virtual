const correo = document.getElementById("correo")
const contrasena = document.getElementById("contraseña")

const btnInicioSesion = document.getElementById("btnInicioSesion")

const mensajeCorreo = document.getElementById("mensajeCorreo")
const mensajePass = document.getElementById("mensajePass")

btnInicioSesion.addEventListener("click", () => {

    const correoTxt = correo.value

    fetch('/api/usuarios/' + correoTxt)
        .then(response => response.json())
        .then(data => {
            // Manejar los datos obtenidos
            if (data.existe) {
                if (data.contrasena != null) {
                    if (data.contrasena == contrasena.value) {
                        if (data.tipo == 'alumno') {
                            window.location.href = "menu_alumno.html"
                        } else {
                            localStorage.setItem('idProfesor', data.id)
                            window.location.href = "menu_profesor.html"
                        }
                    } else {
                        mensajePass.textContent = 'Contraseña no valida'
                    }
                }
            } else {
                mensajeCorreo.textContent = 'Correo no valido'
            }
        })
        .catch(error => {
            console.log('Error al obtener los usuarios:', error);
        });
})

correo.addEventListener('focus', () => {
    mensajeCorreo.textContent = ''
    mensajePass.textContent = ''
})

contrasena.addEventListener('focus', () => {
    mensajeCorreo.textContent = ''
    mensajePass.textContent = ''
})