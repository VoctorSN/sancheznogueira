import axios from 'axios'
//  librería de JavaScript que actúa como un cliente HTTP 
// para realizar solicitudes entre el navegador y el servidor,
// URL base de la "API". Si usas json-server local, asegúrate de la IP:
const API_URL = 'http://localhost:3000/clientes'

// Función para obtener la lista de clientes desde la API

export const getClientes = () => {
  return axios.get(`${API_URL}?_sort=apellidos&_order=asc&historico=true`)
              .then(res => res.data)
}

export const deleteCliente = (id) => {
  return axios.patch(`${API_URL}/${id}`, {historico: false})
              .then(res => res.data)
}