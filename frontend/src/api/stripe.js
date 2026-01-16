import axios from 'axios'

const API_URL = 'http://localhost:5000/api/stripe'

export const obtenerConfigStripe = async () => {
  try {
    const response = await axios.get(`${API_URL}/config`)
    return response.data
  } catch (error) {
    console.error('Error al obtener configuración de Stripe:', error)
    throw error
  }
}

export const crearSesionStripe = async (items, total) => {
  try {
    const response = await axios.post(`${API_URL}/create-checkout-session`, {
      items,
      total
    })
    return response.data
  } catch (error) {
    console.error('Error al crear sesión de Stripe:', error)
    throw error
  }
}

export const verificarPagoStripe = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}/verify-payment/${sessionId}`)
    return response.data
  } catch (error) {
    console.error('Error al verificar pago de Stripe:', error)
    throw error
  }
}
