import bodyParser from 'body-parser';
import express from 'express'
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'

const app = express()

const validarToken = (req, res, nex) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer  ")) {
      return res.json({ 'mensaje': "Solicitud sin token" })
    }
    const token = authHeader.split("  ")[1];
    const deco = jwt.verify(token, "secret");

    nex();
  } catch (error) {
    return res.json({ 'mensaje': "Token invalido o expiro" })
  }

}


app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));



app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const [rows] = await conexion.query('select * from usuarios where email = ?', [email])

  console.log(rows[0]);
  const esValido = await bcrypt.compare(password, rows[0].contrasena)
  if (esValido) {
    const token = generarToken();
    const tokenRefresh = generarTokenRefresh();
    const dbFresh = await conexion.query('UPDATE usuarios SET refreshToken = ? where email = ? ', [tokenRefresh, email])
    console.log(token);
    return res.json({
      mensaje: "usuario autenticado",
      token: token,
      tokenFresh: tokenRefresh
    })


  } else {
    console.log("no autenticado");
    return res.json({
      mensaje: "usuario no autenticado"
    })

  }
  return res.json({ "hola": "mundo" });
})


app.post('/registro', async (req, res) => {
  const nombre = req.body.nombre;
  const email = req.body.email;
  const contrasena = await bcrypt.hash(req.body.contrasena, 10);
  console.log(nombre, email, contrasena);
  const respuesta = conexion.query('insert into usuarios (nombre, email, contrasena) values ( ?, ?, ?)', [nombre, email, contrasena]);
  return res.json({ "registro": true })

})

app.post('/refrescar', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const email = req.body.email
    if (!authHeader || !authHeader.startsWith("Bearer  ")) {
      return res.json({ 'mensaje': "Solicitud sin token" })
    }
    const token = authHeader.split("  ")[1];
    const deco = jwt.verify(token, "secretRefresh");
    console.log(deco.data, email);


  } catch (error) {
    return res.json({ 'mensaje': "Token invalido o expiro" })
  }


})

app.get('/privada', validarToken, (req, res) => {
  console.log("Ingresamos a la ruta privada");

})

app.listen(3000)

const conexion = await mysql.createConnection({
  host: "localhost",
  user: "login",
  password: "Aprendiz2024",
  database: "node_login",
});

const generarToken = (usuario) => {
  return jwt.sign({
    data: usuario.email
  }, 'secret', { expiresIn: '5m' });

}

const generarTokenRefresh = (usuario) => {
  return jwt.sign({
    data: usuario.email
  }, 'secretRefresh', { expiresIn: '7d' });

}


