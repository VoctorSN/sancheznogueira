import axios from 'axios';

const API_URL = 'http://localhost:5000/api/paypal';

export const obtenerConfigPayPal = async () => {
  try {
    const response = await axios.get(`${API_URL}/config`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener configuración de PayPal:', error);
    throw error;
  }
};

export const crearOrdenPayPal = async (items, total) => {
  try {
    const response = await axios.post(`${API_URL}/create-order`, {
      items,
      total
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear orden de PayPal:', error);
    throw error;
  }
};

export const capturarOrdenPayPal = async (orderID, items, total, dni) => {
  try {
    const response = await axios.post(`${API_URL}/capture-order`, {
      orderID,
      items: items.map(item => ({
        ...item,
        matricula: item.matricula || null
      })),
      total,
      dni
    });
    return response.data;
  } catch (error) {
    console.error('Error al capturar orden de PayPal:', error);
    throw error;
  }
};

export const obtenerOrdenPayPal = async (orderID) => {
  try {
    const response = await axios.get(`${API_URL}/order/${orderID}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener orden de PayPal:', error);
    throw error;
  }
};
