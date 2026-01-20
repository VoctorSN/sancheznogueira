import express from 'express'
import Stripe from 'stripe'
import Factura from '../model/Factura.js'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Obtener la clave pública de Stripe
router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  })
})

// Crear sesión de checkout de Stripe
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, total, dni } = req.body

    // Construir los line items para Stripe
    const lineItems = items.map(item => {
      const productData = {
        name: item.nombre
      }
      
      // Solo incluir descripción si existe y no está vacía
      if (item.descripcion && item.descripcion.trim() !== '') {
        productData.description = item.descripcion
      }
      
      return {
        price_data: {
          currency: 'eur',
          product_data: productData,
          unit_amount: Math.round(item.precio * 100) // Stripe usa centavos
        },
        quantity: item.cantidad
      }
    })

    // Crear la sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:5000/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cancel`,
      metadata: {
        total: total.toString(),
        dni: dni || ''
      }
    })

    res.json({ 
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Error al crear sesión de Stripe:', error)
    res.status(500).json({ 
      error: 'Error al crear sesión de pago',
      details: error.message 
    })
  }
})

// Endpoint de éxito que verifica, guarda y redirecciona
router.get('/success', async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/cancel`);
    }

    console.log('💾 Stripe success callback, sessionId:', session_id);

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items']
    });

    console.log('Estado del pago:', session.payment_status);

    // Si el pago fue exitoso, guardar la factura en MongoDB
    if (session.payment_status === 'paid') {
      try {
        console.log('💾 Intentando guardar factura de Stripe en MongoDB...');
        
        // Verificar si ya existe una factura con esta transacción
        const facturaExistente = await Factura.findOne({ transaccionId: session_id });
        
        if (facturaExistente) {
          console.log('⚠️ La factura ya existe:', facturaExistente._id);
        } else {
          const items = session.line_items.data.map(item => ({
            productoId: item.price.product,
            nombre: item.description || 'Producto',
            precio: item.price.unit_amount / 100,
            cantidad: item.quantity,
            total: (item.price.unit_amount / 100) * item.quantity
          }));

          console.log('Items procesados:', items);

          const factura = new Factura({
            items: items,
            totalFactura: session.amount_total / 100,
            fecha: new Date(),
            metodoPago: 'stripe',
            estadoPago: 'completado',
            transaccionId: session_id,
            cliente: {
              email: session.customer_details?.email,
              nombre: session.customer_details?.name,
              dni: session.metadata?.dni || null
            }
          });

          const facturaGuardada = await factura.save();
          console.log('✅ Factura de Stripe guardada exitosamente:', facturaGuardada._id);
        }
      } catch (dbError) {
        console.error('❌ Error al guardar factura de Stripe en MongoDB:', dbError);
        console.error('Detalles del error:', dbError.message);
      }
    } else {
      console.log('⚠️ Pago de Stripe no completado, estado:', session.payment_status);
    }

    // Redirigir al frontend
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/success`);
  } catch (error) {
    console.error('❌ Error en callback de éxito de Stripe:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/cancel`);
  }
});

// Verificar el pago (endpoint legacy para uso manual si es necesario)
router.get('/verify-payment/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params
    console.log('💾 Verificando pago de Stripe, sessionId:', sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    })

    console.log('Estado del pago:', session.payment_status);

    // Si el pago fue exitoso, guardar la factura en MongoDB
    if (session.payment_status === 'paid') {
      try {
        console.log('💾 Intentando guardar factura de Stripe en MongoDB...');
        
        // Verificar si ya existe una factura con esta transacción
        const facturaExistente = await Factura.findOne({ transaccionId: sessionId });
        
        if (facturaExistente) {
          console.log('⚠️ La factura ya existe:', facturaExistente._id);
        } else {
          const items = session.line_items.data.map(item => ({
            productoId: item.price.product,
            nombre: item.description || 'Producto',
            precio: item.price.unit_amount / 100,
            cantidad: item.quantity,
            total: (item.price.unit_amount / 100) * item.quantity
          }));

          console.log('Items procesados:', items);

          const factura = new Factura({
            items: items,
            totalFactura: session.amount_total / 100,
            fecha: new Date(),
            metodoPago: 'stripe',
            estadoPago: 'completado',
            transaccionId: sessionId,
            cliente: {
              email: session.customer_details?.email,
              dni: session.metadata?.dni || null,
              nombre: session.customer_details?.name
            }
          });

          const facturaGuardada = await factura.save();
          console.log('✅ Factura de Stripe guardada exitosamente:', facturaGuardada._id);
        }
      } catch (dbError) {
        console.error('❌ Error al guardar factura de Stripe en MongoDB:', dbError);
        console.error('Detalles del error:', dbError.message);
        console.error('Stack:', dbError.stack);
        // No detenemos la respuesta aunque falle el guardado
      }
    } else {
      console.log('⚠️ Pago de Stripe no completado, estado:', session.payment_status);
    }

    res.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total / 100 // Convertir de centavos a euros
    })
  } catch (error) {
    console.error('Error al verificar pago:', error)
    res.status(500).json({ 
      error: 'Error al verificar el pago',
      details: error.message 
    })
  }
})

// Webhook para eventos de Stripe (opcional pero recomendado)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('Webhook secret no configurado')
    return res.sendStatus(200)
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Error al verificar webhook:', err)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Manejar el evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      // Aquí puedes guardar el pedido en la base de datos
      break
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      break
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      break
    default:
  }

  res.json({ received: true })
})

export default router
