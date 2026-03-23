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
        component: () => import('@/views/pages/InstitutionInfo.vue')
    },
    {
        path: '/institution/edit',
        name: 'institutioninfoEdit',
        component: () => import('@/views/pages/InstitutionEdit.vue')
    }
];
