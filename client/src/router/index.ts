import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView/HomeView.vue"),
  },
  {
    path: "/auth",
    name: "auth",
    component: () => import("@/views/AuthView/AuthView.vue"),
  },
  {
    path: "/customer/:customer_id",
    name: "customer",
    component: () => import("@/views/CustomerView/CustomerView.vue"),
    props: (route: any) => ({ customer_id: route.params.customer_id }),
  },
  {
    path: "/customers",
    name: "customers",
    component: () => import("@/views/CustomersView/CustomersView.vue"),
  },
  {
    path: "/create-receipt/:receipt_type?",
    name: "create-receipt",
    component: () => import("@/views/CreateReceiptView/CreateReceiptView.vue"),
    props: (route: any) => ({ receipt_type: Number(route.params.receipt_type) }),
  },
  {
    path: "/create-customer",
    name: "create-customer",
    component: () => import("@/views/CreateCustomerView/CreateCustomerView.vue"),
  },
  {
    path: "/edit-customer/:customer_id",
    name: "edit-customer",
    component: () => import("@/views/EditCustomerView/EditCustomerView.vue"),
    props: (route: any) => ({ customer_id: route.params.customer_id }),
  },
  {
    path: "/edit-receipt/:receipt_id",
    name: "edit-receipt",
    component: () => import("@/views/EditReceiptView/EditReceiptView.vue"),
    props: (route: any) => ({ receipt_id: route.params.receipt_id }),
  },
  {
    path: "/search-customer",
    name: "search-customer",
    component: () => import("@/views/SearchCustomerView/SearchCustomerView.vue"),
  },
  {
    path: "/receipt/:receipt_id",
    name: "receipt",
    component: () => import("@/views/ReceiptView/ReceiptView.vue"),
    props: (route: any) => ({ receipt_id: route.params.receipt_id }),
  },
  {
    path: "/report",
    name: "report",
    component: () => import("@/views/ReportView/ReportView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
