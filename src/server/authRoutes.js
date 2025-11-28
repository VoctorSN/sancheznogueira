import { login,verificarToken, soloAdmin } from "./authController.js";
import express from "express";

const router = express.Router();

router.post("/login", login);

router.get("/modelos",verificarToken, soloAdmin, (req, res) => {
    // Lógica para obtener modelos (solo accesible por admin)
    res.json({ message: `Hola ${req.user.dni}, estas autenticado como admin` });
});

export default router;