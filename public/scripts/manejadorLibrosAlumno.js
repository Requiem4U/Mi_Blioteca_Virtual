//Captura valores globlaes
const idMateria = localStorage.getItem("idLibro")
const nombreMateria = localStorage.getItem("nombreMateria")

const contenedorlibros = document.getElementById('libros')
const tituloMateria = document.getElementById('nombreMateria')
tituloMateria.textContent = nombreMateria

fetch('/api/libros/' + idMateria)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // Manejar los datos obtenidos
        if (data.existe) {
            data.libros.forEach(libro => {
                console.log(libro)
                const enlace = document.createElement('a')
                enlace.href = libro.recurso
                enlace.download = true

                const botonMateria = document.createElement('button')
                botonMateria.classList.add('boton')
                botonMateria.textContent = libro.nombre

                enlace.appendChild(botonMateria)
                contenedorlibros.appendChild(enlace)
            });
        }
    })
    .catch(error => {
        console.error('Error al obtener los usuarios:', error);
    });

