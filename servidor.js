const express = require('express');
const db = require('./database');
const multer = require('multer');
const upload = multer({ dest: 'recursos/' });

const app = express();

// Configura el middleware para el manejo de JSON
app.use(express.json());
//Define la página por defecto al ingresar a la url
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//============================ Definicion rutas REST ============================//

//============= Api Usuarios =============//
// -- Obtener todos los usuarios --
app.get('/api/usuarios', (_req, res) => {
    db.all('SELECT * FROM usuarios', (err, rows) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        } else {
            res.json(rows);
        }
    });
});

// -- Obtener usuario por su correo --
app.get('/api/usuarios/:correo', (req, res) => {
    const correo = req.params.correo;

    // Consultar si existe un usuario con el email 
    db.get('SELECT contrasena, tipoUsuario, idUsuario FROM usuarios WHERE email = ?', [correo], (err, row) => {
        if (err) {
            console.error('Error al consultar el usuario:', err);
            res.status(500).json({ error: 'Error al consultar el usuario' });
        } else {
            // Verifica si existe un usuario con el email y notifica el estado
            if (row) {
                //Envia los datos si estan diponibles
                res.json({ existe: true, contrasena: row.contrasena, tipo: row.tipo, id: row.idUsuario });
            } else {
                res.json({ existe: false });
            }
        }
    });
});

// -- Crear usuario --
app.post('/api/add_usuario', (req, res) => {
    const { tipo, nombre, email, contrasena } = req.body;

    //Verifica que se cumpla con todos los campos
    if (!tipo || !nombre || !email || !contrasena) {
        res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        return;
    }

    //Inserta al usuario
    const stmt = db.prepare('INSERT INTO usuarios (tipoUsuario, nombreUsuario, email, contrasena) VALUES (?, ?, ?, ?)');
    stmt.run(tipo, nombre, email, contrasena, function (err) {
        if (err) {
            console.error('Error al crear el usuario:', err);
            res.status(500).json({ mensaje: 'Error al crear el usuario' });
        } else {
            res.json({ mensaje: 'Usuario agregado exitosamente' });
        }
    });
});

// -- Actualizar usuario --
app.put('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        res.status(400).json({ error: 'Faltan datos requeridos' });
        return;
    }

    const stmt = db.prepare('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?');
    stmt.run(nombre, email, id, function (err) {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        } else {
            if (this.changes === 0) {
                res.status(404).json({ error: 'Usuario no encontrado' });
            } else {
                res.json({ id, nombre, email });
            }
        }
    });
});

//============= Fin Api Usuarios =============//

//================== Api Libros ==================//

// -- Obtener libros segun la materia --
app.get('/api/libros/:idMateria', (req, res) => {
    const materia = req.params.idMateria;

    // Consultar si existen libros para la meteria
    db.all('SELECT libros.nombrelibro, libros.recurso FROM (materia_libros JOIN libros ON materia_libros.idLibro = libros.idLibro) WHERE materia_libros.idMateria = ?', [materia], (err, rows) => {
        if (err) {
            console.error('Error al consultar el libro:', err);
            res.status(500).json({ error: 'Error al consultar el libro' });
        } else {
            //Verifica si hay libros para la materia y notifica el estado
            if (rows && !(rows.length === 0)) { //Envia los datos si estan disponibles

                //Se define una lista de libros con atributos personalizados
                const listaLbros = []
                rows.forEach(row => {
                    listaLbros.push({
                        nombre: row.nombreLibro,
                        recurso: row.recurso
                    })
                })

                res.json({
                    existe: true,
                    libros: listaLbros
                });
            } else {
                res.json({ existe: false });
            }
        }
    });
});

