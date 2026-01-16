import express from 'express'
import Stripe from 'stripe'

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
    const { items, total } = req.body

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
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cancel`,
      metadata: {
        total: total.toString()
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

// Verificar el pago
router.get('/verify-payment/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = await stripe.checkout.sessions.retrieve(sessionId)

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
    console.log('Webhook secret no configurado')
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
      console.log('Pago completado:', session.id)
      // Aquí puedes guardar el pedido en la base de datos
      break
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('Payment Intent exitoso:', paymentIntent.id)
      break
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log('Pago fallido:', failedPayment.id)
      break
    default:
      console.log(`Evento no manejado: ${event.type}`)
  }

  res.json({ received: true })
})

export default router
