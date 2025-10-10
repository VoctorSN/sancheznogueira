import axios from 'axios'
//  librería de JavaScript que actúa como un cliente HTTP 
// para realizar solicitudes entre el navegador y el servidor,
// URL base de la "API". Si usas json-server local, asegúrate de la IP:
const API_URL = 'http://localhost:3000/clientes'

// Función para obtener la lista de clientes desde la API

export const getClientes = (historico = false) => {
  let filtros = ''
  if(!historico){
    filtros += '&historico=false'
  }
  return axios.get(`${API_URL}?_sort=apellidos&_order=asc${filtros}`)
              .then(res => res.data)
}

export const deleteCliente = (id) => {
  return axios.patch(`${API_URL}/${id}`, {historico: false})
              .then(res => res.data)
}

// Función para agregar cliente nuevo
export const addCliente = (nuevoCliente) => {
  return axios.post(API_URL, nuevoCliente)
    .then(res => res.data)
}
// Función para actualizar un cliente por su id
export const updateCliente = (id, clienteActualizado) => {
  return axios.put(`${API_URL}/${id}`, clienteActualizado)
    .then(res => res.data)
}
