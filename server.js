const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MySQL usando variables de Railway
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Verificar conexión
db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL en Railway');
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registro de usuarios
app.post('/registro', (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  const query = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';
  db.query(query, [nombre, correo, contraseña], (err, result) => {
    if (err) {
      console.error('Error registrando usuario:', err);
      return res.status(500).json({ mensaje: 'Error en el registro' });
    }
    res.json({ mensaje: 'Usuario registrado correctamente' });
  });
});

// Login de usuarios
app.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  const query = 'SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?';
  db.query(query, [correo, contraseña], (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    if (results.length > 0) {
      res.json({ mensaje: 'Login exitoso' });
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });
});

// Puerto para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});