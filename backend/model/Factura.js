import mongoose from "mongoose";

const facturaSchema = new mongoose.Schema({
  items: [
    {
      productoId: String,
      nombre: String,
      precio: Number,
      cantidad: Number,
      total: Number,
    },
  ],
  totalFactura: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  metodoPago: { type: String, enum: ['paypal', 'stripe'], required: true },
  estadoPago: { type: String, default: 'completado' },
  estado: { type: String, enum: ['activo', 'eliminado'], default: 'activo' },
  transaccionId: { type: String, required: true },
  cliente: {
    email: String,
    nombre: String,
    dni: String,
  }
},
  {
    collection: "facturas"
  });


export default mongoose.model("Factura", facturaSchema);