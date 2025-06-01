import { createWebHistory, createRouter } from "vue-router";
import * as views from '../views/views.js'

const routes = [
    {
        path: "/",
        name: "products",
        component: views.productsView
    },

    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: views.notFound
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;