import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Layout",
        component: () => import("../views/Layout.vue"),
        // redirect: "/pay",
        // children: [
        //     {
        //         path: "pay",
        //         name: "Pay",
        //         component: () => import("../views/layout/Pay.vue"),
        //     },
        //     {
        //         path: "order",
        //         name: "Order",
        //         component: () => import("../views/layout/Order.vue"),
        //     },
        //     {
        //         path: "refund",
        //         name: "Refund",
        //         component: () => import("../views/layout/Refund.vue"),
        //     },
        //     {
        //         path: "member",
        //         name: "Member",
        //         component: () => import("../views/layout/Member.vue"),
        //     },
        //     {
        //         path: "product",
        //         name: "Product",
        //         component: () => import("../views/layout/Product.vue"),
        //     },
        //     {
        //         path: "more",
        //         name: "More",
        //         component: () => import("../views/layout/More.vue"),
        //     },
        // ]
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/404",
        name: "notFound",
        component: () => import("../views/NotFound.vue"),
        meta: {
            keepAlive: true
        }
    },
    // {
    //     path: "*",
    //     redirect: "/404"
    // }
];

const createRouter = () => new VueRouter({
    routes,
});

const router = createRouter()

export function resetRouter () {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // the relevant part
}

export default router;
