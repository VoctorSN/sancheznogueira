import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { dni, password } = req.body;

    try {
        const response = await axios.get(`http://localhost:3000/clientes?dni=${dni}`);
        const user = response.data[0];

        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        const ok = await bcrypt.compare(password, user.password);
        

        if (!ok) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const historico = user.historico
        if (historico) return res.status(400).json({ message: 'Usuario Historico' });

        const token = jwt.sign(
            {
                dni: user.dni,
                tipo: user.tipo || 'user',
                name: user.nombre
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token, nombre: user.nombre, tipo: user.tipo || 'user' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

/////////////// MEJOR EN UN FICHERO APARTE authMiddleware.js

// Middleware: verificar JWT
// Se usa en rutas que requieren autenticación
// Verifica el token enviado en el header Authorization

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // Authorization: Bearer <token>
    
    if (!authHeader) return res.status(401).json({ mensaje: "Token no recibido" });
    
    const token = authHeader.split(" ")[1]; // separar "Bearer" del token
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // guardar info del usuario en req
        next(); // continuar al controlador
    } catch (err) {
        return res.status(403).json({ mensaje: "Token inválido" });
    }
};


/// TAMBIEN EN EL FICHERO APARTE authMiddleware.js
// Middleware: solo admin
export const soloAdmin = (req, res, next) => {
    if (req.user?.tipo !== "admin") {
        return res.status(403).json({ mensaje: "Acceso solo para administradores" });
    }
    next();
};

// Función para verificar si el token pertenece a un admin
export const checkAdmin = (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ isAdmin: false, mensaje: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const isAdmin = decoded.tipo === "admin";
        
        
        res.json({ 
            isAdmin, 
            tipo: decoded.tipo,
            dni: decoded.dni,
            name: decoded.name
        });
    } catch (err) {
        return res.status(403).json({ isAdmin: false, mensaje: "Token inválido o expirado" });
    }
};

// Función para verificar el token y devolver el DNI contenido en él
export const checkDni = (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ valid: false, message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Decodificar el token y extraer el DNI directamente de él
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // El DNI viene del token, no del cliente, por lo que es confiable
        return res.json({ 
            valid: true, 
            message: "Token válido",
            dni: decoded.dni,
            tipo: decoded.tipo,
            name: decoded.name
        });
    } catch (err) {
        return res.status(403).json({ valid: false, message: "Token inválido o expirado" });
    }
};
