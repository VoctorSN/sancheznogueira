import axios from 'axios'

const API_URL = 'http://localhost:3000/noticias'

export const getNoticias = () => {
    return axios.get(`${API_URL}?_sort=fecha_publicacion&_order=desc`)
        .then(res => res.data)
}

export const addNoticia = (nuevaNoticia) => {
    return axios.post(API_URL, nuevaNoticia)
        .then(res => res.data)
}

export const deleteNoticia = (id) => {
    return axios.delete(`${API_URL}/${id}`)
        .then(res => res.data)
}

export const updateNoticia = (id, noticiaActualizada) => {
    return axios.put(`${API_URL}/${id}`, noticiaActualizada)
        .then(res => res.data)
}