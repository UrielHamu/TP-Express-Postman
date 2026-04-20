import express from "express";
import cors from "cors";
import Alumno from "./models/alumno.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./modules/omdb-wrapper.js";
import { sumar, restar, multiplicar, dividir } from "./modules/matematica.js";
import ValidacionesHelper from "./modules/validaciones-helper.js";
import DateTimeHelper from "./modules/datetime-helper.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const alumnosArray = [];

alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

// A1
app.get("/", (req, res) => {
  res.status(200).send("¡Ya estoy respondiendo!");
});

// A2
app.get("/saludar/:nombre", (req, res) => {
  const nombre = ValidacionesHelper.getStringOrDefault(req.params.nombre, "Anónimo");
  res.status(200).send(`Hola ${nombre}`);
});

// A3
app.get("/validarfecha/:ano/:mes/:dia", (req, res) => {
  const ano = ValidacionesHelper.getIntegerOrDefault(req.params.ano, 0);
  const mes = ValidacionesHelper.getIntegerOrDefault(req.params.mes, 0);
  const dia = ValidacionesHelper.getIntegerOrDefault(req.params.dia, 0);

  if (ano === 0 || mes === 0 || dia === 0) {
    return res.status(400).send("Fecha inválida");
  }

  const fecha = new Date(`${ano}-${mes}-${dia}`);

  if (!DateTimeHelper.isDate(fecha)) {
    return res.status(400).send("Fecha inválida");
  }

  return res.status(200).send("Fecha válida");
});

// B1
app.get("/matematica/sumar", (req, res) => {
  const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
  const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

  if (n1 === null || n2 === null) {
    return res.status(400).send("n1 y n2 deben ser números enteros");
  }

  const resultado = sumar(n1, n2);
  return res.status(200).send(String(resultado));
});

// B2
app.get("/matematica/restar", (req, res) => {
  const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
  const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

  if (n1 === null || n2 === null) {
    return res.status(400).send("n1 y n2 deben ser números enteros");
  }

  const resultado = restar(n1, n2);
  return res.status(200).send(String(resultado));
});

// B3
app.get("/matematica/multiplicar", (req, res) => {
  const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
  const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

  if (n1 === null || n2 === null) {
    return res.status(400).send("n1 y n2 deben ser números enteros");
  }

  const resultado = multiplicar(n1, n2);
  return res.status(200).send(String(resultado));
});

// B4
app.get("/matematica/dividir", (req, res) => {
  const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
  const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

  if (n1 === null || n2 === null) {
    return res.status(400).send("n1 y n2 deben ser números enteros");
  }

  if (n2 === 0) {
    return res.status(400).send("El divisor no puede ser cero");
  }

  const resultado = dividir(n1, n2);
  return res.status(200).send(String(resultado));
});

// C1
app.get("/omdb/searchbypage", async (req, res) => {
  const search = ValidacionesHelper.getStringOrDefault(req.query.search, "");
  const p = ValidacionesHelper.getIntegerOrDefault(req.query.p, 1);

  try {
    const resultado = await OMDBSearchByPage(search, p);

    return res.status(200).send({
      respuesta: resultado ? resultado.respuesta : false,
      cantidadTotal: resultado ? Number(resultado.cantidadTotal) || 0 : 0,
      datos: resultado?.datos || []
    });
  } catch (error) {
    return res.status(500).send({
      respuesta: false,
      cantidadTotal: 0,
      datos: []
    });
  }
});

// C2
app.get("/omdb/searchcomplete", async (req, res) => {
  const search = ValidacionesHelper.getStringOrDefault(req.query.search, "");

  if (search === "") {
    return res.status(400).send("El parámetro search es obligatorio");
  }

  try {
    const resultado = await OMDBSearchComplete(search);

    return res.status(200).send({
      respuesta: resultado ? resultado.respuesta : false,
      cantidadTotal: resultado ? Number(resultado.cantidadTotal) || 0 : 0,
      datos: resultado?.datos || []
    });
  } catch (error) {
    return res.status(500).send({
      respuesta: false,
      cantidadTotal: 0,
      datos: []
    });
  }
});

