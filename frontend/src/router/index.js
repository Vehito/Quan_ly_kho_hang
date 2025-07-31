import { createWebHistory, createRouter } from "vue-router";
import * as views from '../views/views.js'
import { useUserStore } from "@/utils/pinia.util.js";

const routes = [
    {
        path: "/login",
        name: "login",
        component: views.LoginView
    },
    {
        path: "/change_password/:id",
        name: "change_password",
        component: views.ChangePasswordView,
        props: true
    },
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
        path: "/products/expire",
        name: "product.expire",
        component: views.ExpireProductView,
    },
    {
        path: "/products/detail/:id",
        name: "product.detail",
        component: views.ProductDetailView,
        props: true
    },
    {
        path: "/employees",
        name: "employees",
        component: views.EmployeeView,
    },
    {
        path: "/employees/create",
        name: "employee.create",
        component: views.EmployeeEditView,
    },
    {
        path: "/employees/:id",
        name: "employee.edit",
        component: views.EmployeeEditView,
        props: true
    },
    {
        path: "/customers",
        name: "customers",
        component: views.CustomerView,
    },
    {
        path: "/customers/create",
        name: "customer.create",
        component: views.CustomerEditView,
    },
    {
        path: "/customers/:id",
        name: "customer.edit",
        component: views.CustomerEditView,
        props: true
    },
    {
        path: "/suppliers",
        name: "suppliers",
        component: views.SupplierView,
    },
    {
        path: "/suppliers/create",
        name: "supplier.create",
        component: views.SupplierEditView,
    },
    {
        path: "/suppliers/:id",
        name: "supplier.edit",
        component: views.SupplierEditView,
        props: true
    },
    {
        path: "/import_shipments",
        name: "import_shipments",
        component: views.ImportShipmentView,
    },
    {
        path: "/import_shipments/create",
        name: "import_shipment.create",
        component: views.ImportShipmentEditView,
    },
    {
        path: "/import_shipments/:id",
        name: "import_shipment.detail",
        component: views.ImportShipmentDetailView,
        props: true
    },
    {
        path: "/export_shipments",
        name: "export_shipments",
        component: views.ExportShipmentView,
    },
    {
        path: "/export_shipments/create",
        name: "export_shipment.create",
        component: views.ExportShipmentEditView,
    },
    {
        path: "/export_shipments/:id",
        name: "export_shipment.detail",
        component: views.ExportShipmentDetailView,
        props: true
    },
    {
        path: "/report",
        name: "report",
        component: views.ReportView
    },
    {
        path: "/product_report",
        name: "product_report",
        component: views.ProductReportView
    },
    {
        path: "/monthly_payrolls",
        name: "monthly_payrolls",
        component: views.MonthlyPayrollView
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

router.beforeEach((to, from, next) => {
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    
    const userStore = useUserStore();

    if(authRequired && !userStore.isLoggedIn) {
        return next({name: 'login'});
    }

    next();
});

export default router;