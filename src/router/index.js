import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import GestionClientes from "../components/GestionClientes.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import { createRouter, createWebHistory } from "vue-router";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import NoTicias from "../components/NoTicias.vue";
import MoDelos from "../components/MoDelos.vue";

const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: PaginaInicio
    },
    {
        path: '/clientes',
        name: 'GestionClientes',
        component: GestionClientes
    },
    {
        path: '/noticias',
        name: 'NoTicias',
        component: NoTicias
    },
    {
        path: '/modelos',
        name: 'MoDelos',
        component: MoDelos
    },
    {
        path: '/avisolegal',
        name: 'AvisoLegal',
        component: AvisoLegal
    },
    {
        path: '/politicaprivacidad',
        name: 'PoliticaPrivacidad',
        component: PoliticaPrivacidad
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router;