// C3
app.get("/omdb/getbyomdbid", async (req, res) => {
  const imdbID = ValidacionesHelper.getStringOrDefault(req.query.imdbID, "");

  if (imdbID === "") {
    return res.status(400).send("El parámetro imdbID es obligatorio");
  }

  try {
    const resultado = await OMDBGetByImdbID(imdbID);

    return res.status(200).send({
      respuesta: resultado ? resultado.respuesta : false,
      cantidadTotal: resultado ? Number(resultado.cantidadTotal) || 0 : 0,
      datos: resultado?.datos || {}
    });
  } catch (error) {
    return res.status(500).send({
      respuesta: false,
      cantidadTotal: 0,
      datos: {}
    });
  }
});

// D1
app.get("/alumnos", (req, res) => {
  return res.status(200).send(alumnosArray);
});

// D2
app.get("/alumnos/:dni", (req, res) => {
  const dni = ValidacionesHelper.getStringOrDefault(req.params.dni, "");

  const alumno = alumnosArray.find((item) => item.dni === dni);

  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  return res.status(200).send(alumno);
});

// D3
app.post("/alumnos", (req, res) => {
  const username = ValidacionesHelper.getStringOrDefault(req.body.username, "");
  const dni = ValidacionesHelper.getStringOrDefault(req.body.dni, "");
  const edad = ValidacionesHelper.getIntegerOrDefault(req.body.edad, 0);

  if (username === "" || dni === "" || edad === 0) {
    return res.status(400).send("username, dni y edad son obligatorios");
  }

  const nuevoAlumno = new Alumno(username, dni, edad);
  alumnosArray.push(nuevoAlumno);

  return res.status(201).send(nuevoAlumno);
});

// D4
app.delete("/alumnos", (req, res) => {
  const dni = ValidacionesHelper.getStringOrDefault(req.body.dni, "");

  if (dni === "") {
    return res.status(400).send("El dni es obligatorio");
  }

  const index = alumnosArray.findIndex((item) => item.dni === dni);

  if (index < 0) {
    return res.status(404).send("Alumno no encontrado");
  }

  alumnosArray.splice(index, 1);

  return res.status(200).send("Alumno eliminado");
});

// E1
app.get("/fechas/isDate", (req, res) => {
  const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);

  if (!DateTimeHelper.isDate(fecha)) {
    return res.status(400).send("Fecha inválida");
  }

  return res.status(200).send({
    valido: true
  });
});

// E2
app.get("/fechas/getEdadActual", (req, res) => {
  const fechaNacimiento = ValidacionesHelper.getDateOrDefault(req.query.fechaNacimiento, null);

  if (!DateTimeHelper.isDate(fechaNacimiento)) {
    return res.status(400).send("Fecha inválida");
  }

  return res.status(200).send({
    edad: DateTimeHelper.getEdadActual(fechaNacimiento)
  });
});

// E3
app.get("/fechas/getDiasHastaMiCumple", (req, res) => {
  const fechaNacimiento = ValidacionesHelper.getDateOrDefault(req.query.fechaNacimiento, null);

  if (!DateTimeHelper.isDate(fechaNacimiento)) {
    return res.status(400).send("Fecha inválida");
  }

  return res.status(200).send({
    diasRestantes: DateTimeHelper.getDiasHastaMiCumple(fechaNacimiento)
  });
});

// E4
app.get("/fechas/getDiaTexto", (req, res) => {
  const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);
  const abr = ValidacionesHelper.getBooleanOrDefault(req.query.abr, false);

  if (!DateTimeHelper.isDate(fecha)) {
    return res.status(400).send("Fecha inválida");
  }

  return res.status(200).send({
    dia: DateTimeHelper.getDiaTexto(fecha, abr)
  });
});

// E5
app.get("/fechas/getMesTexto", (req, res) => {
  const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);
  const abr = ValidacionesHelper.getBooleanOrDefault(req.query.abr, false);

  if (!DateTimeHelper.isDate(fecha)) {
    return res.status(400).send("Fecha inválida");
  }

  return res.status(200).send({
    mes: DateTimeHelper.getMesTexto(fecha, abr)
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});