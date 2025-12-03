// models/Articulo.js
import mongoose from "mongoose";

const ArticuloSchema = new mongoose.Schema(
  {
    tipo: { type: String, required: true },
    matricula: { type: String, required: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    anio: { type: Number, required: true },
    estado: { type: String, default: "disponible" },

    kilometros: { type: Number, default: 0 },
    precio: { type: Number, required: true },

    combustible: { type: String, required: true },
    transmision: { type: String, required: true },
    potencia_cv: { type: Number, required: false },

    descripcion: { type: String },

    ubicacion: {
      provincia: { type: String, required: true },
      ciudad: { type: String, required: true }
    },

    contacto: {
      nombre: { type: String, required: true },
      telefono: { type: String, required: true },
      email: { type: String, required: true }
    },

    fecha_publicacion: {
      type: Date,
      default: Date.now
    },
    
    imagen_url: { type: String , required: false}
  },
  {
    collection: "articulos"
  }
);

export default mongoose.model("Articulo", ArticuloSchema);

