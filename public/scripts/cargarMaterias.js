
const contenedorMaterias = document.getElementById("contenedorMaterias")

fetch('/api/materias').then(response => response.json())
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
                    //DEfine valores de uso global en la pagina 
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

