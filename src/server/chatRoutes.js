import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ruta para enviar mensajes al chat
router.post("/message", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido" });
    }

    // Usar el modelo Gemini 2.5 Flash (rápido y con mejores límites de cuota)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Configurar el contexto del chat si hay historial
    let chat;
    if (history && history.length > 0) {
      // Convertir el historial al formato de Gemini
      const formattedHistory = history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.9,
          topP: 1,
          topK: 40,
        },
      });
    } else {
      chat = model.startChat({
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.9,
          topP: 1,
          topK: 40,
        },
      });
    }

    // Enviar el mensaje y obtener la respuesta
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
    });
  } catch (error) {
    console.error("Error en el chat de Gemini:", error);
    res.status(500).json({
      success: false,
      error: "Error al procesar el mensaje",
      details: error.message,
    });
  }
});

export default router;
