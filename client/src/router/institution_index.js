export default [
    {
        path: '/mypage',
        component: () => import('@/views/pages/mypage/MyPage.vue'),
        children: [
            {
                // 기관정보조회-은지
                path: '/mypage/institutions',
                name: 'institutioninfo',
                component: () => import('@/views/pages/InstitutionInfo.vue')
            }
        ]
    }
];
