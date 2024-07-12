const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();


const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "soloyo77",
    database: "dbAplicacionesWeb",
    port: 3306
  });

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Middleware para analizar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para manejar el registro de usuarios
app.post('/register', (req, res) => {
    const { nombre, apellido, email, password } = req.body;
  
    const sql = 'INSERT INTO users (user_nombre, user_apellido, user_email, user_password) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, apellido, email, password], (err, result) => {
      if (err) {
        console.error('Error al registrar el usuario:', err);
        res.status(500).send('Error en el servidor');
        return;
      }
      // Redirigir al usuario a la página de inicio de sesión
      res.redirect('/login.html');
    });
  });

// Ruta para manejar el inicio de sesión de usuarios
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const sql = 'SELECT * FROM users WHERE user_email = ? AND user_password = ?';
    db.query(sql, [email, password], (err, results) => {
      if (err) {
        console.error('Error al verificar el usuario:', err);
        res.status(500).send('Error en el servidor');
        return;
      }
      if (results.length > 0) {
        // Si las credenciales son válidas, enviar el nombre del usuario en la respuesta
        res.status(200).send(`
        <html>
        <body style="display: flex; flex-direction: column; align-items: center;">
          <div style="border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); aling-self: center; padding: 25px">
            <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;" >Nombre: ${results[0].user_nombre}</br>
            Apellido: ${results[0].user_apellido}</br>
            Email: ${results[0].user_email}</p>
          </div>
          </body>
        </html>
          `);
      } else {
        // Si las credenciales no son válidas, enviar un mensaje de error
        res.status(401).send('Correo o contraseña incorrectos');
      }
    });
  });


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

