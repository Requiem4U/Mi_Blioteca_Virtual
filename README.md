# Mi_Blioteca_Virtual

## Resumen
Este es un proyecto de Sistemas Distribuidos, en el cual se crea un servidor junto a una API REST para hacer consultas, usando Node.js y Express (una libreria que se instala usando comandos npm de node)
Tambien se incluye una pagina web (./public) la cual es mostrada al ingresar a la url definida al levantar el servido (./servidor.js).

En el archivo servidor.js se define la API para hacer consultas al servidor, el cual usa una base de datos sqlite en la que estan definidas tablas relacionales para usuarios, materias y libros.
La API  define metodos GET y POST para usuarios, materias y libros, segun ciertas espesificaciones como id de materia.

## Funcionamineto

De manera general, los usuarios pueden acceder mediante un login

<picture>
  <img alt="Vista descargar" src="https://github.com/Requiem4U/Mi_Blioteca_Virtual/blob/main/vistas/login.png">
</picture>

Tambien se pueden registrar usuarios

<picture>
  <img alt="Vista descargar" src="https://github.com/Requiem4U/Mi_Blioteca_Virtual/blob/main/vistas/singup.png">
</picture>

Los usuario pueden obserbar todas las materias disponibles en el caso de ser alumno

<picture>
  <img alt="Vista descargar" src="https://github.com/Requiem4U/Mi_Blioteca_Virtual/blob/main/vistas/materiasAlumno.png">
</picture>

Ver las materias que imparten, si es profesor

<picture>
  <img alt="Vista descargar" src="https://github.com/Requiem4U/Mi_Blioteca_Virtual/blob/main/vistas/materiasProf.jpg">
</picture>

El profesor tambien tiene la opción de subir un archivo PDF

<picture>
  <img alt="Vista descargar" src="https://github.com/Requiem4U/Mi_Blioteca_Virtual/blob/main/vistas/subir.jpg">
</picture>

Y ambos usuarios pueden descargar los archivos que estan en la base de datos

<picture>
  <img alt="Vista descargar" src="https://github.com/Requiem4U/Mi_Blioteca_Virtual/blob/main/vistas/descargaAlumno.jpg">
</picture>
