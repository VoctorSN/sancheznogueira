import { login, verificarToken, soloAdmin, checkAdmin } from "./authController.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.get("/check-admin", checkAdmin);

router.get("/modelos",verificarToken, soloAdmin, (req, res) => {
    // Lógica para obtener modelos (solo accesible por admin)
    res.json({ message: `Hola ${req.user.dni}, estas autenticado como admin` });
});
router.get("/clientes",verificarToken, soloAdmin, (req, res) => {
    // Lógica para obtener modelos (solo accesible por admin)
    res.json({ message: `Hola ${req.user.dni}, estas autenticado como admin` });
});
router.get("/ventas",verificarToken, (req, res) => {
    // Lógica para obtener modelos (solo accesible por admin)
    res.json({ message: `Hola ${req.user.dni}, estas autenticado como admin` });
});
router.get("/noticias",verificarToken, soloAdmin, (req, res) => {
    // Lógica para obtener modelos (solo accesible por admin)
    res.json({ message: `Hola ${req.user.dni}, estas autenticado como admin` });
});
router.get("/taller",verificarToken, soloAdmin, (req, res) => {
    // Lógica para obtener modelos (solo accesible por admin)
    res.json({ message: `Hola ${req.user.dni}, estas autenticado como admin` });
});

export default router;