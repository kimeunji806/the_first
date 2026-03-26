export default [
    {
        path: '/pages/mypage',
        name: 'userMyPage',
        component: () => import('@/views/pages/mypage/MyPage.vue')
    },
    {
        path: '/info/manager',
        name: 'managerInfo',
        component: () => import('@/views/pages/info/ManagerInfo.vue')
    }
];
