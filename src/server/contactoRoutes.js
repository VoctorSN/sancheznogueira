import express from "express";
import dotenv from "dotenv";
import { Resend } from "resend";

// Cargar variables de entorno
dotenv.config();

const router = express.Router();

// Inicializar Resend con la API Key
const resend = new Resend(process.env.RESEND_API_KEY);

// Ruta POST para enviar correo
router.post("/", async (req, res) => {
    const { nombre, email, asunto, mensaje } = req.body;

    // Validar campos
    if (!nombre || !email || !asunto || !mensaje) {
        return res.status(400).json({ 
            success: false, 
            message: "Todos los campos son obligatorios" 
        });
    }

    try {
        // Enviar correo con Resend
        const { data, error } = await resend.emails.send({
            from: "Contacto <onboarding@resend.dev>",
            to: [process.env.EMAIL_TO], // Tu email configurado en .env
            subject: `Nuevo mensaje de contacto: ${asunto}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0d6efd;">Nuevo mensaje de contacto</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Asunto:</strong> ${asunto}</p>
                    </div>
                    <div style="margin: 20px 0;">
                        <h3 style="color: #0d6efd;">Mensaje:</h3>
                        <p style="white-space: pre-wrap;">${mensaje}</p>
                    </div>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 12px;">
                        Este mensaje fue enviado desde el formulario de contacto de tu sitio web.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("Error al enviar correo:", error);
            return res.status(400).json({ 
                success: false, 
                message: "Error al enviar el correo",
                error: error.message 
            });
        }

        console.log("Correo enviado exitosamente:", data);
        res.status(200).json({ 
            success: true, 
            message: "Correo enviado correctamente",
            data 
        });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor",
            error: error.message 
        });
    }
});

export default router;