// -- Agregar Libro --
app.post('/api/add_libro', upload.single('pdf'), (req, res) => {
    const { nombre, materia } = req.body;
    const recurso = req.file

    //Comprueba que los campos esten completos
    if (!nombre || !recurso || !materia) {
        res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        return;
    }

    let msg = 'Error al agregar el libro'
    const baseUrl = window.location.origin;
    const rutaArchivoPDF = `${baseUrl}/recursos/${recurso}`;
    recurso.mv(rutaArchivoPDF, e => {
        if (e) {
            console.log('Error al guardar archivo')
        } else {
            const stmt = db.prepare('INSERT INTO libros (nombreLibro, recurso) VALUES (?,?)');
            stmt.run(nombre, rutaArchivoPDF, function (err) {
                if (err) {
                    console.error(msg + ' :', err);
                    res.status(500).json({ mensaje: msg });
                } else {
                    //Se inserto el libro
                    //Se toma su id
                    db.get('SELECT idlibro FROM libros ORDER BY idLibro DESC', (err, row2) => {
                        if (err) {
                            console.error('Error al consultar el id del libro:', err);
                        } else {
                            //Sse comprueba que se obtuvó el id
                            if (row2) {
                                const idLibro = row2.idLibro
                                if (idLibro != 0) {
                                    //Se agrega la relacion libro materia
                                    const stmt2 = db.prepare('INSERT INTO materia_libros (idLibro, idMateria) VALUES (?,?)')
                                    stmt2.run(idLibro, materia, err => {
                                        if (err) {
                                            console.error('Error al consultar el id del libro:', err);
                                            msg = 'no se pudo insertar la relacion libro-materia'
                                        } else {
                                            //Notifica exito
                                            msg = 'libro agregado exitosamente'
                                            res.json({ mensaje: msg });
                                        }
                                    })
                                }

                            }
                        }
                    });
                }
            });

        }
    })
});

// -- Eliminar Libro --
app.delete('/api/libros/:id', (req, res) => {
    const id = req.params.id;

    const stmt = db.prepare('DELETE FROM libros WHERE idLibro = ?');
    stmt.run(id, function (err) {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        } else {
            if (this.changes === 0) {
                res.status(404).json({ error: 'Libro no encontrado' });
            } else {
                res.json({ mensaje: 'Libro eliminado exitosamente' });
            }
        }
    });
});

//================== Fin Api Libros ==================//

//====================== Api Materias ======================//

// -- Obtener todas las materias --
app.get('/api/materias', (_req, res) => {
    db.all('SELECT * FROM materias', (err, rows) => {
        if (err) {
            console.error('Error al obtener las materas:', err);
            res.status(500).json({ error: 'Error al obtener las materias' });
        } else {
            res.json(rows);
        }
    });
});

// -- Obtener materias según el maestro --
app.get('/api/materias/:idProfesor', (req, res) => {

    const idProfesor = req.params.idProfesor

    db.all('SELECT materias.idMateria, materias.nombreMateria FROM materias JOIN profesor_materia ON materias.idMateria = profesor_materia.idMateria WHERE profesor_materia.idProfesor = ? ',
        [idProfesor], (err, rows) => {
            if (err) {
                console.error('Error al obtener las materias:', err);
                res.status(500).json({ error: 'Error al obtener las materias del profesor' });
            } else {
                res.json(rows);
            }
        });
});

// -- Agregar Materia --
app.post('/api/add_materia', (req, res) => {
    const { nombre } = req.body;

    //Verifica que se cumpla con todos los campos
    if (!nombre) {
        res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        return;
    }

    //Inserta la materia
    const stmt = db.prepare('INSERT INTO materias (nombreMateria) VALUES (?)');
    stmt.run(nombre, function (err) {
        if (err) {
            console.error('Error al crear la materia:', err);
            res.status(500).json({ mensaje: 'Error al crear la materia' });
        } else {
            res.json({ mensaje: 'Materia agregada exitosamente' });
        }
    });
});

//====================== Fin Api Materias ======================//

//========== Define host y puerto ==========//
const IP_Host = '10.0.144.11'
const port = 3000;

//========== Inicia el servidor ==========//
app.listen(port, IP_Host,() => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
