import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// a diferencia de json-server, aquí necesita configurar las rutas y controladores manualmente
// json-server crea automáticamente las rutas basadas en el archivo JSON, mongoose requiere definir esquemas y modelos
// MONGOSEE NO SABE NADA DE RUTAS CONTROLADRES Y MODELOS, HAY QUE CREARLOS MANUALMENTE

import articulosRoutes from "./articulosRoutes.js"; // ruta al router backend

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;  // Use PORT from environment or default to 5000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors()); // si no funciona lo siguiente

/* app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
})); */

app.use(express.json());

// Rutas DE MONGOOSE, JSON SERVER NO ES NECESARIO LAS RUTAS LAS CREA AUTOMATICAMENTE
// json-server es un backend ya construido.
// Express es un backend que TÚ construyes.
// Por eso json-server no requiere rutas y Express sí.
app.use("/api/articulos", articulosRoutes);

// Verificar variable
//console.log("MONGODB_URI =", process.env.MONGODB_URI);

/// Conexión a MongoDB 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB a la base de datos BBDD"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));




//Iniciar el servidor Express en el puerto especificado
app.listen(PORT, () => {
    console.log(`Server Express está corriendo en el puerto: ${PORT}`);
});