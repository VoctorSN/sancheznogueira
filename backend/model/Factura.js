import mongoose from "mongoose";

///TODO fix this model and make it work and save
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