import { createWebHistory, createRouter } from "vue-router";
import * as views from '../views/views.js'

const routes = [
    {
        path: "/",
        name: "products",
        component: views.ProductView
    },

    {
        path: "/products/:id",
        name: "product.edit",
        component: views.ProductEditView,
        props: true
    },

    {
        path: "/products/create",
        name: "product.create",
        component: views.ProductEditView,
    },

    {
        path: "/employees",
        name: "employees",
        component: views.EmployeeView,
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