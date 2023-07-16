//const express = require("express");
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import oficinaRoutes from "./routes/oficinaRoutes.js";
import tareasRoutes from "./routes/tareasRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1 ) {
            //El origen del Request está permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions));

app.use("/api/oficina", oficinaRoutes);
app.use("/api/tareas", tareasRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=> {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});