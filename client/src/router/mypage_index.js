export default [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: 'pages/mypage',
                name: 'userMyPage',
                component: () => import('@/views/pages/mypage/MyPage.vue')
            }
        ]
    }
];

