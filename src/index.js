import express from "express";
import cors from "cors";
import Alumno from "./models/alumno.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./modules/omdb-wrapper.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// A1
app.get("/", (req, res) => {
    res.status(200).send("¡Ya estoy respondiendo!");
});

// A2
app.get("/saludar/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    res.status(200).send(`Hola ${nombre}`);
});

// A3
app.get("/validarfecha/:año/:mes/:dia", (req, res) => {
    const { año, mes, dia } = req.params;
    const fecha = `${año}-${mes}-${dia}`;
    const fechaParseada = Date.parse(fecha);

    if (isNaN(fechaParseada)) {
        res.status(400).send("Fecha inválida");
    } else {
        res.status(200).send("Fecha válida");
    }
});

import { sumar, restar, multiplicar, dividir } from "./modules/matematica.js";

// B1
app.get("/matematica/sumar", (req, res) => {
    const { n1, n2 } = req.query;
    const resultado = sumar(Number(n1), Number(n2));
    res.status(200).send(String(resultado));
});

// B2
app.get("/matematica/restar", (req, res) => {
    const { n1, n2 } = req.query;
    const resultado = restar(Number(n1), Number(n2));
    res.status(200).send(String(resultado));
});

// B3
app.get("/matematica/multiplicar", (req, res) => {
    const { n1, n2 } = req.query;
    const resultado = multiplicar(Number(n1), Number(n2));
    res.status(200).send(String(resultado));
});

// B4
app.get("/matematica/dividir", (req, res) => {
    const { n1, n2 } = req.query;

    if (Number(n2) == 0) {
        return res.status(400).send("El divisor no puede ser cero");
    }

    const resultado = dividir(Number(n1), Number(n2));
    res.status(200).send(String(resultado));
});

// C1
app.get("/omdb/searchbypage", async (req, res) => {
    const search = req.query.search;
    const p = req.query.p;

    try {
        const resultado = await OMDBSearchByPage(search, p);

        return res.status(200).send({
            respuesta: resultado && resultado.length > 0,
            cantidadTotal: resultado ? resultado.length : 0,
            datos: resultado || []
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
    const search = req.query.search;

    try {
        const resultado = await OMDBSearchComplete(search);

        return res.status(200).send({
            respuesta: resultado && resultado.length > 0,
            cantidadTotal: resultado ? resultado.length : 0,
            datos: resultado || []
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
    const imdbID = req.query.imdbID;

    try {
        const resultado = await OMDBGetByImdbID(imdbID);

        return res.status(200).send({
            respuesta: resultado ? true : false,
            cantidadTotal: resultado ? 1 : 0,
            datos: resultado || {}
        });
    } catch (error) {
        return res.status(500).send({
            respuesta: false,
            cantidadTotal: 0,
            datos: {}
        });
    }
});
const alumnosArray = [];

alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

//D1
app.get("/alumnos", (req, res) => {
    return res.status(200).send(alumnosArray);
});
//D2
app.get("/alumnos/:dni", (req, res) => {
    const dni = req.params.dni;

    const alumno = alumnosArray.find(item => item.dni === dni);

    if (!alumno) {
        return res.status(404).send("Alumno no encontrado");
    }

    return res.status(200).send(alumno);
});
//D3
app.post("/alumnos", (req, res) => {
    const { username, dni, edad } = req.body;

    const nuevoAlumno = new Alumno(username, dni, edad);
    alumnosArray.push(nuevoAlumno);

    return res.status(201).send(nuevoAlumno);
});
//D4
app.delete("/alumnos", (req, res) => {
    const dni = req.body.dni;

    const index = alumnosArray.findIndex(item => item.dni === dni);

    if (index < 0) {
        return res.status(404).send("Alumno no encintrado");
    }

    alumnosArray.splice(index, 1);

    return res.status(200).send("Alumno eliminado");
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});