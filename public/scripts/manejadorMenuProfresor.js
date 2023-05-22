const inputFile = document.getElementById('selecionPDF')
const nombreArchivo = document.getElementById('nombreArchivo')
const btnSubirArchivo = document.getElementById('subirArchivo')
const materia = document.getElementById('materiaLibro')
const contenedorMaterias = document.getElementById("contenedorMaterias")

const idProfesor = localStorage.getItem('idProfesor')

inputFile.addEventListener('change', () => {
    nombreArchivo.value = inputFile.value.split('\\').pop().split('.pdf')[0]
    console.log(inputFile.files[0])
})

btnSubirArchivo.addEventListener('click', () => {

    console.log(inputFile.files[0])

    const nuevoLibro = {
        nombre: "nombreArchivo", materia: 1, file: inputFile.files[0]
    }

    fetch('/api/add_libro/', {
        method: 'POST',
        body: JSON.stringify(nuevoLibro),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .catch(error => {
            console.log('Error al obtener los usuarios:', error);
        })
        .then(data => {
            console.log(data.mensaje)
        })
})

function mostrarVentana() {
    var ventana = document.getElementById("ventanaEmergente");
    ventana.style.display = "block";
}

function cerrarVentana() {
    var ventana = document.getElementById("ventanaEmergente");
    ventana.style.display = "none";
}

fetch('/api/materias/'+idProfesor).then(response => response.json())
    .then(data => {
        if (data) { //Si existen materias

            data.forEach(materia => {
                const enlace = document.createElement('a')
                enlace.href = 'Libros_Alumno.html'

                const botonMateria = document.createElement('button')
                botonMateria.classList.add('boton')
                botonMateria.textContent = materia.nombreMateria
                botonMateria.value = materia.idMateria

                botonMateria.addEventListener('click', e =>{
                    localStorage.setItem("idLibro", e.target.value)
                    localStorage.setItem('nombreMateria', materia.nombreMateria)
                })

                enlace.appendChild(botonMateria)
                contenedorMaterias.appendChild(enlace)
            });
        }
    }).catch(error => {
        console.error('Error al obtener las materias:', error)
    });