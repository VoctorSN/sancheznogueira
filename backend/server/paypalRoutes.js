import express from "express";
import pkg from "@paypal/paypal-server-sdk";
const { Client, Environment, LogLevel, OrdersController } = pkg;
import dotenv from "dotenv";
import Factura from "../model/Factura.js";

dotenv.config();

const router = express.Router();

// Configuración del cliente PayPal
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: process.env.PAYPAL_MODE === 'production' ? Environment.Production : Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);

// Obtener Client ID público (para el frontend)
router.get("/config", (req, res) => {
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID
  });
});

// Crear orden de pago
router.post("/create-order", async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || !total) {
      return res.status(400).json({ error: "Faltan items o total" });
    }

    const collect = {
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: "EUR",
              value: total.toFixed(2),
              breakdown: {
                itemTotal: {
                  currencyCode: "EUR",
                  value: total.toFixed(2)
                }
              }
            },
            items: items.map(item => ({
              name: item.nombre,
              unitAmount: {
                currencyCode: "EUR",
                value: item.precio.toFixed(2)
              },
              quantity: item.cantidad.toString()
            }))
          }
        ],
        applicationContext: {
          returnUrl: "http://localhost:5173/success",
          cancelUrl: "http://localhost:5173/cancel",
          brandName: "Sanchez Nogueira Motors",
          userAction: "PAY_NOW",
          landingPage: "BILLING",
          shippingPreference: "NO_SHIPPING"
        }
      },
      prefer: "return=representation",
    };

    const response = await ordersController.createOrder(collect);

    res.json({
      id: response.result.id,
      status: response.result.status
    });
  } catch (error) {
    console.error("Error al crear orden de PayPal:", error);
    res.status(500).json({
      error: "Error al crear la orden de PayPal",
      details: error.message
    });
  }
});

// Capturar pago
router.post("/capture-order", async (req, res) => {
  try {
    const { orderID, items, total } = req.body;

    if (!orderID) {
      return res.status(400).json({ error: "Falta orderID" });
    }

    const collect = {
      id: orderID,
      prefer: "return=representation",
    };

    const response = await ordersController.captureOrder(collect);

    // Si el pago fue exitoso, guardar la factura en MongoDB
    if (response.result.status === 'COMPLETED') {
      try {
        console.log('💾 Intentando guardar factura en MongoDB...');
        console.log('Items recibidos:', items);
        console.log('Total:', total);
        
        const factura = new Factura({
          items: items.map(item => ({
            productoId: item.id || item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
            total: item.precio * item.cantidad
          })),
          totalFactura: total,
          fecha: new Date(),
          metodoPago: 'paypal',
          estadoPago: 'completado',
          transaccionId: orderID,
          cliente: {
            email: response.result.payer?.email_address,
            nombre: response.result.payer?.name?.given_name + ' ' + response.result.payer?.name?.surname
          }
        });

        const facturaGuardada = await factura.save();
        console.log('✅ Factura guardada exitosamente:', facturaGuardada._id);
      } catch (dbError) {
        console.error('❌ Error al guardar factura en MongoDB:', dbError);
        console.error('Detalles del error:', dbError.message);
        console.error('Stack:', dbError.stack);
        // No detenemos la respuesta aunque falle el guardado
      }
    } else {
      console.log('⚠️ Pago no completado, estado:', response.result.status);
    }

    res.json({
      id: response.result.id,
      status: response.result.status,
      payer: response.result.payer,
      purchaseUnits: response.result.purchaseUnits
    });
  } catch (error) {
    console.error("Error al capturar orden de PayPal:", error);
    res.status(500).json({
      error: "Error al capturar el pago",
      details: error.message
    });
  }
});

// Obtener detalles de una orden
router.get("/order/:orderID", async (req, res) => {
  try {
    const { orderID } = req.params;

    const collect = {
      id: orderID,
    };

    const response = await ordersController.getOrder(collect);

    res.json(response.result);
  } catch (error) {
    console.error("Error al obtener orden de PayPal:", error);
    res.status(500).json({
      error: "Error al obtener la orden",
      details: error.message
    });
  }
});

export default router;
