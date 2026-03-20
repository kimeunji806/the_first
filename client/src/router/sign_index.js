export default [
    {
        path: '/sign/login',
        name: 'login',
        component: () => import('@/views/pages/sign/Login.vue')
    },
    
]
        path: '/sign/register',
        name: 'register',
        component: () => import('@/views/pages/sign/register.vue')
    }
];
