import NotFound from "../components/NotFound.vue";
import PaginaInicio from "../components/PaginaInicio.vue";
import GestionClientes from "../components/GestionClientes.vue";
import AvisoLegal from "../components/AvisoLegal.vue";
import { createRouter, createWebHistory } from "vue-router";
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue";
import NoTicias from "../components/NoTicias.vue";
import VenTas from "../components/VenTas.vue";
import CitasTaller from "../components/CitasTaller.vue";
import MoDelos from "../components/MoDelos.vue";
import TablaLogin from "../components/TablaLogin.vue";
import ContacTo from "../components/ContacTo.vue";
import BusCar from "../components/BusCar.vue";
import CesTa from "../components/CesTa.vue";
import PaymentSuccess from "../components/PaymentSuccess.vue";
import PaymentCancel from "../components/PaymentCancel.vue";
import MisFacturas from "../components/MisFacturas.vue";
import VerFactura from "../components/VerFactura.vue";

const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: PaginaInicio
    },
    {
        path: '/login',
        name: 'TablaLogin',
        component: TablaLogin
    },
    {
        path: '/contacto',
        name: 'ContacTo',
        component: ContacTo
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
        path: '/cesta',
        name: 'CesTa',
        component: CesTa
    },
    {
        path: '/modelos',
        name: 'MoDelos',
        component: MoDelos,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/ventas',
        name: 'VenTas',
        component: VenTas
        /* meta: {
            requiresAuth: true,
        } */
    },
    {
        path: '/taller',
        name: 'CitasTaller',
        component: CitasTaller
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
        path: '/buscar',
        name: 'BusCar',
        component: BusCar
    },
    {
        path: '/success',
        name: 'PaymentSuccess',
        component: PaymentSuccess
    },
    {
        path: '/cancel',
        name: 'PaymentCancel',
        component: PaymentCancel
    },
    {
        path: '/facturas',
        name: 'MisFacturas',
        component: MisFacturas,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/factura/:id',
        name: 'VerFactura',
        component: VerFactura,
        meta: {
            requiresAuth: true
        }
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

router.beforeEach(async (to, from, next) => {
    const token = sessionStorage.getItem('token');
    if (to.meta.requiresAuth) {
        if (!token) {            
            return next("/login");
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/check-admin", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            if (to.meta.requiresAdmin && data.tipo !== "admin") {                
                return next("/");
            }
            return next()
        }
        catch (err) {
            console.error("Token invalido: ", err);
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userName');
            return next("/login");
        }

    }
    return next();
})


export default router;