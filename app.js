import bodyParser from 'body-parser';
import express from 'express'
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise'

const app = express()

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const contrasena = await bcrypt.hash(password, 10);
  const [rows] = conexxion.query('select * from usuarios where email')


  console.log(email, password, contrasena);
  return res.json({ "hola": "mundo" });
})

app.post('/registro', async (req, res) => {
  const nombre = req.body.nombre;
  const email = req.body.email;
  const contrasena = await bcrypt.hash(req.body.contrasena, 10);
  console.log(nombre, email, contrasena);
  const respuesta = conexxion.query('insert into usuarios (nombre, email, contrasena) values ( ?, ?, ?)', [nombre, email, contrasena]);
  return res.json({ "registro": true })

})

app.listen(3000)

const conexxion = await mysql.createConnection({
  host: "localhost",
  user: "login",
  password: "Aprendiz2024",
  database: "node_login",
});