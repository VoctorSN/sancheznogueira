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
import authRoutes from "./authRoutes.js"; // ruta al router backend
import contactoRoutes from "./contactoRoutes.js"; // ruta al router backend
import chatRoutes from "./chatRoutes.js"; // ruta al router del chat de Gemini
import paypalRoutes from "./paypalRoutes.js"; // ruta al router de PayPal
import stripeRoutes from "./stripeRoutes.js"; // ruta al router de Stripe
import facturasRoutes from "./facturasRoutes.js"; // ruta al router de Facturas

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;  // Use PORT from environment or default to 5000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware - Configuración de CORS mejorada para servicios externos
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"]
}));

app.use(express.json());

// Rutas DE MONGOOSE, JSON SERVER NO ES NECESARIO LAS RUTAS LAS CREA AUTOMATICAMENTE
// json-server es un backend ya construido.
// Express es un backend que TÚ construyes.
// Por eso json-server no requiere rutas y Express sí.
app.use("/api/articulos", articulosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/chat", chatRoutes); // Ruta del chat con Gemini
app.use("/api/paypal", paypalRoutes); // Ruta de PayPal
app.use("/api/stripe", stripeRoutes); // Ruta de Stripe
app.use("/api/facturas", facturasRoutes); // Ruta de Facturas

// Verificar variable
console.log("🔍 MONGODB_URI =", process.env.MONGODB_URI);

/// Conexión a MongoDB 

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB a la base de datos BBDD");
        console.log("📊 Base de datos:", mongoose.connection.db.databaseName);
    })
    .catch((err) => {
        console.error("❌ Could not connect to MongoDB:", err);
        console.error("Verifica que MongoDB esté corriendo: mongod --dbpath C:\\mongodb\\data");
    });

// Log cuando la conexión se pierde
mongoose.connection.on('disconnected', () => {
    console.error('⚠️ MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de MongoDB:', err);
});




//Iniciar el servidor Express en el puerto especificado
app.listen(PORT, () => {
    console.log(`Server Express está corriendo en el puerto: ${PORT}`);
});