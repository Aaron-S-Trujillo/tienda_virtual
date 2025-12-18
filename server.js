const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // tu contraseña si tienes
  database: 'tienda_virtual'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Registro de usuario
app.post('/register', (req, res) => {
  const { nombre, email, contrasenia } = req.body;

  const sql = 'INSERT INTO usuarios (nombre, email, contrasenia) VALUES (?, ?, ?)';

  db.query(sql, [nombre, email, contrasenia], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      return res.json({ success: false, message: 'Error en el registro' });
    }

    res.json({ success: true, message: 'Usuario registrado correctamente' });
  });
});

// Inicio de sesión
app.post('/login', (req, res) => {
  const { email, contrasenia } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ? AND contrasenia = ?';

  db.query(sql, [email, contrasenia], (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.json({ success: false });
    }

    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});