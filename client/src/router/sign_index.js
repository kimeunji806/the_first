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
    },
    {
        path: '/sign/access',
        name: 'accessWait',
        component: () => import('@/views/pages/sign/Access.vue')
    },
    {
        path: '/sign/find-password',
        name: 'findPassword',
        component: () => import('@/views/pages/sign/FIndPassword.vue')
    },
    {
        path: '/sign/reset-password',
        name: 'resetPassword',
        component: () => import('@/views/pages/sign/ResetPassword.vue')
    }
];
