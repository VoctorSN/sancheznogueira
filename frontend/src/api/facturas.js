import axios from 'axios';

const API_URL = 'http://localhost:5000/api/facturas';

// Obtener todas las facturas
export const obtenerFacturas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    throw error;
  }
};

// Obtener una factura por ID
export const obtenerFacturaPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener factura:', error);
    throw error;
  }
};

// Obtener facturas por email de cliente
export const obtenerFacturasPorCliente = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/cliente/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturas del cliente:', error);
    throw error;
  }
};

// Obtener facturas por DNI de cliente
export const obtenerFacturasPorDni = async (dni) => {
  try {
    const response = await axios.get(`${API_URL}/cliente/dni/${dni}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener facturas del cliente por DNI:', error);
    throw error;
  }
};

// Obtener factura para imprimir
export const obtenerFacturaParaImprimir = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/imprimir/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener factura para imprimir:', error);
    throw error;
  }
};

// Eliminar una factura
export const eliminarFactura = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    throw error;
  }
};
