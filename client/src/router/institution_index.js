// export default [
//     {
//         path: '/mypage',
//         component: () => import('@/views/pages/mypage/MyPage.vue'),
//         children: [
//             {
//                 path: 'institutioninfo',
//                 name: 'institutioninfo',
//                 component: () => import('@/views/pages/InstitutionInfo.vue')
//             }
//         ]
//     }
// ];
export default [
    {
        path: '/institutioninfo',
        name: 'institutioninfo',
        component: () => import('@/views/pages/mypage/InstitutionInfo.vue')
    },
    {
        path: '/institutioninfo/edit',
        name: 'institutioninfoEdit',
        component: () => import('@/views/pages/mypage/InstitutionEdit.vue')
    }
];
