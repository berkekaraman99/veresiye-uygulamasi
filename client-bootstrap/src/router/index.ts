import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView/HomeView.vue"),
    },
    {
      path: "/customers",
      name: "customers",
      component: () => import("@/views/CustomersView/CustomersView.vue"),
    },
    {
      path: "/debt",
      name: "debt",
      component: () => import("@/views/DebtView/DebtView.vue"),
    },
    {
      path: "/receivable",
      name: "receivable",
      component: () => import("@/views/ReceivableView/ReceivableView.vue"),
    },
    {
      path: "/add-customer",
      name: "add-customer",
      component: () => import("@/views/AddCustomerView/AddCustomer.vue"),
    },
    {
      path: "/report",
      name: "report",
      component: () => import("@/views/ReportView/ReportView.vue"),
    },
  ],
});

export default router;
