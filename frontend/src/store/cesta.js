// Importamos la función defineStore de Pinia
// lo que nos permite crear un store que puede ser usado en cualquier componente
import { defineStore } from 'pinia'

// Creamos el store de la cesta
// 'cesta' es el id del store, usado internamente por Pinia
export const useCestaStore = defineStore('cesta', {

    // -------------------
    // STATE IMPORTANTE
    // -------------------
    state: () => ({
        // Array que contendrá los productos que el usuario añade a la cesta
        items: []
    }),

    // -------------------
    // GETTERS
    // -------------------
    getters: {
        // Calcula el total de productos en la cesta
        // Reduce el array sumando la propiedad 'cantidad'
        totalItems(state) {
            return state.items.reduce((total, item) => total + item.cantidad, 0)
        },

        // Calcula el precio total de la cesta
        // Suma el precio de cada producto multiplicado por su cantidad
        // IMPORTANTE: SE PODRÍA AÑADIR DESCUENTOS, IVA, etc
        totalPrecio(state) {
            return state.items.reduce(
                (total, item) => total + item.precio * item.cantidad,
                0
            )
        }
    },

    actions: {
        // Añade un producto a la cesta
        addProducto(producto) {
            // Buscamos si el producto ya está en la cesta
            const existente = this.items.find(item => item.id === producto.id)
            if (existente) {
                // Si ya existe, incrementamos la cantidad del mismo producto
                existente.cantidad++
            } else {
                // Si no existe, lo añadimos con cantidad inicial 1
                this.items.push({
                    ...producto, // copiamos todas las propiedades del producto
                    cantidad: 1
                })
            }
        },

        // Elimina un producto de la cesta por su id
        removeProducto(id) {
            this.items = this.items.filter(item => item.id !== id)
        },

        // Incrementa la cantidad de un producto
        incrementar(id) {
            const item = this.items.find(item => item.id === id)
            if (item) item.cantidad++
        },

        // Decrementa la cantidad de un producto, sin permitir que sea menor que 1
        decrementar(id) {
            const item = this.items.find(item => item.id === id && item.cantidad > 1)
            if (item) item.cantidad--
        },

        // Vacía toda la cesta
        clearCesta() {
            this.items = []
        }
    }
}) 