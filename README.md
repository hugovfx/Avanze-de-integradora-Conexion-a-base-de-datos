# Avanze-de-integradora-Conexion-a-base-de-datos
Avanze de integradora con API
Este proyecto utiliza Express.js para crear una aplicación web simple. A continuación, se muestra el uso de la aplicación.

El proyecto tiene la siguiente estructura:

```java
Avanze-de-integradora-Conexion-a-base-de-datos/
├── public/
│   ├── css/
│   ├── login.hml
│   ├── register.hml
│   └── profile.html
├── .env
├── index.js
├── package.json
└── README.md

```

## Descripción de Archivos

- **public/**: Contiene los archivos estáticos (CSS, JavaScript, HTML).
  - **login.html**: Página de inicio de sesión.
  - **register.html**: Página de registro.
  - **profile.html**: Página de perfil del usuario.
- **.env**: Archivo de configuración de variables de entorno.
- **index.js**: Archivo principal de la aplicación donde se configura y arranca el servidor Express.
- **package.json**: Contiene las dependencias y scripts del proyecto.


# API Endpoints

Esta API tiene los siguientes endpoints:

## Endpoints

### GET /

Ruta para la página principal. Sirve el archivo `index.html`.

```js
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

### POST /register
Ruta para manejar el registro de usuarios. Inserta un nuevo usuario en la base de datos.

#### Parámetros esperados en el cuerpo de la solicitud:

- nombre: Nombre del usuario.
- apellido: Apellido del usuario.
- email: Correo electrónico del usuario.
- password: Contraseña del usuario.

```js
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
```

### POST /login
Ruta para manejar el inicio de sesión de usuarios. Verifica las credenciales del usuario en la base de datos.

#### Parámetros esperados en el cuerpo de la solicitud:

- email: Correo electrónico del usuario.
- password: Contraseña del usuario.

```js
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
```

## Configuración de la Base de Datos
#### La conexión a la base de datos MySQL se configura de la siguiente manera:

```js
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
```

## Middleware
#### Análisis de datos del formulario y JSON

```js
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
```

#### Servir archivos estáticos

```js
  app.use(express.static(path.join(__dirname, 'public')));
```

### Inicio del Servidor
El servidor se inicia en el puerto especificado en las variables de entorno o en el puerto 3000 por defecto.

```js
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });

```


