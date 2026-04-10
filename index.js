import express from "express";
import cors from "cors";

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
app.get("/validarfecha/:ano/:mes/:dia", (req, res) => {
    const { ano, mes, dia } = req.params;
    const fecha = `${ano}-${mes}-${dia}`;
    const fechaParseada = Date.parse(fecha);

    if (isNaN(fechaParseada)) {
        res.status(400).send("Fecha inválida");
    } else {
        res.status(200).send("Fecha válida");
    }
});

import { sumar, restar, multiplicar, dividir } from "../DAI-Tp01-HamuMizrahi/src/modules/matematica.js";

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

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});