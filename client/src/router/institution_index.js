export default [
    {
        // 기관정보조회-은지
        path: '/admin/institutions/:id',
        name: 'institutioninfo',
        component: () => import('@/views/pages/InstitutionInfo.vue')
    }
];
