export default [
    // {
    //     path: '/institutioninfo',
    //     name: 'institutioninfo',
    //     component: () => import('@/views/pages/InstitutionInfo.vue')
    // },
    // {
    //     path: '/institution/edit',
    //     name: 'institutioninfoEdit',
    //     component: () => import('@/views/pages/InstitutionEdit.vue')
    // },
    {
        path: '/institutioninfo',
        name: 'institutioninfo',
        component: () => import('@/views/pages/mypage/InstitutionInfo.vue')
    },
    {
        path: '/institutioninfo/edit',
        name: 'institutioninfo-edit',
        component: () => import('@/views/pages/mypage/InstitutionInfoEdit.vue')
    }
];
