export default [
    {
        path: '/sign/login',
        name: 'login',
        component: () => import('@/views/pages/sign/Login.vue')
    },

    {
        path: '/sign/register',
        name: 'register',
        component: () => import('@/views/pages/sign/register.vue')
    },
    {
        path: '/sign/register/search',
        name: 'registerSearch',
        component: () => import('@/views/pages/sign/search.vue')
    }
        path: '/sign/access',
        name: 'accessWait',
        component: () => import('@/views/pages/sign/Access.vue')
        },
];
