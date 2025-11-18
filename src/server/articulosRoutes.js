// server/articulosRoutes.js
import express from "express";
import Articulo from "../modelos/Articulo.js";

const router = express.Router();
console.log("Router articulos cargado"); // para depurar

// Definir rutas
router.get("/", async (req, res) => {
    try {
        console.log("📥 Petición GET recibida en /api/articulos");
        const articulos = await Articulo.find();
        console.log("✅ Artículos encontrados:", articulos.length);
        res.json(articulos);
    } catch (err) {
        console.error("❌ Error en GET /api/articulos:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const articulo = new Articulo(req.body);
        const guardado = await articulo.save();
        res.json(guardado);
    } catch (err) {
        res.status(500).json({ error: "Error al guardar artículo" });
    }
});

// otras rutas PUT, DELETE, GET /:id igual

export default router;
