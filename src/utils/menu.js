export const menuData = [
    {
        path: "pay",
        name: "Pay",
        component: 'Pay',
        meta: {
            icon: 'cashier',
            title: 'cashier',
            show: true,
            code: 'cs'
        },
    },
    {
        path: "order",
        name: "Order",
        component: 'Order',
        meta: {
            icon: 'order',
            title: 'order',
            show: true,
            code: 'ord'
        },
    },
    {
        path: "refund",
        name: "Refund",
        component: 'Refund',
        meta: {
            icon: 'refund',
            title: 'refund',
            show: true,
            code: 'ord.refund'
        },
    },
    {
        path: "voucher",
        name: "Voucher",
        component: 'Voucher',
        meta: {
            icon: '',
            title: '',
            show: false,
            code: 'ord.refund'
        },
    },
    {
        path: "product",
        name: "Product",
        component: 'Product',
        meta: {
            icon: 'stock',
            title: 'checkStock',
            show: true,
            code: 'prod'
        },
    },
    {
        path: "member",
        name: "Member",
        component: 'Member',
        meta: {
            icon: 'member',
            title: 'member',
            show: true,
            code: 'mbr'
        },
    },
    {
        path: "more",
        name: "More",
        component: 'More',
        meta: {
            icon: 'more',
            title: 'more',
            show: true,
            code: 'set'
        }
    }
]
