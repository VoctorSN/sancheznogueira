// server/articulosRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Articulo from "../model/Articulo.js";
import { fileURLToPath } from "url";
import fs from 'fs';

// inicializar configuración de multer para manejo de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurarse de que la carpeta uploads exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Crear el router
const router = express.Router();



// Configuración de almacenamiento de multer en la carpeta uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // ruta absoluta a server/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Inicializar multer
const upload = multer({ storage: storage });

// AHORA VIENEN LAS RUTAS USANDO EL router DE EXPRESS
// Obtener todos los artículo
router.get("/", async (req, res) => {
    const articulos = await Articulo.find();
    res.json(articulos);
});

// Ruta de búsqueda de artículos por marca, modelo o descripción
// IMPORTANTE: Esta ruta debe estar ANTES de "/:id" para evitar que "buscar" se interprete como un ID
router.get("/buscar", async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({ error: "Parámetro de búsqueda 'q' es requerido" });
        }

        // Buscar en MongoDB usando expresiones regulares (case insensitive)
        const articulos = await Articulo.find({
            $or: [
                { marca: { $regex: q, $options: 'i' } },
                { modelo: { $regex: q, $options: 'i' } },
                { descripcion: { $regex: q, $options: 'i' } }
            ]
        });

        res.json(articulos);
    } catch (err) {
        console.error("Error en búsqueda de artículos:", err);
        res.status(500).json({ error: err.message });
    }
});

// Cambiar estado de múltiples vehículos a vendido
// IMPORTANTE: Esta ruta debe estar ANTES de "/:id" para evitar que "vendido" se interprete como un ID
router.put("/vendido", async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Se requiere un array de IDs" });
        }

        // Actualizar todos los vehículos con los IDs proporcionados
        const resultado = await Articulo.updateMany(
            { _id: { $in: ids } },
            { $set: { estado: "vendido" } }
        );

        res.json({
            mensaje: `${resultado.modifiedCount} vehículo(s) marcado(s) como vendido(s)`,
            modificados: resultado.modifiedCount
        });
    } catch (err) {
        console.error("Error actualizando estado de vehículos:", err);
        res.status(500).json({ error: err.message });
    }
});

// Guardar artículo con imagen
router.post("/", upload.single('imagen'), async (req, res) => {
    try {
        if (!req.body.vehiculo) {
            console.error("No se recibió el campo 'vehiculo'");
            return res.status(400).json({ error: "Campo 'vehiculo' vacío" });
        }

        let datos;
        try {
            datos = JSON.parse(req.body.vehiculo);
        } catch (e) {
            console.error("Error parseando JSON:", e.message);
            return res.status(400).json({ error: "JSON inválido en 'vehiculo'", detalle: e.message });
        }

        if (req.file) {
            datos.imagen = `/uploads/${req.file.filename}`;
        }

        const articulo = new Articulo(datos);
        const guardado = await articulo.save();
        res.json(guardado);

    } catch (err) {
        console.error("Error guardando artículo:", err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// Actualizar artículo individual con imagen (usa multipart/form-data)
router.put("/:id", upload.single('imagen'), async (req, res) => {
    try {
        if (!req.body.vehiculo) {
            console.error("PUT /:id - No se recibió el campo 'vehiculo' para actualización individual");
            console.log("Body: " + req.body);
            return res.status(400).json({ 
                error: "Campo 'vehiculo' requerido para actualizar artículo individual",
                nota: "Este endpoint requiere multipart/form-data con el campo 'vehiculo' como JSON string"
            });
        }

        let datos;
        try {
            datos = JSON.parse(req.body.vehiculo);
        } catch (e) {
            console.error("Error parseando JSON:", e.message);
            return res.status(400).json({ error: "JSON inválido en 'vehiculo'", detalle: e.message });
        }

        // Si hay nueva imagen, actualizar la ruta
        if (req.file) {
            datos.imagen = `/uploads/${req.file.filename}`;
        }

        // Actualizar el artículo por ID
        const actualizado = await Articulo.findByIdAndUpdate(
            req.params.id,
            datos,
            { new: true, runValidators: true }
        );

        if (!actualizado) {
            return res.status(404).json({ error: "Artículo no encontrado" });
        }

        res.json(actualizado);

    } catch (err) {
        console.error("Error actualizando artículo:", err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// Eliminar artículo
router.delete("/:id", async (req, res) => {
    try {
        const eliminado = await Articulo.findByIdAndDelete(req.params.id);
        
        if (!eliminado) {
            return res.status(404).json({ error: "Artículo no encontrado" });
        }

        res.json({ mensaje: "Artículo eliminado correctamente", articulo: eliminado });
    } catch (err) {
        console.error("Error eliminando artículo:", err);
        res.status(500).json({ error: err.message });
    }
});

// Obtener artículo por ID
router.get("/:id", async (req, res) => {
    try {
        const articulo = await Articulo.findById(req.params.id);
        
        if (!articulo) {
            return res.status(404).json({ error: "Artículo no encontrado" });
        }

        res.json(articulo);
    } catch (err) {
        console.error("Error obteniendo artículo:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
