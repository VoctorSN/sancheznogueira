import axios from "axios";

const API_URL = 'http://localhost:5000/api/articulos'

export const getArticulos = () => {
    return axios.get(API_URL)
        .then(res => res.data)
}

export const getArticulosById = (id) => {
    return axios.get(`${API_URL}/${id}`)
        .then(res => res.data)
}

export const addArticulo = (formData) => {
    return axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => res.data);
}

export const deleteArticulo = (id) => {
    return axios.delete(`${API_URL}/${id}`)
        .then(res => res.data)
}

export const updateArticulo = (id, articuloActualizado) => {
    console.log('📤 Enviando actualización para ID:', id);
    console.log('📦 Datos a enviar:');
    for (let [key, value] of articuloActualizado.entries()) {
        console.log(`  ${key}:`, value);
    }
    
    return axios.put(`${API_URL}/${id}`, articuloActualizado, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => res.data)
}

