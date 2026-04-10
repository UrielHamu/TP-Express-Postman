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
import fetch from "node-fetch";

const API_KEY = "31091a4a";

// C1
app.get("/omdb/searchbypage", async (req, res) => {
    const { search, p } = req.params;

    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&page=${p}`);
        const data = await response.json();

        res.status(200).json(data.Search || []);
    } catch (error) {
        res.status(400).send("Error");
    }
});

// C2
app.get("/omdb/searchcomplete", async (req, res) => {
    const { search } = req.query;

    try {
        let pagina = 1;
        let resultados = [];
        let total = 0;

        do {
            const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&page=${pagina}`);
            const data = await response.json();

            if (data.Response === "False") break;

            resultados = resultados.concat(data.Search);
            total = parseInt(data.totalResults);
            pagina++;
        } while (resultados.length < total);

        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).send("Error");
    }
});

// C3
app.get("/omdb/getbyomdbid", async (req, res) => {
    const { imdbID } = req.query;

    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
        const data = await response.json();

        res.status(200).json(data || {});
    } catch (error) {
        res.status(500).send("Error");
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});