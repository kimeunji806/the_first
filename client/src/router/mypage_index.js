export default [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: 'pages/mypage',
                name: 'userMyPage',
                component: () => import('@/views/pages/mypage/MyPage.vue')
            },
            {
                path: 'institutions',
                name: 'Institutioninfo',
                component: () => import('@/views/pages/InstitutionInfo.vue')
            }
        ]
    }
];
